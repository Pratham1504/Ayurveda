const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
        min: 1,
    },
    email: {
        type: String,
        required: true,
    },
    phone_number: {
        type: String,
        required: true,
    },
    preferred_date: {
        type: Date,
        required: true,
    },
    preferred_time: {
        type: String,
        enum: ['morning', 'evening'],
        required: true,
    },
    communication_mode: {
        type: String,
        enum: ['whatsapp', 'gmeet'],
        required: true,
    },
    reason_for_appointment: {
        type: String,
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: 'pending',
    },
    transactionId: {
        type: String,
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    gmeet_link: {
        type: String,
        required: false,
    },
});

const Appointment = mongoose.model('Appointment', appointmentSchema);
module.exports = Appointment;
