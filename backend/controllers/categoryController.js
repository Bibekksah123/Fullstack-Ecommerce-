const asyncHandler = require('express-async-handler');
const Category = require('../models/Category');
const slugify = require('slugify');

// @desc    Get all categories (tree structure)
// @route   GET /api/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const { flat, level } = req.query;

  let filter = { isActive: true };
  if (level) filter.level = Number(level);

  if (flat === 'true') {
    const categories = await Category.find(filter).sort('order name');
    return res.json({ success: true, data: categories });
  }

  // Get tree structure (root categories with children)
  const rootCategories = await Category.find({ ...filter, parent: null })
    .populate({
      path: 'children',
      match: { isActive: true },
      populate: { path: 'children', match: { isActive: true } },
    })
    .sort('order name');

  res.json({ success: true, data: rootCategories });
});

// @desc    Get category by slug
// @route   GET /api/categories/:slug
// @access  Public
const getCategoryBySlug = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug, isActive: true })
    .populate('parent', 'name slug')
    .populate({
      path: 'children',
      match: { isActive: true },
      populate: { path: 'children', match: { isActive: true } },
    });

  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  res.json({ success: true, data: category });
});

// @desc    Create category
// @route   POST /api/categories
// @access  Private (admin)
const createCategory = asyncHandler(async (req, res) => {
  const { name, parent, description, order, isFeatured } = req.body;

  const slug = slugify(name, { lower: true, strict: true }) + '-' + Date.now();

  let level = 1;
  if (parent) {
    const parentCategory = await Category.findById(parent);
    if (!parentCategory) {
      res.status(404);
      throw new Error('Parent category not found');
    }
    level = parentCategory.level + 1;
  }

  const imageUrl = req.file ? `/uploads/products/${req.file.filename}` : req.body.image || '';

  const category = await Category.create({
    name,
    slug,
    description,
    image: imageUrl,
    parent: parent || null,
    level,
    order: order || 0,
    isFeatured: isFeatured || false,
  });

  res.status(201).json({ success: true, data: category, message: 'Category created' });
});

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private (admin)
const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  const updateData = { ...req.body };
  if (req.file) updateData.image = `/uploads/products/${req.file.filename}`;

  const updated = await Category.findByIdAndUpdate(req.params.id, updateData, { new: true });
  res.json({ success: true, data: updated, message: 'Category updated' });
});

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private (admin)
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  // Check for children
  const childCount = await Category.countDocuments({ parent: req.params.id });
  if (childCount > 0) {
    res.status(400);
    throw new Error('Cannot delete category with sub-categories');
  }

  await category.deleteOne();
  res.json({ success: true, message: 'Category deleted' });
});

module.exports = { getCategories, getCategoryBySlug, createCategory, updateCategory, deleteCategory };
