const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
} = require('../controllers/appointmentController');

router.use(authController.protect);

// Routes for getting all appointments and creating a new one
router.route('/')
  .get(getAllAppointments)
  .post(createAppointment);

// Routes for getting, updating, and deleting a single appointment by ID
router.route('/:id')
  .get(getAppointmentById)
  .put(updateAppointment)
  .delete(deleteAppointment);

module.exports = router;
