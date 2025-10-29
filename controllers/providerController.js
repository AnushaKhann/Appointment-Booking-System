const ServiceProvider = require('../models/ServiceProvider');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// @desc    Create a new service provider
// @route   POST /api/providers
exports.createProvider = catchAsync(async (req, res, next) => {
  const { name, specialty } = req.body;
  const newProvider = new ServiceProvider({ name, specialty });
  await newProvider.save();
  res.status(201).json({ success: true, data: newProvider });
});

// @desc    Get all service providers
// @route   GET /api/providers
exports.getAllProviders = catchAsync(async (req, res, next) => {
  const providers = await ServiceProvider.find({});
  res.status(200).json({ success: true, count: providers.length, data: providers });
});

// @desc    Get a single service provider by ID
// @route   GET /api/providers/:id
exports.getProviderById = catchAsync(async (req, res, next) => {
  const provider = await ServiceProvider.findById(req.params.id);

  if (!provider) {
    // If no provider, pass a new AppError to the global handler
    return next(new AppError('No provider found with that ID', 404));
  }

  res.status(200).json({ success: true, data: provider });
});

// @desc    Update a service provider
// @route   PUT /api/providers/:id
exports.updateProvider = catchAsync(async (req, res, next) => {
  const provider = await ServiceProvider.findByIdAndUpdate(req.params.id, req.body, {
    new: true, // Return the modified document
    runValidators: true, // Run schema validators on update
  });

  if (!provider) {
    return next(new AppError('No provider found with that ID', 404));
  }

  res.status(200).json({ success: true, data: provider });
});

// @desc    Delete a service provider
// @route   DELETE /api/providers/:id
exports.deleteProvider = catchAsync(async (req, res, next) => {
  const provider = await ServiceProvider.findByIdAndDelete(req.params.id);

  if (!provider) {
    return next(new AppError('No provider found with that ID', 404));
  }

  res.status(200).json({ success: true, message: 'Provider deleted successfully' });
});

