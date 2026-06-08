const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Product = require('../models/Product');

// @desc    Get wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate(
    'wishlist',
    'name thumbnail price discountPrice rating numReviews stock isActive'
  );

  const activeWishlist = user.wishlist.filter((p) => p.isActive);

  res.json({ success: true, data: activeWishlist, count: activeWishlist.length });
});

// @desc    Toggle wishlist (add/remove)
// @route   POST /api/wishlist/:productId
// @access  Private
const toggleWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const user = await User.findById(req.user._id);
  const isInWishlist = user.wishlist.includes(productId);

  if (isInWishlist) {
    user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
    await user.save({ validateBeforeSave: false });
    res.json({ success: true, inWishlist: false, message: 'Removed from wishlist' });
  } else {
    user.wishlist.push(productId);
    await user.save({ validateBeforeSave: false });
    res.json({ success: true, inWishlist: true, message: 'Added to wishlist' });
  }
});

// @desc    Move wishlist item to cart
// @route   POST /api/wishlist/:productId/move-to-cart
// @access  Private
const moveToCart = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const product = await Product.findById(productId);
  if (!product || !product.isActive) {
    res.status(404);
    throw new Error('Product not found');
  }

  const user = await User.findById(req.user._id);

  // Add to cart
  const existingCartItem = user.cart.find((item) => item.product.toString() === productId);
  if (!existingCartItem) {
    const price = product.discountPrice > 0 ? product.discountPrice : product.price;
    user.cart.push({ product: productId, quantity: 1, price });
  }

  // Remove from wishlist
  user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);

  await user.save({ validateBeforeSave: false });

  res.json({ success: true, message: 'Moved to cart', cartCount: user.cart.length });
});

module.exports = { getWishlist, toggleWishlist, moveToCart };
