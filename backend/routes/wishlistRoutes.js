const express = require('express');
const router = express.Router();
const { getWishlist, toggleWishlist, moveToCart } = require('../controllers/wishlistController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getWishlist);
router.post('/:productId', toggleWishlist);
router.post('/:productId/move-to-cart', moveToCart);

module.exports = router;
