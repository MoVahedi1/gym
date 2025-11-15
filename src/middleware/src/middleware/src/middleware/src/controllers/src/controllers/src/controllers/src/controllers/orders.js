const asyncHandler = require('../middleware/asyncHandler');
const { ErrorResponse } = require('../middleware/error');
const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = asyncHandler(async (req, res, next) => {
  const {
    items,
    shippingAddress,
    paymentMethod,
    shippingMethod,
    discountCode,
    notes
  } = req.body;

  // Validate items
  if (!items || items.length === 0) {
    return next(new ErrorResponse('No order items', 400));
  }

  // Calculate items total and validate products
  let itemsTotal = 0;
  const orderItems = [];

  for (const item of items) {
    const product = await Product.findById(item.product);
    
    if (!product) {
      return next(new ErrorResponse(`Product not found: ${item.product}`, 404));
    }

    if (product.inventory.quantity < item.quantity) {
      return next(new ErrorResponse(`Not enough stock for ${product.name}`, 400));
    }

    if (product.status !== 'active') {
      return next(new ErrorResponse(`Product ${product.name} is not available`, 400));
    }

    const itemTotal = product.price * item.quantity;
    itemsTotal += itemTotal;

    orderItems.push({
      product: product._id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
      image: product.images[0]?.url || null
    });
  }

  // Calculate shipping cost
  let shippingCost = 0;
  switch (shippingMethod) {
    case 'express':
      shippingCost = 30000;
      break;
    case 'standard':
      shippingCost = 20000;
      break;
    case 'free':
      shippingCost = 0;
      break;
    default:
      shippingCost = 0;
  }

  // Free shipping for orders over 500,000
  if (itemsTotal >= 500000) {
    shippingCost = 0;
  }

  // Calculate discount (simplified)
  let discount = 0;
  if (discountCode) {
    // In real app, validate discount code from database
    discount = itemsTotal * 0.1; // 10% discount for demo
  }

  const total = itemsTotal + shippingCost - discount;

  // Create order
  const order = await Order.create({
    user: req.user.id,
    items: orderItems,
    shippingAddress,
    payment: {
      method: paymentMethod,
      amount: total
    },
    shipping: {
      method: shippingMethod,
      cost: shippingCost
    },
    totals: {
      items: itemsTotal,
      discount,
      shipping: shippingCost,
      total
    },
    discountCode,
    notes
  });

  res.status(201).json({
    success: true,
    message: 'Order created successfully',
    data: order
  });
});

// @desc    Get user orders
// @route   GET /api/orders/my-orders
// @access  Private
exports.getMyOrders = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const orders = await Order.find({ user: req.user.id })
    .populate('items.product', 'name images')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Order.countDocuments({ user: req.user.id });

  res.status(200).json({
    success: true,
    count: orders.length,
    total,
    pagination: {
      page,
      pages: Math.ceil(total / limit)
    },
    data: orders
  });
});

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'firstName lastName email phone')
    .populate('items.product', 'name images category');

  if (!order) {
    return next(new ErrorResponse('Order not found', 404));
  }

  // Make sure user owns order or is admin
  if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to access this order', 401));
  }

  res.status(200).json({
    success: true,
    data: order
  });
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorResponse('Order not found', 404));
  }

  order.status = status;

  // Update timestamps based on status
  const now = new Date();
  if (status === 'shipped' && !order.shipping.shippedAt) {
    order.shipping.shippedAt = now;
  } else if (status === 'delivered' && !order.shipping.deliveredAt) {
    order.shipping.deliveredAt = now;
  } else if (status === 'paid' && !order.payment.paidAt) {
    order.payment.paidAt = now;
  }

  await order.save();

  res.status(200).json({
    success: true,
    message: 'Order status updated successfully',
    data: order
  });
});

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
exports.getOrders = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const orders = await Order.find()
    .populate('user', 'firstName lastName email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Order.countDocuments();

  res.status(200).json({
    success: true,
    count: orders.length,
    total,
    pagination: {
      page,
      pages: Math.ceil(total / limit)
    },
    data: orders
  });
});

// @desc    Process payment
// @route   POST /api/orders/:id/payment
// @access  Private
exports.processPayment = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorResponse('Order not found', 404));
  }

  // Make sure user owns order
  if (order.user.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to access this order', 401));
  }

  // Check if order is already paid
  if (order.payment.status === 'paid') {
    return next(new ErrorResponse('Order is already paid', 400));
  }

  // Simulate payment processing
  // In real app, integrate with Stripe or other payment gateway
  const paymentSuccess = Math.random() > 0.1; // 90% success rate for demo

  if (paymentSuccess) {
    order.payment.status = 'paid';
    order.payment.paidAt = new Date();
    order.status = 'confirmed';
    order.payment.transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Payment processed successfully',
      data: {
        order,
        transactionId: order.payment.transactionId
      }
    });
  } else {
    order.payment.status = 'failed';
    await order.save();

    return next(new ErrorResponse('Payment failed. Please try again.', 400));
  }
});