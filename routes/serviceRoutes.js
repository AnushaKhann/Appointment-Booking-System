    const express = require('express');
    const router = express.Router();
    const {
      createService,
      getAllServices,
      getServiceById,
      updateService,
      deleteService
    } = require('../controllers/serviceController');
    const authController = require('../controllers/authController');
    
    router.route('/')
      .get(getAllServices) 
      .post(
        authController.protect,
        authController.restrictTo('admin'),
        createService
      );
    
    router.route('/:id')
      .get(getServiceById)
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
