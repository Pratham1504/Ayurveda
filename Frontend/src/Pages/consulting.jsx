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
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from "framer-motion";

const Appointment = () => {
    const { user } = UserData();
    const [applicationload, setapplicationload] = useState(true);

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
    const [appointments, setAppointments] = useState([]);

    const fetchAppointments = async () => {
        if (!user?._id) return;
        try {
            const response = await axios.get(`http://localhost:4000/api/appointment/user/${user._id}`);
            setAppointments(response.data);
            setapplicationload(false);
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

        if (!user?._id) {
            toast.error('You must be logged in to request an appointment.');
            setSubmitting(false);
            return;
        }

        try {
            await axios.post('http://localhost:4000/api/appointment', {
                ...formData,
                user_id: user._id,
            });
            toast.success('Appointment request submitted successfully!');
            setSubmitting(false);
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
            toast.error('Failed to submit appointment request.');
        }

    };

    const handleCancel = async (id) => {
        const confirmed = window.confirm('Are you sure you want to cancel this appointment?');
        if (!confirmed) return;

        try {
            await axios.put(`http://localhost:4000/api/appointment/${id}/status`, {
                status: 'cancelled',
            });
            toast.success('Appointment cancelled.');
            fetchAppointments();
        } catch (error) {
            console.error('Failed to cancel appointment:', error);
        }
    };

    function getTomorrow() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    }

    const [showPastAppointments, setShowPastAppointments] = useState(false);
    const [pastLoaded, setPastLoaded] = useState(false);

    const handleTogglePast = () => {
        setShowPastAppointments(prev => {
            const next = !prev;
            if (next && !pastLoaded) setPastLoaded(true); // load once
            return next;
        });
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
                        <p>{appointment.preferred_time.charAt(0).toUpperCase() + appointment.preferred_time.slice(1)}</p>
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
                {appointment.communication_mode === 'gmeet' && appointment.status === 'confirmed' && appointment.gmeet_link && (
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
    const AppointmentSkeleton = () => (
        <div className="rounded-xl bg-white shadow-md border border-sky-100 p-4 mb-4 animate-pulse">
            <div className="grid grid-cols-2 gap-3 text-sm text-gray-700">
                {[...Array(4)].map((_, i) => (
                    <div key={i}>
                        <div className="h-4 w-24 bg-sky-200 rounded mb-1" />
                        <div className="h-4 w-28 bg-gray-200 rounded" />
                    </div>
                ))}
            </div>

            <div className="mt-3">
                <div className="h-4 w-60 bg-red-200 rounded" />
            </div>
        </div>
    );

    const confirmedOrPending = appointments.filter(a => ['confirmed', 'pending'].includes(a.status));
    const completedOrCanceled = appointments.filter(a => ['completed', 'cancelled'].includes(a.status));

    return (
        <section className="bg-gradient-to-br from-white to-sky-50 py-8 sm:py-10 px-4 sm:px-6 mx-auto rounded-3xl shadow-xl border border-gray-100 transition-all duration-300 ease-in-out">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center text-sky-700 mb-10 tracking-tight">Book an Ayurvedic Consultation</h2>
            {applicationload && (
                <section className="mx-auto">
                    <AppointmentSkeleton key={0} />
                </section>
            )}
            {!applicationload && user && confirmedOrPending.length > 0 && (
                <div className="space-y-4 mb-10">
                    <h3 className="text-lg sm:text-xl font-semibold text-sky-700">Your Upcoming Appointments</h3>
                    {confirmedOrPending.map(renderAppointmentCard)}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative hover:scale-[1.01] transition-transform duration-200 ease-in-out">
                        <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                        <UserIcon className="w-4 h-4 text-gray-400 absolute top-10 left-3" />
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
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-300 no-spinner"
                        />
                    </div>

                    <div className="relative hover:scale-[1.01] transition-transform duration-200 ease-in-out">
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                        <EnvelopeIcon className="w-4 h-4 text-gray-400 absolute top-10 left-3" />
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
                        <PhoneIcon className="w-4 h-4 text-gray-400 absolute top-10 left-3" />
                        <input
                            name="phone_number"
                            id="phone_number"
                            value={formData.phone_number}
                            onChange={handleChange}
                            pattern="[0-9]{10}"
                            type="tel"
                            placeholder="Enter phone number"
                            required
                            className="w-full pl-10 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-300"
                        />
                    </div>

                    <div className="relative hover:scale-[1.01] transition-transform duration-200 ease-in-out">
                        <label htmlFor="preferred_date" className="block text-sm font-semibold text-gray-700 mb-1">Preferred Date</label>
                        <CalendarIcon className="w-4 h-4 text-gray-400 absolute top-10 left-3" />
                        <input
                            name="preferred_date"
                            id="preferred_date"
                            value={formData.preferred_date}
                            onChange={handleChange}
                            type="date"
                            required
                            min={getTomorrow()}
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
                        <ChatBubbleBottomCenterTextIcon className="w-4 h-4 text-gray-400 absolute top-3 left-3" />
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
                <div className="mt-10">
                    <button
                        onClick={handleTogglePast}
                        className="w-full flex justify-between items-center bg-gray-100 px-4 py-2 rounded-xl border text-gray-700 hover:bg-gray-200 transition"
                    >
                        <span className="text-sm font-medium">Your Past Appointments</span>
                        <svg
                            className={`w-4 h-4 transition-transform ${showPastAppointments ? 'rotate-180' : 'rotate-0'}`}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    <AnimatePresence initial={false}>
                        {showPastAppointments && pastLoaded && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="overflow-hidden"
                            >
                                <div className="space-y-4 mt-4">
                                    {completedOrCanceled.map(renderAppointmentCard)}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}


        </section>
    );
};

export default Appointment;
