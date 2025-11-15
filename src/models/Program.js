const mongoose = require('mongoose');

const programSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide program name'],
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: [true, 'Please provide program description']
  },
  type: {
    type: String,
    required: true,
    enum: ['fat-loss', 'muscle-gain', 'strength', 'fitness', 'rehabilitation']
  },
  level: {
    type: String,
    required: true,
    enum: ['beginner', 'intermediate', 'advanced']
  },
  duration: {
    value: Number,
    unit: {
      type: String,
      enum: ['days', 'weeks', 'months'],
      default: 'weeks'
    }
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,
    required: true
  },
  features: [String],
  workouts: [{
    day: {
      type: String,
      enum: ['saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday']
    },
    type: {
      type: String,
      enum: ['cardio', 'strength', 'flexibility', 'hiit', 'recovery']
    },
    duration: String,
    exercises: [{
      name: String,
      sets: Number,
      reps: String,
      rest: String,
      notes: String
    }]
  }],
  nutrition: {
    plan: String,
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    meals: [{
      time: String,
      description: String,
      calories: Number
    }]
  },
  requirements: [String],
  goals: [String],
  status: {
    type: String,
    enum: ['active', 'inactive', 'draft'],
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
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Program', programSchema);