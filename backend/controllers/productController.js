const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const APIFeatures = require('../utils/apiFeatures');

// @desc    Get all products with filter/sort/paginate
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const { category, minPrice, maxPrice, rating, brand, isFlashSale, isFeatured, seller } = req.query;

  let filter = { isActive: true, isApproved: true };

  if (category) filter.category = category;
  if (brand) filter.brand = new RegExp(brand, 'i');
  if (seller) filter.seller = seller;
  if (isFlashSale === 'true') {
    filter.isFlashSale = true;
    filter.flashSaleEnd = { $gt: new Date() };
  }
  if (isFeatured === 'true') filter.isFeatured = true;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }
  if (rating) filter.rating = { $gte: Number(rating) };

  // Text search
  if (req.query.search) {
    filter.$text = { $search: req.query.search };
  }

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 12;
  const skip = (page - 1) * limit;

  // Sorting
  let sort = '-createdAt';
  switch (req.query.sort) {
    case 'price_asc': sort = 'price'; break;
    case 'price_desc': sort = '-price'; break;
    case 'rating': sort = '-rating'; break;
    case 'popular': sort = '-sold'; break;
    case 'newest': sort = '-createdAt'; break;
  }

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate('category', 'name slug')
      .populate('seller', 'name')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select('-__v'),
    Product.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: products,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

// @desc    Search products
// @route   GET /api/products/search
// @access  Public
const searchProducts = asyncHandler(async (req, res) => {
  const { q, category, minPrice, maxPrice, sort, page = 1, limit = 12 } = req.query;

  if (!q) {
    return res.json({ success: true, data: [], pagination: { total: 0 } });
  }

  let filter = {
    isActive: true,
    isApproved: true,
    $text: { $search: q },
  };

  if (category) filter.category = category;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  let sortObj = { score: { $meta: 'textScore' } };
  if (sort === 'price_asc') sortObj = { price: 1 };
  if (sort === 'price_desc') sortObj = { price: -1 };
  if (sort === 'rating') sortObj = { rating: -1 };

  const skip = (Number(page) - 1) * Number(limit);

  const [products, total] = await Promise.all([
    Product.find(filter, { score: { $meta: 'textScore' } })
      .populate('category', 'name slug')
      .sort(sortObj)
      .skip(skip)
      .limit(Number(limit)),
    Product.countDocuments(filter),
  ]);

  res.json({
    success: true,
    query: q,
    data: products,
    pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
  });
});

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isActive: true, isApproved: true, isFeatured: true })
    .populate('category', 'name slug')
    .sort('-sold')
    .limit(12);

  res.json({ success: true, data: products });
});

// @desc    Get flash sale products
// @route   GET /api/products/flash-sale
// @access  Public
const getFlashSaleProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({
    isActive: true,
    isApproved: true,
    isFlashSale: true,
    flashSaleEnd: { $gt: new Date() },
  })
    .populate('category', 'name slug')
    .sort('-createdAt')
    .limit(20);

  res.json({ success: true, data: products });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate('category', 'name slug parent')
    .populate('seller', 'name avatar');

  if (!product || !product.isActive) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Increment views
  await Product.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

  // Get related products
  const related = await Product.find({
    category: product.category._id,
    _id: { $ne: product._id },
    isActive: true,
  })
    .limit(8)
    .select('name thumbnail price discountPrice rating numReviews');

  res.json({ success: true, data: product, related });
});

// @desc    Create product
// @route   POST /api/products
// @access  Private (seller)
const createProduct = asyncHandler(async (req, res) => {
  const productData = { ...req.body, seller: req.user._id };

  // Handle uploaded images
  if (req.files && req.files.length > 0) {
    productData.images = req.files.map((f) => `/uploads/products/${f.filename}`);
    productData.thumbnail = productData.images[0];
  } else if (req.body.images) {
    // Accept JSON array of fake URLs
    productData.images = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
    productData.thumbnail = productData.images[0];
  }

  // Parse variants if sent as JSON string
  if (typeof productData.variants === 'string') {
    productData.variants = JSON.parse(productData.variants);
  }
  if (typeof productData.specifications === 'string') {
    productData.specifications = JSON.parse(productData.specifications);
  }

  const product = await Product.create(productData);
  await product.populate('category', 'name slug');

  res.status(201).json({ success: true, data: product, message: 'Product created successfully' });
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (seller or admin)
const updateProduct = asyncHandler(async (req, res) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to update this product');
  }

  const updateData = { ...req.body };

  if (req.files && req.files.length > 0) {
    updateData.images = req.files.map((f) => `/uploads/products/${f.filename}`);
    updateData.thumbnail = updateData.images[0];
  }

  if (typeof updateData.variants === 'string') updateData.variants = JSON.parse(updateData.variants);
  if (typeof updateData.specifications === 'string') updateData.specifications = JSON.parse(updateData.specifications);

  product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });

  res.json({ success: true, data: product, message: 'Product updated successfully' });
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (seller or admin)
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to delete this product');
  }

  await product.deleteOne();

  res.json({ success: true, message: 'Product deleted successfully' });
});

module.exports = {
  getProducts,
  searchProducts,
  getFeaturedProducts,
  getFlashSaleProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
