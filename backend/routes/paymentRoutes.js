const express = require('express');
const router = express.Router();
const { createPaymentIntent, confirmPayment, stripeWebhook } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

// Webhook must use raw body — handled in server.js
router.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

router.use(protect);
router.post('/stripe/intent', createPaymentIntent);
router.post('/stripe/confirm', confirmPayment);

module.exports = router;
