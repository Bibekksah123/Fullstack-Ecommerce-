const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getOrder, cancelOrder, requestReturn } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/').get(getMyOrders).post(createOrder);
router.get('/:id', getOrder);
router.put('/:id/cancel', cancelOrder);
router.put('/:id/return', requestReturn);

module.exports = router;
