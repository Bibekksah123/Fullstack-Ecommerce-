const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g. "Color", "Size", "Storage"
  options: [
    {
      value: { type: String, required: true }, // e.g. "Red", "XL", "128GB"
      stock: { type: Number, default: 0 },
      priceModifier: { type: Number, default: 0 }, // additional price
      sku: String,
    },
  ],
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Product name is required'], trim: true, maxlength: 200 },
    slug: { type: String, unique: true, lowercase: true },
    description: { type: String, required: [true, 'Description is required'] },
    shortDescription: { type: String, maxlength: 300 },
    brand: { type: String, default: '' },

    // Pricing
    price: { type: Number, required: [true, 'Price is required'], min: 0 },
    discountPrice: { type: Number, default: 0 },
    discountPercent: { type: Number, default: 0 },

    // Images (local multer paths or fake URLs)
    images: [{ type: String }],
    thumbnail: { type: String, default: '' },

    // Relations
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    // Variants & Stock
    variants: [variantSchema],
    stock: { type: Number, default: 0, min: 0 },
    hasVariants: { type: Boolean, default: false },

    // Ratings
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },

    // Stats
    sold: { type: Number, default: 0 },
    views: { type: Number, default: 0 },

    // Metadata
    tags: [String],
    specifications: [{ key: String, value: String }],

    // Flash sale
    isFlashSale: { type: Boolean, default: false },
    flashSalePrice: { type: Number, default: 0 },
    flashSaleEnd: Date,

    // Status
    isActive: { type: Boolean, default: true },
    isApproved: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Indexes for search and filtering
productSchema.index({ name: 'text', description: 'text', brand: 'text', tags: 'text' });
productSchema.index({ category: 1, price: 1, rating: -1 });
productSchema.index({ seller: 1 });
productSchema.index({ slug: 1 });
productSchema.index({ isFlashSale: 1, flashSaleEnd: 1 });

// Auto-generate slug from name
productSchema.pre('save', function (next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + Date.now();
  }
  // Calculate discount percent
  if (this.discountPrice && this.price) {
    this.discountPercent = Math.round(((this.price - this.discountPrice) / this.price) * 100);
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
