const mongoose = require('mongoose');

const ServiceProviderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide the provider's name"],
    trim: true,
  },
  specialty: {
    type: String,
    required: [true, "Please provide a specialty (e.g., 'Dentist', 'Stylist')"],
    trim: true,
  },
}, {
  timestamps: true
});

// VERY IMPORTANT: Ensure this is the exact line you are using to export.
module.exports = mongoose.model('ServiceProvider', ServiceProviderSchema);

