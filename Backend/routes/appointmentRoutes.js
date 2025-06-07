const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

// Define routes
router.post('/', appointmentController.createAppointment);
router.get('/:id', appointmentController.getAppointmentById);
router.get('/admin/all', appointmentController.getAllAppointments);
router.put('/:id/status', appointmentController.updateAppointmentStatus);
router.put('/:id/gmeet_link', appointmentController.updateGmeetLink);
router.get('/user/:userId', appointmentController.getAppointmentsByUser);

module.exports = router;
