const express = require('express');
const router = express.Router();
const {
  createProvider,
  getAllProviders,
  getProviderById,
  updateProvider,
  deleteProvider
} = require('../controllers/providerController');

// Route for getting all providers and creating a new one
router.route('/')
  .get(getAllProviders)
  .post(createProvider);

// Route for getting, updating, and deleting a single provider by ID
router.route('/:id')
  .get(getProviderById)
  .put(updateProvider)
  .delete(deleteProvider);

module.exports = router;

