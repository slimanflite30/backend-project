const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.createUser = catchAsync(async (req, res, next) => {
  const id = (await User.estimatedDocumentCount()) || 0;

  const newStudent = await User.create({
    ...req.body,
    phone: `${req.body.phone}`,
    id: id
  });
  res.status(200).json({
    status: 'success',
    data: {
      ...newStudent._doc,
      phone: req.body.phone
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
