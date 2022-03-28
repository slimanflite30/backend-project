const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  const token = signToken(newUser._id);
  console.log('here');
  res.status(201).json({
    status: 'success',
    data: {
      newUser,
      token
    }
  });
});
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //if check email and password exist
  if (!email || !password) {
    next(new AppError('please privide email and password ', 400));
  }
  const user = await User.findOne({ email }).select('+password');
  const correct = user.correctPassword(password, user.password);
  if (!user || !correct) {
    next(new AppError('Incorrect email or password', 401));
  }
  const token = signToken(user._id);
  res.status(201).json({
    status: 'success',
    data: {
      user,
      token
    }
  });
});
exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(new AppError('you are not logged please login again!', 401));
  }
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(new AppError('this token does not longer exist', 401));
  }
  // if (freshUser.changePsswordAfter(decoded.ita)) {
  //   return next(
  //     new AppError('User recently changed password!, login again', 401)
  //   );
  // }

  req.user = freshUser;
  next();
});
