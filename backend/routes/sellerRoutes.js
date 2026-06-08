const express = require('express');
const router = express.Router();
const {
  registerSeller, getSellerProfile, updateSellerProfile,
  getSellerProducts, getSellerOrders, updateOrderStatus,
  getSellerAnalytics, getStoreInfo
} = require('../controllers/sellerController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { upload, setUploadFolder } = require('../middleware/uploadMiddleware');

// Public
router.get('/store/:slug', getStoreInfo);

// Private — authenticated user can register as seller
router.post('/register', protect, registerSeller);

// Private — seller only
router.use(protect, authorize('seller', 'admin'));

router.get('/profile', getSellerProfile);
router.put('/profile', setUploadFolder('products'), upload.single('logo'), updateSellerProfile);
router.get('/products', getSellerProducts);
router.get('/orders', getSellerOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.get('/analytics', getSellerAnalytics);

module.exports = router;
