import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { NotificationContext } from '../context/NotificationContext'; // Import context

const AdminBlogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deletedBlog, setDeletedBlog] = useState(null); // Track deleted blog for undo
    const { state, setMessage ,clearMessage} = useContext(NotificationContext); // Access global message state
    const navigate = useNavigate();

    // Fetch all blogs
    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/blogs');
                setBlogs(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching blogs:", err);
                setError(err);
                setLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    // Handle delete with undo functionality
    const handleDelete = async (id) => {
        const deletedBlog = blogs.find(blog => blog._id === id);
        setDeletedBlog(deletedBlog);
        try {
            await axios.delete(`http://localhost:4000/api/blogs/${id}`);
            setBlogs(blogs.filter(blog => blog._id !== id)); // Remove the deleted blog from state
            setMessage('Blog deleted.'); // Show success message
        } catch (err) {
            console.error("Error deleting blog:", err);
            setMessage('Error deleting blog.');
        }
    };

    // Undo delete by re-adding the deleted blog
    const handleUndoDelete = async () => {
        if (deletedBlog) {
            try {
                await axios.post('http://localhost:4000/api/blogs', deletedBlog);
                setBlogs([...blogs, deletedBlog]);
                setDeletedBlog(null); // Clear the deleted blog after undo
                setMessage('Blog restored.');
            } catch (err) {
                console.error('Error restoring blog:', err);
            }
        }
    };

    // Navigate to edit page
    const handleEdit = (id) => {
        navigate(`/admin/blogs/edit/${id}`);
    };

    if (loading) return <div className="text-center">Loading...</div>;
    if (error) return <div className="text-red-500">Error fetching blogs: {error.message}</div>;

    return (
        <div className="p-6 bg-white py-8 px-4 mx-auto max-w-screen-xl lg:py-8 lg:px-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-green-700">| Manage Blogs</h2>
                <Link to="/admin/blogs/create" className="bg-green-500 text-white px-4 py-2 rounded-md">Add New Blog</Link>
            </div>

            {/* Success/Error Message */}
            {state.showMessage && (
                <div className="fixed top-4 right-4 p-4 bg-green-500 text-white rounded shadow animate-pulse">
                    <span>{state.message}</span>
                    <button onClick={() => clearMessage()} className="ml-2">x</button>
                </div>
            )}

            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">Title</th>
                        <th className="py-2 px-4 border-b">Topic</th>
                        <th className="py-2 px-4 border-b">Created At</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {blogs.map(blog => (
                        <tr key={blog._id}>
                            <td className="py-2 px-4 border-b">{blog.title}</td>
                            <td className="py-2 px-4 border-b">{blog.topic}</td>
                            <td className="py-2 px-4 border-b">{new Date(blog.createdAt).toLocaleDateString()}</td>
                            <td className="py-2 px-4 border-b">
                                <button 
                                    onClick={() => handleEdit(blog._id)} 
                                    className="bg-blue-500 text-white px-3 py-1 rounded-md mr-2"
                                >
                                    Edit
                                </button>
                                <button 
                                    onClick={() => handleDelete(blog._id)} 
                                    className="bg-red-500 text-white px-3 py-1 rounded-md"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Undo Delete Button */}
            {deletedBlog && (
                <div className="fixed top-4 right-4 p-4 bg-yellow-500 text-white rounded shadow animate-bounce">
                    <p>Blog deleted. <button onClick={handleUndoDelete} className="underline">Undo</button></p>
                </div>
            )}
        </div>
    );
};

export default AdminBlogs;
