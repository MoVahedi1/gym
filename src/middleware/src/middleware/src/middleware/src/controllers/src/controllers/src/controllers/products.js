const asyncHandler = require('../middleware/asyncHandler');
const { ErrorResponse } = require('../middleware/error');
const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = asyncHandler(async (req, res, next) => {
  const {
    page = 1,
    limit = 12,
    category,
    brand,
    minPrice,
    maxPrice,
    search,
    sort,
    inStock
  } = req.query;

  // Build query
  let query = { status: 'active' };

  // Category filter
  if (category && category !== 'all') {
    query.category = category;
  }

  // Brand filter
  if (brand && brand !== 'all') {
    query.brand = brand;
  }

  // Price range filter
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = parseInt(minPrice);
    if (maxPrice) query.price.$lte = parseInt(maxPrice);
  }

  // Search filter
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { brand: { $regex: search, $options: 'i' } },
      { 'seo.metaDescription': { $regex: search, $options: 'i' } }
    ];
  }

  // Stock filter
  if (inStock === 'true') {
    query['inventory.quantity'] = { $gt: 0 };
  }

  // Sort options
  let sortOption = {};
  switch (sort) {
    case 'price-low':
      sortOption = { price: 1 };
      break;
    case 'price-high':
      sortOption = { price: -1 };
      break;
    case 'name':
      sortOption = { name: 1 };
      break;
    case 'rating':
      sortOption = { 'rating.average': -1 };
      break;
    case 'newest':
      sortOption = { createdAt: -1 };
      break;
    default:
      sortOption = { createdAt: -1 };
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const products = await Product.find(query)
    .sort(sortOption)
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Product.countDocuments(query);

  // Get categories for filters
  const categories = await Product.distinct('category', { status: 'active' });
  const brands = await Product.distinct('brand', { status: 'active' });

  res.status(200).json({
    success: true,
    count: products.length,
    total,
    pagination: {
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      limit: parseInt(limit)
    },
    filters: {
      categories,
      brands,
      priceRange: {
        min: await Product.findOne({ status: 'active' }).sort({ price: 1 }).select('price'),
        max: await Product.findOne({ status: 'active' }).sort({ price: -1 }).select('price')
      }
    },
    data: products
  });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorResponse('Product not found', 404));
  }

  res.status(200).json({
    success: true,
    data: product
  });
});

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: product
  });
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = asyncHandler(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorResponse('Product not found', 404));
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    message: 'Product updated successfully',
    data: product
  });
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorResponse('Product not found', 404));
  }

  // Soft delete by setting status to inactive
  product.status = 'inactive';
  await product.save();

  res.status(200).json({
    success: true,
    message: 'Product deleted successfully'
  });
});

// @desc    Update product inventory
// @route   PUT /api/products/:id/inventory
// @access  Private/Admin
exports.updateInventory = asyncHandler(async (req, res, next) => {
  const { quantity, operation } = req.body;

  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorResponse('Product not found', 404));
  }

  if (operation === 'add') {
    product.inventory.quantity += quantity;
  } else if (operation === 'subtract') {
    product.inventory.quantity = Math.max(0, product.inventory.quantity - quantity);
  } else if (operation === 'set') {
    product.inventory.quantity = quantity;
  }

  // Update status based on inventory
  if (product.inventory.quantity === 0) {
    product.status = 'out_of_stock';
  } else if (product.status === 'out_of_stock') {
    product.status = 'active';
  }

  await product.save();

  res.status(200).json({
    success: true,
    message: 'Inventory updated successfully',
    data: {
      inventory: product.inventory,
      status: product.status
    }
  });
});

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
exports.getFeaturedProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find({
    isFeatured: true,
    status: 'active',
    'inventory.quantity': { $gt: 0 }
  })
    .sort({ 'rating.average': -1 })
    .limit(8);

  res.status(200).json({
    success: true,
    count: products.length,
    data: products
  });
});