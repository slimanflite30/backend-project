const AppError = require('../utils/appError');

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};
const handleDuplicateFieldsDB = err => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/);

  const message = `Duplicate field valid : ${value}  please use another value!`;
  return new AppError(message, 400);
};
const handleValidationFieldsDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid Input Data ${errors.join('. ')}`;
  return new AppError(message, 400);
};
const handleJsonWebError = () => {
  return new AppError('Invalid token please login again!', 401);
};
const handleTokenExpiredError = () => {
  return new AppError('you token has expired please login again!', 401);
};

const sendErrorProd = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message
  });
};
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (err.name === 'ERR_ASSERTION') {
    err = handleCastErrorDB(err);
  }
  if (err.code === 11000) {
    err = handleDuplicateFieldsDB(err);
  }
  if (err.name === 'ValidationError') {
    err = handleValidationFieldsDB(err);
  }
  if (err.name === 'JsonWebTokenError') {
    err = handleJsonWebError(err);
  }
  if (err.name === 'TokenExpiredError') {
    err = handleTokenExpiredError(err);
  }
  sendErrorProd(err, res);
};
