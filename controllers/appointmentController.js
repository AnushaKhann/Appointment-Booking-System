const Appointment = require('../models/Appointment');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// @desc    Create a new appointment
// @route   POST /api/appointments
exports.createAppointment = catchAsync(async (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  
  const newAppointment = new Appointment(req.body);
  await newAppointment.save();
  
  res.status(201).json({
    success: true,
    data: newAppointment,
  });
});

// @desc    Get all appointments
// @route   GET /api/appointments
exports.getAllAppointments = catchAsync(async (req, res, next) => {
  const appointments = await Appointment.find();

  res.status(200).json({
    success: true,
    count: appointments.length,
    data: appointments,
  });
});

// @desc    Get a single appointment by ID
// @route   GET /api/appointments/:id
exports.getAppointmentById = catchAsync(async (req, res, next) => {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    return next(new AppError('No appointment found with that ID', 404));
  }
  
  // TODO: Add logic to check if req.user.id matches appointment.user.id or if user is admin

  res.status(200).json({
    success: true,
    data: appointment,
  });
});

// @desc    Update an appointment
// @route   PUT /api/appointments/:id
exports.updateAppointment = catchAsync(async (req, res, next) => {
  const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!appointment) {
    return next(new AppError('No appointment found with that ID', 404));
  }

  res.status(200).json({
    success: true,
    data: appointment,
  });
});

// @desc    Delete an appointment
// @route   DELETE /api/appointments/:id
exports.deleteAppointment = catchAsync(async (req, res, next) => {
  const appointment = await Appointment.findByIdAndDelete(req.params.id);

  if (!appointment) {
    return next(new AppError('No appointment found with that ID', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Appointment deleted successfully',
  });
});

