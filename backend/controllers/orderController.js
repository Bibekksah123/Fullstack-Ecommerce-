const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Coupon = require('../models/Coupon');
const Notification = require('../models/Notification');
const { sendEmail, emailTemplates } = require('../utils/sendEmail');

// @desc    Create order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, paymentMethod, couponCode, customerNote, useWallet } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  // Validate and calculate prices
  let itemsPrice = 0;
  const orderItems = [];

  for (const item of items) {
    const product = await Product.findById(item.product).populate('seller', '_id name');
    if (!product || !product.isActive) {
      res.status(404);
      throw new Error(`Product not found: ${item.product}`);
    }
    if (product.stock < item.quantity) {
      res.status(400);
      throw new Error(`Insufficient stock for ${product.name}`);
    }

    const price = product.discountPrice > 0 ? product.discountPrice : product.price;
    itemsPrice += price * item.quantity;

    orderItems.push({
      product: product._id,
      seller: product.seller._id,
      name: product.name,
      image: product.thumbnail || product.images[0] || '',
      price,
      quantity: item.quantity,
      variant: item.variant || {},
    });
  }

  const shippingPrice = itemsPrice >= 2000 ? 0 : 150;
  const taxPrice = Math.round(itemsPrice * 0.05); // 5% tax
  let discountAmount = 0;
  let couponId = null;

  // Apply coupon
  if (couponCode) {
    const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
    if (coupon) {
      const validation = coupon.isValid(req.user._id, itemsPrice);
      if (validation.valid) {
        discountAmount = coupon.calcDiscount(itemsPrice);
        couponId = coupon._id;
        coupon.usedCount += 1;
        coupon.usedBy.push(req.user._id);
        await coupon.save();
      }
    }
  }

  // Apply wallet balance
  const user = await User.findById(req.user._id);
  let walletUsed = 0;
  if (useWallet && user.walletBalance > 0) {
    const totalBeforeWallet = itemsPrice + shippingPrice + taxPrice - discountAmount;
    walletUsed = Math.min(user.walletBalance, totalBeforeWallet);
    discountAmount += walletUsed;
    user.walletBalance -= walletUsed;
  }

  const totalPrice = Math.max(0, itemsPrice + shippingPrice + taxPrice - discountAmount);

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    discountAmount,
    totalPrice,
    coupon: couponId,
    customerNote,
    estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days
    isPaid: paymentMethod === 'cod' ? false : false,
  });

  // Reduce stock
  for (const item of orderItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity, sold: item.quantity },
    });
  }

  // Add loyalty points (1 point per Rs.10 spent)
  const pointsEarned = Math.floor(totalPrice / 10);
  user.loyaltyPoints += pointsEarned;

  // Clear cart
  user.cart = [];
  await user.save({ validateBeforeSave: false });

  // Create notification
  await Notification.create({
    user: req.user._id,
    type: 'order',
    title: 'Order Placed!',
    message: `Your order #${order.orderNumber} has been placed successfully.`,
    link: `/orders/${order._id}`,
    data: { orderId: order._id },
  });

  // Emit socket notification
  if (req.app.get('io')) {
    req.app.get('io').to(req.user._id.toString()).emit('notification', {
      type: 'order',
      message: `Order #${order.orderNumber} placed!`,
    });
  }

  // Send confirmation email
  try {
    const emailData = emailTemplates.orderConfirmation(req.user.name, order.orderNumber, order.totalPrice);
    await sendEmail({ to: req.user.email, ...emailData });
  } catch { /* non-blocking */ }

  await order.populate('items.product', 'name thumbnail');

  res.status(201).json({
    success: true,
    data: order,
    message: 'Order placed successfully',
    pointsEarned,
  });
});

// @desc    Get my orders
// @route   GET /api/orders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;

  const filter = { user: req.user._id };
  if (status) filter.status = status;

  const skip = (Number(page) - 1) * Number(limit);

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit))
      .populate('items.product', 'name thumbnail')
      .select('-__v'),
    Order.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: orders,
    pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
  });
});

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('items.product', 'name thumbnail images')
    .populate('coupon', 'code type value');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to view this order');
  }

  res.json({ success: true, data: order });
});

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (order.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  if (!['pending', 'confirmed'].includes(order.status)) {
    res.status(400);
    throw new Error('Order cannot be cancelled at this stage');
  }

  order.status = 'cancelled';
  order.timeline.push({ status: 'cancelled', message: req.body.reason || 'Cancelled by customer' });

  // Restore stock
  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: item.quantity, sold: -item.quantity },
    });
  }

  // Refund to wallet if paid
  if (order.isPaid) {
    await User.findByIdAndUpdate(order.user, { $inc: { walletBalance: order.totalPrice } });
    order.timeline.push({ status: 'cancelled', message: `Refund of Rs.${order.totalPrice} added to wallet` });
  }

  await order.save();

  res.json({ success: true, data: order, message: 'Order cancelled successfully' });
});

// @desc    Request return
// @route   PUT /api/orders/:id/return
// @access  Private
const requestReturn = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (order.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  if (order.status !== 'delivered') {
    res.status(400);
    throw new Error('Return can only be requested for delivered orders');
  }

  order.status = 'return_requested';
  order.returnReason = req.body.reason;
  order.returnRequestedAt = new Date();
  order.timeline.push({ status: 'return_requested', message: `Return requested: ${req.body.reason}` });

  await order.save();

  res.json({ success: true, data: order, message: 'Return request submitted' });
});

module.exports = { createOrder, getMyOrders, getOrder, cancelOrder, requestReturn };
