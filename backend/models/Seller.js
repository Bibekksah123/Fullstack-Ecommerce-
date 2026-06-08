const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    storeName: { type: String, required: [true, 'Store name is required'], trim: true, maxlength: 100 },
    storeSlug: { type: String, unique: true, lowercase: true },
    logo: { type: String, default: '' },
    banner: { type: String, default: '' },
    description: { type: String, default: '' },
    phone: { type: String, default: '' },

    // Verification
    isVerified: { type: Boolean, default: false },
    verifiedAt: Date,
    verificationDocuments: [String],

    // Address
    address: {
      city: String,
      state: String,
      country: { type: String, default: 'Pakistan' },
    },

    // Stats
    totalSales: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 },
    totalProducts: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },

    // Earnings
    totalEarnings: { type: Number, default: 0 },
    pendingEarnings: { type: Number, default: 0 },
    withdrawnEarnings: { type: Number, default: 0 },

    // Bank details
    bankDetails: {
      bankName: String,
      accountNumber: String,
      accountTitle: String,
    },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

sellerSchema.pre('save', function (next) {
  if (this.isModified('storeName') && !this.storeSlug) {
    this.storeSlug = this.storeName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + Date.now();
  }
  next();
});

module.exports = mongoose.model('Seller', sellerSchema);
