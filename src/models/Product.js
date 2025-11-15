const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide product name'],
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: [true, 'Please provide product description'],
    maxlength: 1000
  },
  category: {
    type: String,
    required: [true, 'Please provide product category'],
    enum: ['پروتئین', 'کراتین', 'آمینو اسید', 'انرژی زا', 'ویتامین', 'اسید چرب']
  },
  brand: {
    type: String,
    required: [true, 'Please provide product brand']
  },
  price: {
    type: Number,
    required: [true, 'Please provide product price'],
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  images: [{
    url: String,
    alt: String
  }],
  features: [String],
  specifications: {
    weight: String,
    servings: Number,
    flavor: String,
    ingredients: [String],
    usage: String
  },
  inventory: {
    quantity: {
      type: Number,
      required: true,
      min: 0
    },
    lowStockThreshold: {
      type: Number,
      default: 10
    }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'out_of_stock'],
    default: 'active'
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  seo: {
    metaTitle: String,
    metaDescription: String,
    slug: {
      type: String,
      unique: true,
      lowercase: true
    }
  },
  tags: [String],
  isFeatured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Calculate discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (!this.originalPrice || this.originalPrice <= this.price) return 0;
  return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
});

// Check if product is in stock
productSchema.virtual('inStock').get(function() {
  return this.inventory.quantity > 0 && this.status === 'active';
});

// Update average rating
productSchema.methods.updateRating = async function(newRating) {
  const totalRating = this.rating.average * this.rating.count + newRating;
  this.rating.count += 1;
  this.rating.average = totalRating / this.rating.count;
  await this.save();
};

// Generate slug before saving
productSchema.pre('save', function(next) {
  if (this.isModified('name') && !this.seo.slug) {
    this.seo.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);