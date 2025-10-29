const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  role: {
    type: String,
    enum: ['customer', 'admin'],
    default: 'customer',
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false, // Hides this field from being returned in query results
  },
  confirmPassword: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This custom validator only works on CREATE and SAVE!
      validator: function(el) {
        return el === this.password; // Check if confirmPassword matches password
      },
      message: 'Passwords are not the same!',
    },
  },
});

// Mongoose "pre-save" middleware
// This function runs BEFORE a new user document is saved to the database
userSchema.pre('save', async function(next) {
  // 1. Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // 2. Hash the password with a cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // 3. Delete the confirmPassword field; we don't need to save it to the DB
  this.confirmPassword = undefined;
  next();
});

// Mongoose "instance method"
// This method will be available on all user documents
userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  // Compares the plaintext candidate password with the hashed userPassword
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;

