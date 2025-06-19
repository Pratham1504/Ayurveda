import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {server} from '../main';

const AdminAppointmentsPage = () => {
    const [appointments, setAppointments] = useState([]);
    const [notification, setNotification] = useState('');

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await axios.get(`${server}/api/appointment/admin/all`);
            setAppointments(response.data);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
    };

    const showNotification = (message) => {
        setNotification(message);
        setTimeout(() => setNotification(''), 3000); // 3 seconds
    };

    const handleStatusChange = async (id, status) => {
        try {
            await axios.put(`${server}/api/appointment/${id}/status`, { status });
            fetchAppointments();
            showNotification('Appointment status updated!');
        } catch (error) {
            console.error('Error updating status:', error);
            showNotification('error changing Appointment status!');
        }
    };

    const handleGMeetLinkChange = (index, value) => {
        const updated = [...appointments];
        updated[index].gmeet_link = value;
        setAppointments(updated);
    };

    const handleSaveGMeetLink = async (id, link) => {
        try {
            await axios.put(`${server}/api/appointment/${id}/gmeet_link`, { gmeet_link: link });
            fetchAppointments();
            showNotification('GMeet link saved!');
        } catch (error) {
            console.error('Error updating GMeet link:', error);
            showNotification('error changing Gmeet Link!');
        }
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-sky-700">All Appointments</h2>
            {notification && (
                <div className="transition-opacity duration-500 opacity-100 mb-4 px-4 py-2 rounded bg-green-100 text-green-700 text-center shadow transition-all duration-300">
                    {notification}
                </div>
            )}

            <div className="space-y-6">
                {appointments.map((appointment, index) => (
                    <div key={appointment._id} className="bg-white shadow border border-gray-200 rounded-lg p-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-700">
                            <div><strong>Name:</strong> {appointment.name}</div>
                            <div><strong>Email:</strong> {appointment.email}</div>
                            <div><strong>Phone:</strong> {appointment.phone_number}</div>
                            <div><strong>Age:</strong> {appointment.age}</div>
                            <div><strong>Date:</strong> {new Date(appointment.preferred_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                            <div><strong>Time:</strong> {appointment.preferred_time}</div>
                            <div><strong>Mode:</strong> {appointment.communication_mode}</div>
                            <div><strong>Status:</strong>
                                <select
                                    className="border rounded px-1 py-0.5 ml-1"
                                    value={appointment.status}
                                    onChange={(e) => handleStatusChange(appointment._id, e.target.value)}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>
                        <div className="mt-3">
                            <strong>Reason:</strong> {appointment.reason_for_appointment}
                        </div>
                        {appointment.communication_mode === 'gmeet' && (
                            <div className="mt-3">
                                <label className="text-sm font-medium">GMeet Link</label>
                                <div className="flex items-center gap-2 mt-1">
                                    <input
                                        type="text"
                                        className="border border-gray-300 rounded px-2 py-1 w-full"
                                        value={appointment.gmeet_link || ''}
                                        onChange={(e) => handleGMeetLinkChange(index, e.target.value)}
                                    />
                                    <button
                                        onClick={() => handleSaveGMeetLink(appointment._id, appointment.gmeet_link)}
                                        className="bg-sky-600 text-white text-sm px-3 py-1 rounded hover:bg-sky-700"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminAppointmentsPage;
