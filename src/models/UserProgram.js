const mongoose = require('mongoose');

const userProgramSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  program: {
    type: mongoose.Schema.ObjectId,
    ref: 'Program',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'completed', 'cancelled'],
    default: 'active'
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: Date,
  currentWorkout: {
    day: String,
    completed: {
      type: Boolean,
      default: false
    },
    completedAt: Date
  },
  workouts: [{
    day: String,
    completed: Boolean,
    completedAt: Date,
    notes: String,
    duration: Number,
    rating: Number
  }],
  measurements: {
    weight: Number,
    height: Number,
    bodyFat: Number,
    muscles: Number,
    recordedAt: Date
  },
  goals: {
    targetWeight: Number,
    targetBodyFat: Number,
    deadline: Date
  }
}, {
  timestamps: true
});

// Update progress when workout is completed
userProgramSchema.methods.updateProgress = function() {
  const completedWorkouts = this.workouts.filter(w => w.completed).length;
  const totalWorkouts = this.workouts.length;
  this.progress = totalWorkouts > 0 ? Math.round((completedWorkouts / totalWorkouts) * 100) : 0;
  
  if (this.progress === 100) {
    this.status = 'completed';
    this.endDate = new Date();
  }
};

module.exports = mongoose.model('UserProgram', userProgramSchema);