const express = require('express');
const router = express.Router();
const {
  getProfile, updateProfile, changePassword,
  getAddresses, addAddress, updateAddress, deleteAddress, getWallet
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { upload, setUploadFolder } = require('../middleware/uploadMiddleware');

router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', setUploadFolder('avatars'), upload.single('avatar'), updateProfile);
router.put('/change-password', changePassword);
router.get('/wallet', getWallet);

router.route('/addresses')
  .get(getAddresses)
  .post(addAddress);

router.route('/addresses/:id')
  .put(updateAddress)
  .delete(deleteAddress);

module.exports = router;
