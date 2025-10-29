const Appointment = require('../models/Appointment');
const ServiceProvider = require('../models/ServiceProvider');
const Service = require('../models/Service');
const catchAsync = require('../utils/catchAsync');

// @desc    Create a new appointment
// @route   POST /api/appointments
exports.createAppointment = catchAsync(async (req, res, next) => {
    // Note: In a real app, you'd add logic here to check for provider availability
    const newAppointment = new Appointment(req.body);
    await newAppointment.save();
    res.status(201).json({ success: true, data: newAppointment });
});

// @desc    Get all appointments
// @route   GET /api/appointments
exports.getAllAppointments = catchAsync(async (req, res, next) => {
    const appointments = await Appointment.find({})
      .populate('provider', 'name specialty') // Populate provider with only name and specialty
      .populate('service', 'name duration price'); // Populate service with name, duration, and price

    res.status(200).json({ success: true, count: appointments.length, data: appointments });
});

// @desc    Get a single appointment by ID
// @route   GET /api/appointments/:id
exports.getAppointmentById = catchAsync(async (req, res, next) => {
    const appointment = await Appointment.findById(req.params.id)
      .populate('provider', 'name specialty')
      .populate('service', 'name duration');

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    res.status(200).json({ success: true, data: appointment });
});

// @desc    Update an appointment (e.g., to change status)
// @route   PUT /api/appointments/:id
exports.updateAppointment = catchAsync(async (req, res, next) => {
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    res.status(200).json({ success: true, data: appointment });
});

// @desc    Delete an appointment
// @route   DELETE /api/appointments/:id
exports.deleteAppointment = catchAsync(async (req, res, next) => {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    res.status(200).json({ success: true, message: 'Appointment cancelled successfully' });
});

