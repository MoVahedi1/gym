const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: true
    },
    name: String,
    price: Number,
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    image: String
  }],
  shippingAddress: {
    firstName: String,
    lastName: String,
    phone: String,
    email: String,
    province: String,
    city: String,
    address: String,
    postalCode: String
  },
  payment: {
    method: {
      type: String,
      enum: ['online', 'cash', 'wallet'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    amount: Number,
    paidAt: Date
  },
  shipping: {
    method: {
      type: String,
      enum: ['express', 'standard', 'free'],
      required: true
    },
    cost: {
      type: Number,
      default: 0
    },
    trackingNumber: String,
    status: {
      type: String,
      enum: ['pending', 'shipped', 'delivered', 'cancelled'],
      default: 'pending'
    },
    estimatedDelivery: Date,
    shippedAt: Date,
    deliveredAt: Date
  },
  totals: {
    items: Number,
    discount: {
      type: Number,
      default: 0
    },
    shipping: Number,
    tax: {
      type: Number,
      default: 0
    },
    total: Number
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  notes: String,
  discountCode: String
}, {
  timestamps: true
});

// Generate order number before saving
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const date = new Date();
    const timestamp = date.getTime();
    const random = Math.floor(Math.random() * 1000);
    this.orderNumber = `ORD-${timestamp}-${random}`;
    
    // Calculate totals
    this.totals.items = this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    this.totals.total = this.totals.items + this.totals.shipping - this.totals.discount + this.totals.tax;
  }
  next();
});

// Update product inventory when order is confirmed
orderSchema.post('save', async function(doc) {
  if (doc.status === 'confirmed') {
    for (const item of doc.items) {
      await mongoose.model('Product').findByIdAndUpdate(
        item.product,
        { $inc: { 'inventory.quantity': -item.quantity } }
      );
    }
  }
});

// Static method to get sales statistics
orderSchema.statics.getSalesStats = async function(startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate },
        status: { $in: ['delivered', 'shipped'] }
      }
    },
    {
      $group: {
        _id: null,
        totalSales: { $sum: '$totals.total' },
        totalOrders: { $sum: 1 },
        averageOrderValue: { $avg: '$totals.total' }
      }
    }
  ]);
};

module.exports = mongoose.model('Order', orderSchema);