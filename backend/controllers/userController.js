const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate('wishlist', 'name thumbnail price discountPrice rating')
    .select('-password -refreshToken -emailVerifyToken -resetPasswordToken');

  res.json({ success: true, data: user });
});

// @desc    Update profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone } = req.body;

  const updateData = { name, phone };

  if (req.file) {
    updateData.avatar = `/uploads/avatars/${req.file.filename}`;
  }

  const user = await User.findByIdAndUpdate(req.user._id, updateData, { new: true, runValidators: true })
    .select('-password -refreshToken');

  res.json({ success: true, data: user, message: 'Profile updated successfully' });
});

// @desc    Change password
// @route   PUT /api/users/change-password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');
  if (!(await user.comparePassword(currentPassword))) {
    res.status(400);
    throw new Error('Current password is incorrect');
  }

  user.password = newPassword;
  await user.save();

  res.json({ success: true, message: 'Password changed successfully' });
});

// @desc    Get addresses
// @route   GET /api/users/addresses
// @access  Private
const getAddresses = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('addresses');
  res.json({ success: true, data: user.addresses });
});

// @desc    Add address
// @route   POST /api/users/addresses
// @access  Private
const addAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (req.body.isDefault) {
    user.addresses.forEach((addr) => (addr.isDefault = false));
  }

  if (user.addresses.length === 0) req.body.isDefault = true;
  user.addresses.push(req.body);
  await user.save();

  res.status(201).json({ success: true, data: user.addresses, message: 'Address added' });
});

// @desc    Update address
// @route   PUT /api/users/addresses/:id
// @access  Private
const updateAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const address = user.addresses.id(req.params.id);

  if (!address) {
    res.status(404);
    throw new Error('Address not found');
  }

  if (req.body.isDefault) {
    user.addresses.forEach((addr) => (addr.isDefault = false));
  }

  Object.assign(address, req.body);
  await user.save();

  res.json({ success: true, data: user.addresses, message: 'Address updated' });
});

// @desc    Delete address
// @route   DELETE /api/users/addresses/:id
// @access  Private
const deleteAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const address = user.addresses.id(req.params.id);

  if (!address) {
    res.status(404);
    throw new Error('Address not found');
  }

  address.deleteOne();
  await user.save();

  res.json({ success: true, data: user.addresses, message: 'Address deleted' });
});

// @desc    Get wallet & loyalty points
// @route   GET /api/users/wallet
// @access  Private
const getWallet = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('walletBalance loyaltyPoints');
  res.json({ success: true, data: { walletBalance: user.walletBalance, loyaltyPoints: user.loyaltyPoints } });
});

module.exports = { getProfile, updateProfile, changePassword, getAddresses, addAddress, updateAddress, deleteAddress, getWallet };
