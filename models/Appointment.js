const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  // Link to the ServiceProvider model
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceProvider', // This refers to the 'ServiceProvider' model
    required: true,
  },
  // Link to the Service model
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service', // This refers to the 'Service' model
    required: true,
  },
  // Customer details
  customerName: {
    type: String,
    required: [true, "Please provide the customer's name"],
    trim: true,
  },
  customerEmail: {
    type: String,
    required: [true, "Please provide the customer's email"],
    trim: true,
  },
  // Appointment time
  appointmentDate: {
    type: Date,
    required: [true, "Please provide the appointment date and time"],
  },
  // Status of the appointment
  status: {
    type: String,
    enum: ['Scheduled', 'Completed', 'Cancelled'],
    default: 'Scheduled',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Appointment', AppointmentSchema);
