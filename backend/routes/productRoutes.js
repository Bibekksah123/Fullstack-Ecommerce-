const express = require('express');
const router = express.Router();
const {
  getProducts, searchProducts, getFeaturedProducts, getFlashSaleProducts,
  getProduct, createProduct, updateProduct, deleteProduct
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { upload, setUploadFolder } = require('../middleware/uploadMiddleware');

// Public routes
router.get('/', getProducts);
router.get('/search', searchProducts);
router.get('/featured', getFeaturedProducts);
router.get('/flash-sale', getFlashSaleProducts);
router.get('/:id', getProduct);

// Private routes
router.post('/',
  protect,
  authorize('seller', 'admin'),
  setUploadFolder('products'),
  upload.array('images', 8),
  createProduct
);

router.put('/:id',
  protect,
  authorize('seller', 'admin'),
  setUploadFolder('products'),
  upload.array('images', 8),
  updateProduct
);

router.delete('/:id', protect, authorize('seller', 'admin'), deleteProduct);

module.exports = router;
