const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Product = require('../models/Product');

// @desc    Get cart
// @route   GET /api/cart
// @access  Private
const getCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: 'cart.product',
    select: 'name thumbnail price discountPrice stock isActive images',
  });

  // Filter out invalid/deleted products
  const validCart = user.cart.filter((item) => item.product && item.product.isActive);

  if (validCart.length !== user.cart.length) {
    user.cart = validCart;
    await user.save({ validateBeforeSave: false });
  }

  const subtotal = validCart.reduce((acc, item) => {
    const price = item.product.discountPrice > 0 ? item.product.discountPrice : item.product.price;
    return acc + price * item.quantity;
  }, 0);

  res.json({ success: true, data: validCart, subtotal });
});

// @desc    Add to cart
// @route   POST /api/cart
// @access  Private
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1, variant } = req.body;

  const product = await Product.findById(productId);
  if (!product || !product.isActive) {
    res.status(404);
    throw new Error('Product not found');
  }

  if (product.stock < quantity) {
    res.status(400);
    throw new Error('Not enough stock available');
  }

  const user = await User.findById(req.user._id);

  // Check if product (+ variant) already in cart
  const existingIndex = user.cart.findIndex(
    (item) =>
      item.product.toString() === productId &&
      JSON.stringify(item.variant) === JSON.stringify(variant || {})
  );

  if (existingIndex > -1) {
    user.cart[existingIndex].quantity += quantity;
  } else {
    const price = product.discountPrice > 0 ? product.discountPrice : product.price;
    user.cart.push({ product: productId, quantity, variant: variant || {}, price });
  }

  await user.save({ validateBeforeSave: false });

  res.json({ success: true, message: 'Added to cart', cartCount: user.cart.length });
});

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
// @access  Private
const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const user = await User.findById(req.user._id);
  const item = user.cart.id(req.params.itemId);

  if (!item) {
    res.status(404);
    throw new Error('Cart item not found');
  }

  if (quantity <= 0) {
    item.deleteOne();
  } else {
    item.quantity = quantity;
  }

  await user.save({ validateBeforeSave: false });
  res.json({ success: true, message: 'Cart updated', cartCount: user.cart.length });
});

// @desc    Remove from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
const removeFromCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const item = user.cart.id(req.params.itemId);

  if (!item) {
    res.status(404);
    throw new Error('Cart item not found');
  }

  item.deleteOne();
  await user.save({ validateBeforeSave: false });
  res.json({ success: true, message: 'Removed from cart', cartCount: user.cart.length });
});

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { cart: [] });
  res.json({ success: true, message: 'Cart cleared' });
});

// @desc    Sync guest cart after login
// @route   POST /api/cart/sync
// @access  Private
const syncGuestCart = asyncHandler(async (req, res) => {
  const { guestCart } = req.body; // Array of { productId, quantity, variant }
  const user = await User.findById(req.user._id);

  for (const guestItem of guestCart) {
    const product = await Product.findById(guestItem.productId);
    if (!product || !product.isActive) continue;

    const existingIndex = user.cart.findIndex(
      (item) => item.product.toString() === guestItem.productId
    );

    if (existingIndex > -1) {
      user.cart[existingIndex].quantity = Math.max(
        user.cart[existingIndex].quantity,
        guestItem.quantity
      );
    } else {
      const price = product.discountPrice > 0 ? product.discountPrice : product.price;
      user.cart.push({ product: guestItem.productId, quantity: guestItem.quantity, variant: guestItem.variant || {}, price });
    }
  }

  await user.save({ validateBeforeSave: false });
  res.json({ success: true, message: 'Cart synced', cartCount: user.cart.length });
});

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart, syncGuestCart };
