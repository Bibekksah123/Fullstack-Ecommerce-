const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  variant: {
    size: String,
    color: String,
    storage: String,
  },
});

const timelineSchema = new mongoose.Schema({
  status: { type: String, required: true },
  message: { type: String, default: '' },
  timestamp: { type: Date, default: Date.now },
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],

    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      addressLine1: { type: String, required: true },
      addressLine2: String,
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, default: 'Pakistan' },
    },

    // Pricing
    itemsPrice: { type: Number, required: true, default: 0 },
    shippingPrice: { type: Number, required: true, default: 0 },
    taxPrice: { type: Number, required: true, default: 0 },
    discountAmount: { type: Number, default: 0 },
    totalPrice: { type: Number, required: true, default: 0 },

    // Payment
    paymentMethod: { type: String, enum: ['stripe', 'cod'], required: true },
    paymentResult: {
      id: String,
      status: String,
      update_time: String,
      email_address: String,
    },
    isPaid: { type: Boolean, default: false },
    paidAt: Date,

    // Coupon
    coupon: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon', default: null },

    // Status
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'return_requested', 'returned'],
      default: 'pending',
    },
    timeline: [timelineSchema],

    // Delivery
    isDelivered: { type: Boolean, default: false },
    deliveredAt: Date,
    estimatedDelivery: Date,

    // Return
    returnReason: String,
    returnRequestedAt: Date,

    // Notes
    sellerNote: String,
    customerNote: String,
  },
  { timestamps: true }
);

// Auto-generate order number
orderSchema.pre('save', function (next) {
  if (!this.orderNumber) {
    this.orderNumber = 'SN' + Date.now() + Math.floor(Math.random() * 1000);
  }
  // Add initial timeline entry
  if (this.isNew) {
    this.timeline.push({ status: 'pending', message: 'Order placed successfully' });
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
