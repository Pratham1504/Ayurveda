import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const BlogList = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/blogs'); // Adjust URL if necessary
                setBlogs(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Function to truncate HTML description
    const truncateHtml = (html, maxLength) => {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = html;

        // Remove HTML tags
        const textContent = tempDiv.textContent || tempDiv.innerText || "";

        // Truncate to maxLength
        return textContent.length > maxLength 
            ? textContent.substring(0, maxLength) + '...' 
            : textContent;
    };

    if (loading) return <div className="text-center">Loading...</div>;
    if (error) return <div className="text-red-500">Error fetching blogs: {error.message}</div>;

    return (
        <section className="bg-white">
            <div className="px-4 mx-auto max-w-screen-xl lg:py-8 lg:px-6">
                {/* Header Section */}
                <div className="bg-green-100 p-4 sm:p-8 rounded-lg mb-8 text-center">
                    <h2 className="mb-4 text-2xl sm:text-3xl lg:text-4xl tracking-tight font-extrabold text-gray-900">Our Blogs</h2>
                    <p className="font-light text-gray-700 text-sm sm:text-lg">
                        Explore our collection of articles and insights on Ayurveda, where ancient wisdom meets modern wellness practices.
                    </p>
                </div>
                {/* Blogs Grid */}
                <div className="grid gap-6 sm:gap-8 lg:grid-cols-2">
                    {blogs.map((blog) => (
                        <article key={blog._id} className="p-4 sm:p-6 bg-gray-100 rounded-lg border border-gray-200 shadow-md">
                            <div className="flex justify-between items-center mb-3 sm:mb-5 text-gray-500">
                                <span className="bg-green-100 text-green-800 text-xs sm:text-sm font-medium inline-flex items-center px-2.5 py-0.5 rounded">
                                    {blog.topic}
                                </span>
                                <span className="text-xs sm:text-sm text-gray-600">{formatDate(blog.createdAt)}</span>
                            </div>
                            <h2 className="mb-2 text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
                                <Link to={`/blogs/${blog._id}`}>{blog.title}</Link>
                            </h2>
                            <p className="mb-3 sm:mb-5 font-light text-xs sm:text-sm md:text-base text-gray-600">
                                {truncateHtml(blog.description, 150)} {/* Truncate to 150 characters */}
                            </p>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-2 sm:space-x-4">
                                    <span className="text-xs sm:text-sm font-medium text-gray-700">
                                        {blog.likes} Like(s) | {blog.dislikes} Dislike(s) | {blog.comments.length} Comment(s)
                                    </span>
                                </div>
                                <Link to={`/blogs/${blog._id}`} className="inline-flex items-center font-medium text-green-600 hover:underline text-xs sm:text-sm">
                                    Read more
                                    <svg className="ml-1 sm:ml-2 w-3 sm:w-4 h-3 sm:h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                    </svg>
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>  
            </div>
        </section>
    );
};

export default BlogList;
