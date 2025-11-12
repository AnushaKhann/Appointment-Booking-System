    const express = require('express');
    const router = express.Router();
    const {
      createService,
      getAllServices,
      getServiceById,
      updateService,
      deleteService,
      getServiceStats, // 1. Import the new function
    } = require('../controllers/serviceController');
    const authController = require('../controllers/authController');

    // 2. Add the new route here
    // This route should also be admin-only
    router
      .route('/stats')
      .get(
        authController.protect,
        authController.restrictTo('admin'),
        getServiceStats
      );

    router
      .route('/')
      .get(getAllServices) // Public for anyone to see
      .post(
        authController.protect,
        authController.restrictTo('admin'),
        createService
      );

    router
      .route('/:id')
      .get(getServiceById) // Public for anyone to see
      .put(
        authController.protect,
        authController.restrictTo('admin'),
        updateService
      )
      .delete(
        authController.protect,
        authController.restrictTo('admin'),
        deleteService
      );

    module.exports = router;