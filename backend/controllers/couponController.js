const asyncHandler = require('express-async-handler');
const Coupon = require('../models/Coupon');

// @desc    Validate coupon
// @route   POST /api/coupons/validate
// @access  Private
const validateCoupon = asyncHandler(async (req, res) => {
  const { code, orderTotal } = req.body;

  const coupon = await Coupon.findOne({ code: code.toUpperCase() });

  if (!coupon) {
    res.status(404);
    throw new Error('Coupon not found');
  }

  const validation = coupon.isValid(req.user._id, orderTotal || 0);
  if (!validation.valid) {
    res.status(400);
    throw new Error(validation.message);
  }

  const discount = coupon.calcDiscount(orderTotal || 0);

  res.json({
    success: true,
    data: {
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      discount,
      description: coupon.description,
    },
    message: `Coupon applied! You save Rs.${discount}`,
  });
});

// @desc    Get all active coupons (for display)
// @route   GET /api/coupons
// @access  Private
const getCoupons = asyncHandler(async (req, res) => {
  const now = new Date();
  const coupons = await Coupon.find({
    isActive: true,
    expiryDate: { $gt: now },
    startDate: { $lte: now },
  }).select('-usedBy -__v');

  res.json({ success: true, data: coupons });
});

// @desc    Create coupon (admin)
// @route   POST /api/coupons
// @access  Private (admin)
const createCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.create(req.body);
  res.status(201).json({ success: true, data: coupon, message: 'Coupon created' });
});

// @desc    Update coupon (admin)
// @route   PUT /api/coupons/:id
// @access  Private (admin)
const updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!coupon) {
    res.status(404);
    throw new Error('Coupon not found');
  }
  res.json({ success: true, data: coupon });
});

// @desc    Delete coupon (admin)
// @route   DELETE /api/coupons/:id
// @access  Private (admin)
const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);
  if (!coupon) {
    res.status(404);
    throw new Error('Coupon not found');
  }
  res.json({ success: true, message: 'Coupon deleted' });
});

module.exports = { validateCoupon, getCoupons, createCoupon, updateCoupon, deleteCoupon };
