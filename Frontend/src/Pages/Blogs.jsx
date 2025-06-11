import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const BlogList = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/blogs');
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

    const truncateHtml = (html, maxLength) => {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = html;
        const textContent = tempDiv.textContent || tempDiv.innerText || "";
        return textContent.length > maxLength
            ? textContent.substring(0, maxLength) + '...'
            : textContent;
    };

    const highlightText = (text, keyword) => {
        if (!keyword) return text;
        const regex = new RegExp(`(${keyword})`, 'gi');
        const parts = text.split(regex);
        return parts.map((part, i) =>
            regex.test(part) ? <mark key={i} className="bg-yellow-200">{part}</mark> : part
        );
    };

    const filteredBlogs = blogs.filter(blog => {
        const content = `${blog.topic} ${blog.title} ${blog.description}`.toLowerCase();
        return content.includes(searchTerm.toLowerCase());
    });

    const SkeletonCard = () => (
        <div className="p-4 sm:p-6 bg-white rounded-lg border border-gray-200 shadow animate-pulse">
            <div className="flex justify-between items-center mb-4">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
            <div className="h-6 bg-gray-300 rounded w-3/4 mb-3"></div>
            <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
            <div className="flex justify-between items-center mt-4">
                <div className="h-4 bg-gray-200 rounded w-36"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
        </div>
    );


    if (error) return <div className="text-red-500 font-sans">Error fetching blogs: {error.message}</div>;

    return (
        <section className="bg-white font-sans text-gray-800">
            <div className="px-4 mx-auto max-w-screen-xl lg:py-8 lg:px-6">
                <div className="bg-sky-50 p-4 sm:p-8 rounded-lg mb-8 text-center">
                    <h2 className="mb-4 text-2xl sm:text-3xl lg:text-4xl tracking-tight font-extrabold text-gray-900">Our Blogs</h2>
                    <p className="font-light text-gray-800 text-sm sm:text-lg">
                        Explore our collection of articles and insights on Ayurveda, where ancient wisdom meets modern wellness practices.
                    </p>
                    <input
                        type="text"
                        placeholder="Search blogs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="mt-4 px-4 py-2 border border-gray-300 rounded-lg w-full max-w-md text-sm text-gray-500"
                    />
                </div>

                {loading ? (
                    <section className="bg-white font-sans text-gray-800">
                <div className="px-4 mx-auto max-w-screen-xl py-8">
                    <div className="grid gap-6 sm:gap-8 lg:grid-cols-2">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <SkeletonCard key={index} />
                        ))}
                    </div>
                </div>
            </section>
                ) : (
                <div className="grid gap-6 sm:gap-8 lg:grid-cols-2">
                    {filteredBlogs.map((blog) => (
                        <article key={blog._id} className="p-4 sm:p-6 bg-white rounded-lg border border-gray-200 shadow hover:shadow-md transition">
                            <div className="flex justify-between items-center mb-3 sm:mb-5 text-gray-500">
                                <span className="bg-sky-100 text-sky-800 text-xs sm:text-sm font-medium inline-flex items-center px-2.5 py-0.5 rounded">
                                    {highlightText(blog.topic, searchTerm)}
                                </span>
                                <span className="text-xs sm:text-sm text-gray-600">{formatDate(blog.createdAt)}</span>
                            </div>
                            <h2 className="mb-2 text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
                                <Link to={`/blogs/${blog._id}`}>{highlightText(blog.title, searchTerm)}</Link>
                            </h2>
                            <p className="mb-3 sm:mb-5 font-light text-sm sm:text-base text-gray-700">
                                {highlightText(truncateHtml(blog.description, 150), searchTerm)}
                            </p>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-2 sm:space-x-4">
                                    <span className="text-xs sm:text-sm font-medium text-gray-700">
                                        {blog.likes} Like(s) | {blog.dislikes} Dislike(s) | {blog.comments.length} Comment(s)
                                    </span>
                                </div>
                                <Link to={`/blogs/${blog._id}`} className="inline-flex items-center font-medium text-sky-600 hover:underline text-xs sm:text-sm">
                                    Read more
                                    <svg className="ml-1 sm:ml-2 w-3 sm:w-4 h-3 sm:h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                    </svg>
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
                )}
            </div>
        </section>
    );
};

export default BlogList;
