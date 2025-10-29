const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  // Link to the ServiceProvider model
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceProvider',
    required: [true, 'An appointment must have a provider.'],
  },
  // Link to the Service model
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: [true, 'Please provide the required service.'],
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
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
    default: 'Pending',
  },
  // This links the appointment to the user who booked it.
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'An appointment must belong to a user.'],
  },
}, {
  timestamps: true,
});

// This will auto-populate the provider and service fields
AppointmentSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'provider',
    select: 'name specialty',
  }).populate({
    path: 'service',
    select: 'name duration price',
  });
  next();
});

module.exports = mongoose.model('Appointment', AppointmentSchema);

