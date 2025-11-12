const Service = require('../models/Service');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

// @desc    Create a new service
// @route   POST /api/services
exports.createService = catchAsync(async (req, res, next) => {
  const newService = new Service(req.body);
  await newService.save();
  res.status(201).json({
    success: true,
    data: newService,
  });
});

// @desc    Get all services
// @route   GET /api/services
exports.getAllServices = catchAsync(async (req, res, next) => {
  // 1) Create the APIFeatures object
  const features = new APIFeatures(Service.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  // 2) Execute the query
  const services = await features.query;

  // 3) Send the response
  res.status(200).json({
    success: true,
    count: services.length,
    data: services,
  });
});

// @desc    Get a single service by ID
// @route   GET /api/services/:id
exports.getServiceById = catchAsync(async (req, res, next) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    return next(new AppError('No service found with that ID', 404));
  }

  res.status(200).json({
    success: true,
    data: service,
  });
});

// @desc    Update a service
// @route   PUT /api/services/:id
exports.updateService = catchAsync(async (req, res, next) => {
  const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!service) {
    return next(new AppError('No service found with that ID', 404));
  }

  res.status(200).json({
    success: true,
    data: service,
  });
});

// @desc    Delete a service
// @route   DELETE /api/services/:id
exports.deleteService = catchAsync(async (req, res, next) => {
  const service = await Service.findByIdAndDelete(req.params.id);

  if (!service) {
    return next(new AppError('No service found with that ID', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Service deleted successfully',
  });
});