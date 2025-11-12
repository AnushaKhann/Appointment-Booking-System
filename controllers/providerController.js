const ServiceProvider = require('../models/ServiceProvider');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

// @desc    Create a new service provider
// @route   POST /api/providers
exports.createProvider = catchAsync(async (req, res, next) => {
  const newProvider = new ServiceProvider(req.body);
  await newProvider.save();
  res.status(201).json({
    success: true,
    data: newProvider,
  });
});

// @desc    Get all service providers
// @route   GET /api/providers
exports.getAllProviders = catchAsync(async (req, res, next) => {
  // 1) Create the APIFeatures object
  const features = new APIFeatures(ServiceProvider.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  // 2) Execute the query
  const providers = await features.query;

  // 3) Send the response
  res.status(200).json({
    success: true,
    count: providers.length,
    data: providers,
  });
});

// @desc    Get a single service provider by ID
// @route   GET /api/providers/:id
exports.getProviderById = catchAsync(async (req, res, next) => {
  const provider = await ServiceProvider.findById(req.params.id);

  if (!provider) {
    return next(new AppError('No provider found with that ID', 404));
  }

  res.status(200).json({
    success: true,
    data: provider,
  });
});

// @desc    Update a service provider
// @route   PUT /api/providers/:id
exports.updateProvider = catchAsync(async (req, res, next) => {
  const provider = await ServiceProvider.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!provider) {
    return next(new AppError('No provider found with that ID', 404));
  }

  res.status(200).json({
    success: true,
    data: provider,
  });
});

// @desc    Delete a service provider
// @route   DELETE /api/providers/:id
exports.deleteProvider = catchAsync(async (req, res, next) => {
  const provider = await ServiceProvider.findByIdAndDelete(req.params.id);

  if (!provider) {
    return next(new AppError('No provider found with that ID', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Provider deleted successfully',
  });
});