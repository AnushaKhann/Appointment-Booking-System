const express = require('express');
const router = express.Router();
const {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService
} = require('../controllers/serviceController');

// Route for getting all services and creating a new one
router.route('/')
  .get(getAllServices)
  .post(createService);

// Route for getting, updating, and deleting a single service by ID
router.route('/:id')
  .get(getServiceById)
  .put(updateService)
  .delete(deleteService);

module.exports = router;
