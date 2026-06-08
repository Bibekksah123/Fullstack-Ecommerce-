const asyncHandler = require('express-async-handler');
const Review = require('../models/Review');
const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Get reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
const getProductReviews = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, sort = '-createdAt', rating } = req.query;

  const filter = { product: req.params.productId, isVisible: true };
  if (rating) filter.rating = Number(rating);

  const skip = (Number(page) - 1) * Number(limit);

  const [reviews, total] = await Promise.all([
    Review.find(filter)
      .populate('user', 'name avatar')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit)),
    Review.countDocuments(filter),
  ]);

  // Rating breakdown
  const breakdown = await Review.aggregate([
    { $match: { product: require('mongoose').Types.ObjectId.createFromHexString(req.params.productId), isVisible: true } },
    { $group: { _id: '$rating', count: { $sum: 1 } } },
    { $sort: { _id: -1 } },
  ]);

  res.json({
    success: true,
    data: reviews,
    breakdown,
    pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
  });
});

// @desc    Create review
// @route   POST /api/reviews/:productId
// @access  Private
const createReview = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { rating, title, comment } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Check if already reviewed
  const existing = await Review.findOne({ product: productId, user: req.user._id });
  if (existing) {
    res.status(400);
    throw new Error('You have already reviewed this product');
  }

  // Check if verified buyer
  const verifiedOrder = await Order.findOne({
    user: req.user._id,
    'items.product': productId,
    status: 'delivered',
  });

  const images = req.files ? req.files.map((f) => `/uploads/products/${f.filename}`) : [];

  const review = await Review.create({
    product: productId,
    user: req.user._id,
    rating: Number(rating),
    title,
    comment,
    images,
    isVerifiedPurchase: !!verifiedOrder,
    order: verifiedOrder?._id,
  });

  await review.populate('user', 'name avatar');

  res.status(201).json({ success: true, data: review, message: 'Review submitted successfully' });
});

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
const updateReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  if (review.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to edit this review');
  }

  const { rating, title, comment } = req.body;
  if (rating) review.rating = Number(rating);
  if (title) review.title = title;
  if (comment) review.comment = comment;

  await review.save();
  await Review.calcAverageRating(review.product);

  res.json({ success: true, data: review, message: 'Review updated' });
});

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized');
  }

  const productId = review.product;
  await review.deleteOne();
  await Review.calcAverageRating(productId);

  res.json({ success: true, message: 'Review deleted' });
});

// @desc    Mark review as helpful
// @route   POST /api/reviews/:id/helpful
// @access  Private
const markHelpful = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  const alreadyMarked = review.helpful.includes(req.user._id);

  if (alreadyMarked) {
    review.helpful = review.helpful.filter((id) => id.toString() !== req.user._id.toString());
    review.helpfulCount = Math.max(0, review.helpfulCount - 1);
  } else {
    review.helpful.push(req.user._id);
    review.helpfulCount += 1;
  }

  await review.save();
  res.json({ success: true, helpful: !alreadyMarked, helpfulCount: review.helpfulCount });
});

// @desc    Seller reply to review
// @route   PUT /api/reviews/:id/reply
// @access  Private (seller)
const replyToReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id).populate('product', 'seller');

  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  if (review.product.seller.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Only the seller can reply to this review');
  }

  review.reply = { text: req.body.text, repliedAt: new Date() };
  await review.save();

  res.json({ success: true, data: review, message: 'Reply posted' });
});

module.exports = { getProductReviews, createReview, updateReview, deleteReview, markHelpful, replyToReview };
