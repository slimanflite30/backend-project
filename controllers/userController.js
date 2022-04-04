const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null
  });
});
exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});
exports.getUser = catchAsync(async (req, res, next) => {
  const student = await User.findOne({ id: req.params.id });
  if (!student) {
    return next(new AppError('No newUser found with ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      student
    }
  });
});
exports.getAllUser = catchAsync(async (req, res, next) => {
  const students = await User.find();
  res.status(200).json({
    status: 'success',
    results: students.length,
    data: {
      students
    }
  });
});
exports.updateUser = catchAsync(async (req, res, next) => {
  const newUser = await User.findOneAndUpdate({ id: req.params.id }, req.body, {
    new: true,
    runValidators: true
  });
  if (!newUser) {
    return next(new AppError('No User found with ID', 404));
  }
  res.status(200).json({
    status: 'update success',
    data: {
      newUser
    }
  });
});
exports.deleteUser = catchAsync(async (req, res, next) => {
  const student = await User.deleteOne({ id: req.params.id });
  if (!student) {
    return next(new AppError('No Student found with ID', 404));
  }
  res.status(204).json({
    status: 'update success',
    data: {
      student
    }
  });
});
