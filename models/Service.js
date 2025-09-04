const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide the service name"],
    trim: true,
  },
  description: {
    type: String,
    required: false,
    trim: true,
  },
  duration: {
    type: Number, // Duration in minutes
    required: [true, "Please provide the service duration in minutes"],
  },
  price: {
    type: Number,
    required: false, // Price might not be applicable for all services
  },
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Service', ServiceSchema);
