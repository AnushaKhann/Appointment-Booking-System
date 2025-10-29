const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

/**
 * Creates a JWT token for a given user ID.
 * @param {string} id - The user's MongoDB document ID.
 * @returns {string} - The signed JSON Web Token.
 */
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

/**
 * @desc    Register a new user
 * @route   POST /api/users/signup
 */
exports.signup = catchAsync(async (req, res, next) => {
  // Create a new user, selecting only the fields we allow for signup
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    role: req.body.role, // This will default to 'customer'
  });

  // Create a token for the new user
  const token = signToken(newUser._id);

  // Send the response
  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

/**
 * @desc    Log in a user
 * @route   POST /api/users/login
 */
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password are provided
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  // 2) Find the user by email, and explicitly include the password
  const user = await User.findOne({ email }).select('+password');

  // 3) Check if user exists and if the password is correct
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 4) If everything is ok, send token to client
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});

/**
 * @desc    Middleware to protect routes
 * Checks for a valid JWT token
 */
exports.protect = catchAsync(async (req, res, next) => {
  // 1) Get token and check if it exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  // 2) Verify the token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token no longer exists.',
        401
      )
    );
  }

  // 4) GRANT ACCESS: Attach user to the request object
  req.user = currentUser;
  next();
});

/**
 * @desc    Middleware for Role-Based Access Control (RBAC)
 * @param   {...string} roles - An array of roles (e.g., 'admin', 'lead-guide')
 */
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // req.user is available thanks to the protect middleware
    // Check if the user's role is in the allowed roles array
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action.', 403)
      );
    }
    next();
  };
};

