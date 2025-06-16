const Appointment = require('../models/appointmentModel');

// Create a new appointment
const createAppointment = async (req, res) => {
    try {
        const {
            user_id,
            name,
            age,
            email,
            phone_number,
            preferred_date,
            preferred_time,
            communication_mode,
            reason_for_appointment,
            transactionId
        } = req.body;

        // Validate required fields
        if (!name || !email || !phone_number || !preferred_date || !preferred_time || !communication_mode || !age || !transactionId) {
            return res.status(400).json({ message: 'Please fill all required fields' });
        }

        if (isNaN(age) || age <= 0) {
            return res.status(400).json({ message: 'Invalid age' });
        }

        // Check date is not in the past
        if (new Date(preferred_date) < new Date()) {
            return res.status(400).json({ message: 'Preferred date cannot be in the past' });
        }

        const newAppointment = new Appointment({
            user_id,
            name,
            age,
            email,
            phone_number,
            preferred_date,
            preferred_time,
            communication_mode,
            reason_for_appointment,
            transactionId,
            status: 'pending',
        });

        const savedAppointment = await newAppointment.save();

        // TODO: Send confirmation via email or WhatsApp=?manual

        res.status(201).json(savedAppointment);
    } catch (error) {
        res.status(500).json({ message: 'Error creating appointment', error });
    }
};

// Get a specific appointment by ID
const getAppointmentById = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        res.status(200).json(appointment);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching appointment', error });
    }
};

// Get all appointments (admin view)
const getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find().sort({ created_at: -1 });
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving appointments', error });
    }
};

// Update status of an appointment
const updateAppointmentStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        res.status(200).json(appointment);
    } catch (error) {
        res.status(500).json({ message: 'Error updating status', error });
    }
};

// Add or update GMeet link
const updateGmeetLink = async (req, res) => {
    try {
        const { gmeet_link } = req.body;

        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            { gmeet_link },
            { new: true }
        );

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        res.status(200).json(appointment);
    } catch (error) {
        res.status(500).json({ message: 'Error updating GMeet link', error });
    }
};

// Get appointments by user ID
const getAppointmentsByUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    const appointments = await Appointment.find({ user_id: userId }).sort({ preferred_date: -1, preferred_time: -1 });
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Server error fetching appointments' });
  }
};

module.exports = {
    createAppointment,
    getAppointmentById,
    getAllAppointments,
    updateAppointmentStatus,
    updateGmeetLink,
    getAppointmentsByUser,
};
