const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    type: { type: String, enum: ['percent', 'fixed'], required: true },
    value: { type: Number, required: true, min: 0 },
    minOrderValue: { type: Number, default: 0 },
    maxDiscount: { type: Number, default: null }, // For percent type cap

    // Validity
    startDate: { type: Date, default: Date.now },
    expiryDate: { type: Date, required: true },

    // Usage
    usageLimit: { type: Number, default: null }, // null = unlimited
    usedCount: { type: Number, default: 0 },
    usedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    // Restrictions
    applicableCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    applicableProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],

    isActive: { type: Boolean, default: true },
    description: String,
  },
  { timestamps: true }
);

couponSchema.methods.isValid = function (userId, orderTotal) {
  const now = new Date();
  if (!this.isActive) return { valid: false, message: 'Coupon is inactive' };
  if (now < this.startDate) return { valid: false, message: 'Coupon not yet active' };
  if (now > this.expiryDate) return { valid: false, message: 'Coupon has expired' };
  if (this.usageLimit && this.usedCount >= this.usageLimit) return { valid: false, message: 'Coupon usage limit reached' };
  if (this.usedBy.includes(userId)) return { valid: false, message: 'You have already used this coupon' };
  if (orderTotal < this.minOrderValue) return { valid: false, message: `Minimum order value is Rs.${this.minOrderValue}` };
  return { valid: true };
};

couponSchema.methods.calcDiscount = function (orderTotal) {
  let discount = 0;
  if (this.type === 'percent') {
    discount = (orderTotal * this.value) / 100;
    if (this.maxDiscount) discount = Math.min(discount, this.maxDiscount);
  } else {
    discount = this.value;
  }
  return Math.min(discount, orderTotal);
};

module.exports = mongoose.model('Coupon', couponSchema);
