const asyncHandler = require('express-async-handler');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');

// @desc    Create Stripe payment intent
// @route   POST /api/payments/stripe/intent
// @access  Private
const createPaymentIntent = asyncHandler(async (req, res) => {
  const { amount, orderId } = req.body;

  if (!amount || amount <= 0) {
    res.status(400);
    throw new Error('Invalid payment amount');
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to paisa/cents
    currency: 'pkr',
    metadata: { orderId: orderId || '', userId: req.user._id.toString() },
  });

  res.json({
    success: true,
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
  });
});

// @desc    Confirm payment and update order
// @route   POST /api/payments/stripe/confirm
// @access  Private
const confirmPayment = asyncHandler(async (req, res) => {
  const { orderId, paymentIntentId } = req.body;

  const order = await Order.findById(orderId);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (order.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  // Verify with Stripe
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  if (paymentIntent.status === 'succeeded') {
    order.isPaid = true;
    order.paidAt = new Date();
    order.status = 'confirmed';
    order.paymentResult = {
      id: paymentIntent.id,
      status: paymentIntent.status,
      update_time: new Date().toISOString(),
    };
    order.timeline.push({ status: 'confirmed', message: 'Payment confirmed via Stripe' });
    await order.save();

    res.json({ success: true, message: 'Payment confirmed', data: order });
  } else {
    res.status(400);
    throw new Error('Payment not successful');
  }
});

// @desc    Stripe webhook
// @route   POST /api/payments/webhook
// @access  Public (Stripe)
const stripeWebhook = asyncHandler(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    res.status(400);
    throw new Error(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const orderId = paymentIntent.metadata.orderId;

    if (orderId) {
      await Order.findByIdAndUpdate(orderId, {
        isPaid: true,
        paidAt: new Date(),
        status: 'confirmed',
        paymentResult: {
          id: paymentIntent.id,
          status: 'succeeded',
          update_time: new Date().toISOString(),
        },
        $push: { timeline: { status: 'confirmed', message: 'Payment confirmed via Stripe webhook' } },
      });
    }
  }

  res.json({ received: true });
});

module.exports = { createPaymentIntent, confirmPayment, stripeWebhook };
