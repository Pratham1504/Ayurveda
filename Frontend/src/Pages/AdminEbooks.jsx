import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminEbooks = () => {
    const [ebooks, setEbooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();

    // Fetch all ebooks
    useEffect(() => {
        const fetchEbooks = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/ebooks');
                setEbooks(response.data);
            } catch (err) {
                console.error("Error fetching ebooks:", err);
                setError('Failed to fetch ebooks.');
            } finally {
                setLoading(false);
            }
        };
        fetchEbooks();
    }, []);

    // Handle delete
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this ebook?')) return;
        setLoading(true); // Start loading state
        try {
            await axios.delete(`http://localhost:4000/api/ebooks/${id}`);
            setEbooks(ebooks.filter(ebook => ebook._id !== id)); // Remove from UI
            setMessage('Ebook deleted successfully!');
        } catch (err) {
            console.error("Error deleting ebook:", err);
            setError('Failed to delete ebook.');
        } finally {
            setLoading(false); // End loading state
        }
    };

    // Handle download
    const handleDownload = (fileName) => {
        const downloadUrl = `http://localhost:4000/api/ebooks/download/${fileName}`; // Construct the download URL
        window.open(downloadUrl, '_blank');
    };

    if (loading) return <div className="text-center">Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="p-6 bg-white py-8 px-4 mx-auto max-w-screen-xl lg:py-8 lg:px-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-green-700">| Ebooks</h2>
                <Link to="/admin/ebooks/create" className="bg-green-500 text-white px-4 py-2 rounded-md">Add New Ebook</Link>
            </div>
            {message && <div className="bg-green-100 text-green-700 p-2 mb-4 rounded">{message}</div>}
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">Title</th>
                        <th className="py-2 px-4 border-b">Author</th>
                        <th className="py-2 px-4 border-b text-center">Download</th>
                        <th className="py-2 px-4 border-b text-center">Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {ebooks.map(ebook => (
                        <tr key={ebook._id}>
                            <td className="py-2 px-4 border-b">{ebook.title}</td>
                            <td className="py-2 px-4 border-b">{ebook.author}</td>
                            <td className="py-2 px-4 border-b text-center">
                                <button
                                    onClick={() => handleDownload(ebook.fileName)}
                                    className="bg-blue-500 text-white px-3 py-1 rounded-md mr-2"
                                >
                                    Download
                                </button>
                            </td>
                            <td className="py-2 px-4 border-b text-center">
                                <button
                                    onClick={() => handleDelete(ebook._id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded-md"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Loading Animation */}
            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                    <div className="loader"></div>
                </div>
            )}

            {/* CSS for loading spinner */}
            <style jsx>{`
                .loader {
                    border: 4px solid rgba(255, 255, 255, 0.3);
                    border-top: 4px solid white;
                    border-radius: 50%;
                    width: 50px;
                    height: 50px;
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default AdminEbooks;
