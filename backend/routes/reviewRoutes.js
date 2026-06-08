const express = require('express');
const router = express.Router();
const { getProductReviews, createReview, updateReview, deleteReview, markHelpful, replyToReview } = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { upload, setUploadFolder } = require('../middleware/uploadMiddleware');

router.get('/product/:productId', getProductReviews);

router.use(protect);
router.post('/:productId', setUploadFolder('products'), upload.array('images', 3), createReview);
router.put('/:id', updateReview);
router.delete('/:id', deleteReview);
router.post('/:id/helpful', markHelpful);
router.put('/:id/reply', authorize('seller'), replyToReview);

module.exports = router;
