const asyncHandler = require('express-async-handler');
const Seller = require('../models/Seller');
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');

// @desc    Register as seller
// @route   POST /api/seller/register
// @access  Private
const registerSeller = asyncHandler(async (req, res) => {
  const existingSeller = await Seller.findOne({ user: req.user._id });
  if (existingSeller) {
    res.status(400);
    throw new Error('You are already registered as a seller');
  }

  const seller = await Seller.create({
    user: req.user._id,
    storeName: req.body.storeName,
    description: req.body.description,
    phone: req.body.phone,
    address: req.body.address,
  });

  // Update user role
  await User.findByIdAndUpdate(req.user._id, { role: 'seller' });

  res.status(201).json({ success: true, data: seller, message: 'Seller account created! Awaiting verification.' });
});

// @desc    Get seller profile
// @route   GET /api/seller/profile
// @access  Private (seller)
const getSellerProfile = asyncHandler(async (req, res) => {
  const seller = await Seller.findOne({ user: req.user._id }).populate('user', 'name email avatar');

  if (!seller) {
    res.status(404);
    throw new Error('Seller profile not found');
  }

  res.json({ success: true, data: seller });
});

// @desc    Update seller profile
// @route   PUT /api/seller/profile
// @access  Private (seller)
const updateSellerProfile = asyncHandler(async (req, res) => {
  const updateData = { ...req.body };
  if (req.file) updateData.logo = `/uploads/products/${req.file.filename}`;

  const seller = await Seller.findOneAndUpdate({ user: req.user._id }, updateData, { new: true });

  if (!seller) {
    res.status(404);
    throw new Error('Seller profile not found');
  }

  res.json({ success: true, data: seller, message: 'Profile updated' });
});

// @desc    Get seller products
// @route   GET /api/seller/products
// @access  Private (seller)
const getSellerProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, isActive } = req.query;
  const filter = { seller: req.user._id };

  if (search) filter.$or = [{ name: new RegExp(search, 'i') }, { brand: new RegExp(search, 'i') }];
  if (isActive !== undefined) filter.isActive = isActive === 'true';

  const skip = (Number(page) - 1) * Number(limit);

  const [products, total] = await Promise.all([
    Product.find(filter).populate('category', 'name').sort('-createdAt').skip(skip).limit(Number(limit)),
    Product.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: products,
    pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
  });
});

// @desc    Get seller orders
// @route   GET /api/seller/orders
// @access  Private (seller)
const getSellerOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;

  const filter = { 'items.seller': req.user._id };
  if (status) filter.status = status;

  const skip = (Number(page) - 1) * Number(limit);

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate('user', 'name email')
      .populate('items.product', 'name thumbnail')
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit)),
    Order.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: orders,
    pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
  });
});

// @desc    Update order status (seller)
// @route   PUT /api/seller/orders/:id/status
// @access  Private (seller)
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, message } = req.body;
  const validTransitions = {
    confirmed: ['processing'],
    processing: ['shipped'],
    shipped: ['delivered'],
  };

  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Verify seller owns items in this order
  const sellerItems = order.items.filter((item) => item.seller?.toString() === req.user._id.toString());
  if (sellerItems.length === 0) {
    res.status(403);
    throw new Error('Not authorized to update this order');
  }

  const allowed = validTransitions[order.status] || [];
  if (!allowed.includes(status)) {
    res.status(400);
    throw new Error(`Cannot transition from '${order.status}' to '${status}'`);
  }

  order.status = status;
  order.timeline.push({ status, message: message || `Order status updated to ${status}` });

  if (status === 'delivered') {
    order.isDelivered = true;
    order.deliveredAt = new Date();

    // Credit seller earnings
    const orderTotal = sellerItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    await Seller.findOneAndUpdate({ user: req.user._id }, {
      $inc: { totalEarnings: orderTotal * 0.9, pendingEarnings: orderTotal * 0.9, totalOrders: 1, totalSales: orderTotal },
    });
  }

  await order.save();

  // Socket notification to buyer
  if (req.app.get('io')) {
    req.app.get('io').to(order.user.toString()).emit('notification', {
      type: 'order',
      message: `Your order #${order.orderNumber} is now ${status}`,
    });
  }

  res.json({ success: true, data: order, message: `Order updated to ${status}` });
});

// @desc    Get seller analytics
// @route   GET /api/seller/analytics
// @access  Private (seller)
const getSellerAnalytics = asyncHandler(async (req, res) => {
  const sellerId = req.user._id;

  const [seller, totalProducts, recentOrders] = await Promise.all([
    Seller.findOne({ user: sellerId }),
    Product.countDocuments({ seller: sellerId }),
    Order.find({ 'items.seller': sellerId, status: { $ne: 'cancelled' } })
      .sort('-createdAt')
      .limit(5)
      .populate('user', 'name'),
  ]);

  // Monthly revenue for past 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlyRevenue = await Order.aggregate([
    {
      $match: {
        'items.seller': sellerId,
        status: { $in: ['delivered', 'processing', 'shipped'] },
        createdAt: { $gte: sixMonthsAgo },
      },
    },
    { $unwind: '$items' },
    { $match: { 'items.seller': sellerId } },
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
        orders: { $addToSet: '$_id' },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  res.json({
    success: true,
    data: {
      overview: {
        totalEarnings: seller?.totalEarnings || 0,
        pendingEarnings: seller?.pendingEarnings || 0,
        totalOrders: seller?.totalOrders || 0,
        totalSales: seller?.totalSales || 0,
        totalProducts,
        isVerified: seller?.isVerified || false,
      },
      monthlyRevenue,
      recentOrders,
    },
  });
});

// @desc    Get public store info
// @route   GET /api/seller/store/:slug
// @access  Public
const getStoreInfo = asyncHandler(async (req, res) => {
  const seller = await Seller.findOne({ storeSlug: req.params.slug, isActive: true })
    .populate('user', 'name avatar');

  if (!seller) {
    res.status(404);
    throw new Error('Store not found');
  }

  const products = await Product.find({ seller: seller.user._id, isActive: true })
    .sort('-sold')
    .limit(20);

  res.json({ success: true, data: { seller, products } });
});

module.exports = {
  registerSeller,
  getSellerProfile,
  updateSellerProfile,
  getSellerProducts,
  getSellerOrders,
  updateOrderStatus,
  getSellerAnalytics,
  getStoreInfo,
};
