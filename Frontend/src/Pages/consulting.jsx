import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    CalendarIcon,
    PhoneIcon,
    EnvelopeIcon,
    UserIcon,
    ChatBubbleBottomCenterTextIcon,
    LinkIcon,
} from '@heroicons/react/24/solid';
import { UserData } from '../Context/UserContext';

const Appointment = () => {
    const { user, loading } = UserData();

    const [formData, setFormData] = useState({
        name: '',
        age: '',
        email: '',
        phone_number: '',
        preferred_date: '',
        preferred_time: '',
        communication_mode: '',
        reason_for_appointment: '',
    });

    const [submitting, setSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [appointments, setAppointments] = useState([]);

    const fetchAppointments = async () => {
        if (!user?._id) return;
        try {
            const response = await axios.get(`http://localhost:4000/api/appointment/user/${user._id}`);
            setAppointments(response.data);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
    };

    useEffect(() => {
        if (user && user._id) {
            setFormData((prev) => ({
                ...prev,
                name: user.fullName || '',
                email: user.email || '',
                phone_number: user.mobileNo || '',
            }));
            fetchAppointments();
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setSuccessMessage('');
        setErrorMessage('');

        if (!user?._id) {
            setErrorMessage('You must be logged in to request an appointment.');
            setSubmitting(false);
            return;
        }

        try {
            await axios.post('http://localhost:4000/api/appointment', {
                ...formData,
                user_id: user._id,
            });
            setSuccessMessage('Appointment request submitted successfully!');
            setFormData({
                name: user.fullName || '',
                age: '',
                email: user.email || '',
                phone_number: user.mobileNo || '',
                preferred_date: '',
                preferred_time: '',
                communication_mode: '',
                reason_for_appointment: '',
            });
            fetchAppointments();
        } catch (error) {
            setErrorMessage('Failed to submit appointment request.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = async (id) => {
        const confirmed = window.confirm('Are you sure you want to cancel this appointment?');
        if (!confirmed) return;

        try {
            await axios.put(`http://localhost:4000/api/appointment/${id}/status`, {
                status: 'cancelled',
            });
            fetchAppointments();
        } catch (error) {
            console.error('Failed to cancel appointment:', error);
        }
    };

    const renderAppointmentCard = (appointment) => {
        const dateObj = new Date(appointment.preferred_date);
        const formattedDate = dateObj.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });

        const isUpcoming = ['pending', 'confirmed'].includes(appointment.status);
        const isPast = ['completed', 'cancelled'].includes(appointment.status);

        const communicationMsg = appointment.communication_mode === 'gmeet'
            ? 'Check your email inbox for the Google Meet link and scheduled time.'
            : appointment.communication_mode === 'whatsapp'
                ? 'Check your WhatsApp inbox for details.'
                : '';

        return (
            <div key={appointment._id} className="rounded-xl bg-white shadow-md border border-sky-100 p-4 mb-4">
                <div className="grid grid-cols-2 gap-3 text-sm text-gray-700">
                    <div>
                        <p className="font-semibold text-sky-800">Date</p>
                        <p>{formattedDate}</p>
                    </div>
                    <div>
                        <p className="font-semibold text-sky-800">Preferred Time</p>
                        <p>{appointment.preferred_time}</p>
                    </div>
                    <div>
                        <p className="font-semibold text-sky-800">Mode</p>
                        <p className="capitalize">{appointment.communication_mode}</p>
                    </div>
                    <div>
                        <p className="font-semibold text-sky-800">Status</p>
                        <p className="capitalize">{appointment.status}</p>
                    </div>
                </div>

                {/* Show GMeet link if available and status is confirmed*/}
                {appointment.communication_mode === 'gmeet' && appointment.status ==='confirmed' && appointment.gmeet_link && (
                    <p className="mt-3 text-sm flex items-center gap-1">
                        <LinkIcon className="w-4 h-4 text-blue-500" />
                        <a href={appointment.gmeet_link} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                            Join Meet
                        </a>
                    </p>
                )}

                {/* Follow-up reminder */}
                {(appointment.status === 'confirmed') && communicationMsg && (
                    <p className="mt-2 text-sm text-gray-600 italic">{communicationMsg}</p>
                )}

                {/* Cancel sentence link */}
                {isUpcoming && (
                    <p className="mt-3 text-sm text-gray-700">
                        If your plans have changed,{' '}
                        <span
                            onClick={() => handleCancel(appointment._id)}
                            className="text-red-600 hover:underline font-medium cursor-pointer"
                        >
                            cancel this appointment
                        </span>
                        .
                    </p>
                )}
            </div>
        );
    };


    if (loading) {
        return <div className="text-center py-12 text-lg text-gray-600 animate-pulse">Loading user info...</div>;
    }

    const confirmedOrPending = appointments.filter(a => ['confirmed', 'pending'].includes(a.status));
    const completedOrCanceled = appointments.filter(a => ['completed', 'cancelled'].includes(a.status));

    return (
        <section className="bg-gradient-to-br from-white to-sky-50 py-12 px-6 mx-auto max-w-3xl rounded-3xl shadow-xl border border-gray-100 transition-all duration-300 ease-in-out">
            <h2 className="text-4xl font-extrabold text-center text-sky-700 mb-10 tracking-tight">Book an Ayurvedic Consultation</h2>

            {successMessage && <p className="text-green-600 text-center mb-4 font-semibold animate-fade-in">{successMessage}</p>}
            {errorMessage && <p className="text-red-600 text-center mb-4 font-semibold animate-fade-in">{errorMessage}</p>}

            {user && confirmedOrPending.length > 0 && (
                <div className="space-y-4 mb-10">
                    <h3 className="text-xl font-semibold text-sky-700">Your Upcoming Appointments</h3>
                    {confirmedOrPending.map(renderAppointmentCard)}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative hover:scale-[1.01] transition-transform duration-200 ease-in-out">
                        <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                        <UserIcon className="h-5 w-5 text-gray-400 absolute top-10 left-3" />
                        <input
                            name="name"
                            id="name"
                            value={formData.name}
                            onChange={handleChange}
                            type="text"
                            placeholder="Enter your full name"
                            required
                            className="w-full pl-10 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-300"
                        />
                    </div>

                    <div className="hover:scale-[1.01] transition-transform duration-200 ease-in-out">
                        <label htmlFor="age" className="block text-sm font-semibold text-gray-700 mb-1">Age</label>
                        <input
                            name="age"
                            id="age"
                            value={formData.age}
                            onChange={handleChange}
                            type="number"
                            min="1"
                            placeholder="Enter your age"
                            required
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-300"
                        />
                    </div>

                    <div className="relative hover:scale-[1.01] transition-transform duration-200 ease-in-out">
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                        <EnvelopeIcon className="h-5 w-5 text-gray-400 absolute top-10 left-3" />
                        <input
                            name="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            type="email"
                            placeholder="example@example.com"
                            required
                            className="w-full pl-10 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-300"
                        />
                    </div>

                    <div className="relative hover:scale-[1.01] transition-transform duration-200 ease-in-out">
                        <label htmlFor="phone_number" className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                        <PhoneIcon className="h-5 w-5 text-gray-400 absolute top-10 left-3" />
                        <input
                            name="phone_number"
                            id="phone_number"
                            value={formData.phone_number}
                            onChange={handleChange}
                            type="tel"
                            placeholder="Enter phone number"
                            required
                            className="w-full pl-10 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-300"
                        />
                    </div>

                    <div className="relative hover:scale-[1.01] transition-transform duration-200 ease-in-out">
                        <label htmlFor="preferred_date" className="block text-sm font-semibold text-gray-700 mb-1">Preferred Date</label>
                        <CalendarIcon className="h-5 w-5 text-gray-400 absolute top-10 left-3" />
                        <input
                            name="preferred_date"
                            id="preferred_date"
                            value={formData.preferred_date}
                            onChange={handleChange}
                            type="date"
                            required
                            className="w-full pl-10 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-300"
                        />
                    </div>

                    <div className="hover:scale-[1.01] transition-transform duration-200 ease-in-out">
                        <label htmlFor="preferred_time" className="block text-sm font-semibold text-gray-700 mb-1">Preferred Time</label>
                        <select
                            name="preferred_time"
                            id="preferred_time"
                            value={formData.preferred_time}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-300"
                        >
                            <option value="" disabled>Select a time</option>
                            <option value="morning">Morning</option>
                            <option value="evening">Evening</option>
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Preferred Communication Mode</label>
                        <div className="flex flex-wrap gap-x-8 gap-y-2">
                            <label className="inline-flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="communication_mode"
                                    value="whatsapp"
                                    checked={formData.communication_mode === 'whatsapp'}
                                    onChange={handleChange}
                                    className="text-sky-600 focus:ring-sky-500"
                                />
                                WhatsApp
                            </label>
                            <label className="inline-flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="communication_mode"
                                    value="gmeet"
                                    checked={formData.communication_mode === 'gmeet'}
                                    onChange={handleChange}
                                    className="text-sky-600 focus:ring-sky-500"
                                />
                                Google Meet
                            </label>
                        </div>
                    </div>
                </div>

                <div className="hover:scale-[1.005] transition-transform duration-200 ease-in-out">
                    <label htmlFor="reason_for_appointment" className="block text-sm font-semibold text-gray-700 mb-1">
                        Reason for Appointment
                    </label>
                    <div className="relative">
                        <ChatBubbleBottomCenterTextIcon className="h-5 w-5 text-gray-400 absolute top-3 left-3" />
                        <textarea
                            name="reason_for_appointment"
                            id="reason_for_appointment"
                            value={formData.reason_for_appointment}
                            onChange={handleChange}
                            placeholder="Describe the reason for consultation..."
                            rows="4"
                            required
                            className="w-full pl-10 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-300"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={submitting}
                    className="bg-sky-600 hover:bg-sky-700 text-white font-semibold px-6 py-3 rounded-xl w-full transition duration-300 ease-in-out hover:scale-[1.02] shadow"
                >
                    {submitting ? 'Submitting...' : 'Submit Appointment Request'}
                </button>
            </form>

            {user && completedOrCanceled.length > 0 && (
                <div className="space-y-4 mt-10">
                    <h3 className="text-xl font-semibold text-gray-700">Your Past Appointments</h3>
                    {completedOrCanceled.map(renderAppointmentCard)}
                </div>
            )}
        </section>
    );
};

export default Appointment;
