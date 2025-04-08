import React from 'react';
import { Link } from 'react-router-dom';

const Admin = () => {
    return (
        <div className="admin-container py-8">
            <div className="max-w-screen-xl mx-auto px-4 lg:px-6">
                <h1 className="text-3xl font-bold text-center text-green-600 mb-8">Admin Dashboard</h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Manage Blogs Tile */}
                    <Link to="/admin/blogs" className="admin-tile bg-gray-200  rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow flex flex-col items-center">
                        <h2 className="text-xl font-semibold text-gray-700">Manage Blogs</h2>
                        <p className="text-gray-500 text-center mt-2">Create, edit, or delete blog posts.</p>
                    </Link>

                    {/* Manage Products Tile */}
                    <Link to="/admin/products" className="admin-tile bg-gray-200   rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow flex flex-col items-center">
                        <h2 className="text-xl font-semibold text-gray-700">Manage Products</h2>
                        <p className="text-gray-500 text-center mt-2">Add, update, or remove products from the store.</p>
                    </Link>

                    {/* Manage Ebooks Tile */}
                    <Link to="/admin/ebooks" className="admin-tile bg-gray-200 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow flex flex-col items-center">
                        <h2 className="text-xl font-semibold text-gray-700">Manage Ebooks</h2>
                        <p className="text-gray-500 text-center mt-2">Upload and manage downloadable ebooks.</p>
                    </Link>

                    {/* Appointments Tile */}
                    <Link to="/admin/appointments" className="admin-tile bg-gray-200 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow flex flex-col items-center">
                        <h2 className="text-xl font-semibold text-gray-700">Appointments</h2>
                        <p className="text-gray-500 text-center mt-2">View and manage customer appointments.</p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Admin;
