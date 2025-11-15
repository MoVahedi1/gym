const asyncHandler = require('../middleware/asyncHandler');
const { ErrorResponse } = require('../middleware/error');
const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const users = await User.find()
    .select('-password')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await User.countDocuments();

  res.status(200).json({
    success: true,
    count: users.length,
    total,
    pagination: {
      page,
      pages: Math.ceil(total / limit)
    },
    data: users
  });
});

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('-password');

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).select('-password');

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'User updated successfully',
    data: user
  });
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: 'User deleted successfully'
  });
});

// @desc    Update user stats
// @route   PUT /api/users/:id/stats
// @access  Private
exports.updateUserStats = asyncHandler(async (req, res, next) => {
  const { workoutsCompleted, currentStreak, goalsAchieved, totalWorkoutTime, caloriesBurned } = req.body;

  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  // Update stats
  if (workoutsCompleted) user.stats.workoutsCompleted += workoutsCompleted;
  if (currentStreak) user.stats.currentStreak = currentStreak;
  if (goalsAchieved) user.stats.goalsAchieved += goalsAchieved;
  if (totalWorkoutTime) user.stats.totalWorkoutTime += totalWorkoutTime;
  if (caloriesBurned) user.stats.caloriesBurned += caloriesBurned;

  await user.save();

  res.status(200).json({
    success: true,
    message: 'User stats updated successfully',
    data: {
      stats: user.stats
    }
  });
});
