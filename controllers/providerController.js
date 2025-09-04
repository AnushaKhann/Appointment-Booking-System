const ServiceProvider = require('../models/ServiceProvider');

// @desc    Create a new service provider
// @route   POST /api/providers
exports.createProvider = async (req, res) => {
  try {
    const { name, specialty } = req.body;
    const newProvider = new ServiceProvider({ name, specialty });
    await newProvider.save();
    res.status(201).json({ success: true, data: newProvider });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all service providers
// @route   GET /api/providers
exports.getAllProviders = async (req, res) => {
  try {
    const providers = await ServiceProvider.find({});
    res.status(200).json({ success: true, count: providers.length, data: providers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get a single service provider by ID
// @route   GET /api/providers/:id
exports.getProviderById = async (req, res) => {
  try {
    const provider = await ServiceProvider.findById(req.params.id);
    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider not found' });
    }
    res.status(200).json({ success: true, data: provider });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a service provider
// @route   PUT /api/providers/:id
exports.updateProvider = async (req, res) => {
  try {
    const provider = await ServiceProvider.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the modified document
      runValidators: true, // Run schema validators on update
    });
    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider not found' });
    }
    res.status(200).json({ success: true, data: provider });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a service provider
// @route   DELETE /api/providers/:id
exports.deleteProvider = async (req, res) => {
  try {
    const provider = await ServiceProvider.findByIdAndDelete(req.params.id);
    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider not found' });
    }
    res.status(200).json({ success: true, message: 'Provider deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

