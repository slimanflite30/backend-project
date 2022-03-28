const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  __v: {
    type: Number,
    select: false
  },
  name: {
    type: String,
    required: [true, 'Please tell us your name']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'please provide a valid email']
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'please provide a password'],
    minLength: 8,
    select: false
  },
  passwordChangeAt: Date
  // passwordConfrim: {
  //   validate: {
  //     validator: function(el) {
  //       return el === this.password;
  //     },
  //     message: 'Password are not the same'
  //   }
  // }
});
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfrim = undefined;
});
userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPssword
) {
  return await bcrypt.compare(candidatePassword, userPssword);
};
userSchema.methods.changePsswordAfter = async function(JWTTimestamp) {
  if (this.passwordChangeAt) {
    const timesTamp = parseInt(this.passwordChangeAt.getDate() / 1000, 10);
    return JWTTimestamp < timesTamp;
  }
  return false;
};
const User = mongoose.model('User', userSchema);
module.exports = User;
