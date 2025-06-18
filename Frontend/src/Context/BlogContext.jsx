import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { server } from '../main';

const BlogContext = createContext();

export const useBlogs = () => useContext(BlogContext);

export const BlogProvider = ({ children }) => {
    const [blogs, setBlogs] = useState([]);
    const [blogLoading, setBlogLoading] = useState(true);
    const [blogError, setBlogError] = useState(null);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const res = await axios.get(`${server}/api/blogs`);
                setBlogs(res.data);
            } catch (err) {
                console.error("Error fetching blogs:", err);
                setBlogError(err);
            } finally {
                setBlogLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    return (
        <BlogContext.Provider value={{ blogs, blogLoading, blogError }}>
            {children}
        </BlogContext.Provider>
    );
};
