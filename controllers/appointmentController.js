const Appointment = require('../models/Appointment');
const ServiceProvider = require('../models/ServiceProvider');
const Service = require('../models/Service');

// @desc    Create a new appointment
// @route   POST /api/appointments
exports.createAppointment = async (req, res) => {
  try {
    // Note: In a real app, you'd add logic here to check for provider availability
    const newAppointment = new Appointment(req.body);
    await newAppointment.save();
    res.status(201).json({ success: true, data: newAppointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all appointments
// @route   GET /api/appointments
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({})
      .populate('provider', 'name specialty') // Populate provider with only name and specialty
      .populate('service', 'name duration price'); // Populate service with name, duration, and price

    res.status(200).json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get a single appointment by ID
// @route   GET /api/appointments/:id
exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('provider', 'name specialty')
      .populate('service', 'name duration');

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update an appointment (e.g., to change status)
// @route   PUT /api/appointments/:id
exports.updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete an appointment
// @route   DELETE /api/appointments/:id
exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    res.status(200).json({ success: true, message: 'Appointment cancelled successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
