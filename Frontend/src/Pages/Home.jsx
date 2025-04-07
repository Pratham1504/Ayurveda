import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import improveImmunityImg from "../Images/Improves-immunity.webp";
import naturalHealingImg from "../Images/Natural-healing.webp";
import balanceBodyMindImg from "../Images/Balance-body-mind.webp";

const Home = () => {
    const [products, setProducts] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/products');
                setProducts(response.data);
            } catch (err) {
                console.error("Error fetching products:", err);
                setError(err);
            }
        };

        const fetchBlogs = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/blogs');
                setBlogs(response.data);
            } catch (err) {
                console.error("Error fetching blogs:", err);
                setError(err);
            }
        };

        const fetchData = async () => {
            await Promise.all([fetchProducts(), fetchBlogs()]);
            setLoading(false);
        };

        fetchData();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % blogs.length);
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(interval); // Cleanup interval on unmount
    }, [blogs]);

    const handleNextSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % blogs.length);
    };

    const handlePrevSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide - 1 + blogs.length) % blogs.length);
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

    // Function to calculate discount percentage
    const calculateDiscount = (price, MRP) => {
        if (!MRP || price >= MRP) return 0; // Return 0 if no MRP or price is equal to or greater than MRP
        const discount = ((MRP - price) / MRP) * 100;
        return discount.toFixed(0); // Returns discount as a percentage
    };

    if (loading) return <div className="text-center">Loading...</div>;
    if (error) return <div className="text-red-500">Error fetching data: {error.message}</div>;

    return (
        <div className="scrollable-home">
            {/* Benefits of Ayurveda Section */}
            <section className="py-4 ">
                <div className="bg-green-100 px-4 mx-auto max-w-screen-xl lg:py-8 lg:px-6">
                    <h2 className="text-3xl font-bold text-green-600 mb-6">| Benefits of Ayurveda</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="benefit-card">
                            <img
                                src={naturalHealingImg}
                                alt="Natural Healing"
                                className="mx-auto mb-4 rounded-md shadow-md"
                            />
                            <h3 className="text-xl font-semibold text-gray-700">Natural Healing</h3>
                            <p className="text-gray-600">Ayurveda focuses on holistic, natural treatments using herbs and oils.</p>
                        </div>
                        <div className="benefit-card">
                            <img
                                src={improveImmunityImg}
                                alt="Improves Immunity"
                                className="mx-auto mb-4 rounded-md shadow-md"
                            />
                            <h3 className="text-xl font-semibold text-gray-700">Improves Immunity</h3>
                            <p className="text-gray-600">It strengthens the body's immune system to fight off diseases.</p>
                        </div>
                        <div className="benefit-card">
                            <img
                                src={balanceBodyMindImg}
                                alt="Balance Body and Mind"
                                className="mx-auto mb-4 rounded-md shadow-md"
                            />
                            <h3 className="text-xl font-semibold text-gray-700">Balances Body and Mind</h3>
                            <p className="text-gray-600">Ayurveda helps in maintaining a balanced body, mind, and spirit.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Blog Topics Section */}
            <section className="py-4">
                <div className="bg-gray-100 px-4 mx-auto max-w-screen-xl lg:py-8 lg:px-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-bold text-green-600">| Blogs</h2>
                        <Link to="/blogs" className="text-lg text-green-500 hover:text-green-700">Show All</Link>
                    </div>

                    {/* Blog Slider with Left and Right Navigation */}
                    {blogs.length > 0 && (
                        <div className="relative flex items-center justify-center">
                            {/* Left Navigation Button */}
                            <button
                                onClick={handlePrevSlide}
                                className="absolute left-0 bg-green-500 text-white px-3 py-1 rounded-full hover:bg-green-600 z-10"
                            >
                                &lt;
                            </button>

                            {/* Blog Content Box */}
                            <Link
                                to={`/blogs/${blogs[currentSlide]._id}`}
                                className="bg-white p-6 rounded-lg shadow-lg max-w-screen-lg w-full lg:w-1/2 md:w-4/5 mx-auto transition-transform duration-500"
                                style={{ height: '450px' }} // Increase height to fit content
                            >
                                {/* Blog content */}
                                <div className="flex justify-between items-center mb-4">
                                    {/* Blog Title */}
                                    <h3 className="font-bold text-gray-700">
                                        {blogs[currentSlide].title}
                                    </h3>
                                    {/* Created Date */}
                                    <p className="text-sm text-gray-500">
                                        {new Date(blogs[currentSlide].createdAt).toLocaleDateString()}
                                    </p>
                                </div>

                                {/* Blog Topic */}
                                <div className="flex items-center mb-4 text-sm text-green-500">
                                    {blogs[currentSlide].topic}
                                </div>

                                {/* Blog Description */}
                                <div className="bg-gray-200 p-4 rounded-md mb-4" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                    <p className="text-sm text-gray-600">
                                        {truncateHtml(blogs[currentSlide].description, 500)} {/* Truncate to 500 characters */}
                                    </p>
                                </div>

                                {/* Like and Dislike counts (fixed at the bottom) */}
                                <div className="flex justify-between items-center border-t pt-4 mt-4">
                                    <div className="flex items-center text-sm text-gray-600">
                                        {blogs[currentSlide].likes} like(s) | {blogs[currentSlide].dislikes} dislike(s) | {blogs[currentSlide].comments.length} Comment(s)
                                    </div>
                                </div>
                            </Link>

                            {/* Right Navigation Button */}
                            <button
                                onClick={handleNextSlide}
                                className="absolute right-0 bg-green-500 text-white px-3 py-1 rounded-full hover:bg-green-600 z-10"
                            >
                                &gt;
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* Product Previews Section */}
            <section className="py-4">
                <div className="px-4 mx-auto max-w-screen-xl lg:py-8 lg:px-6">
                    <h2 className="text-3xl font-bold text-green-600 mb-6">| Our Products</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {products.slice(0, 8).map((product) => {
                            const discount = calculateDiscount(product.price, product.MRP);

                            return (
                                <Link
                                    key={product._id}
                                    to={`/products/${product._id}`}
                                    className="product-card p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow relative block"
                                >
                                    {/* Discount Badge */}
                                    {discount > 0 && (
                                        <span className="absolute top-2 left-2 bg-blue-500 text-white text-sm px-2 py-1 rounded">
                                            {discount}% off
                                        </span>
                                    )}
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-48 object-cover mb-4 rounded-md"
                                    />
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="text-lg font-semibold text-gray-700">{product.name}</h3>
                                        <p className="text-lg font-bold text-black">₹{product.price}</p>
                                    </div>
                                    <p className="text-sm text-gray-500">{truncateHtml(product.description, 100)}</p>
                                </Link>
                            );
                        })}
                    </div>
                    <div className="text-center mt-8">
                        <Link to="/products" className="bg-green-500 text-white px-6 py-2 rounded-md shadow-md hover:bg-green-600">
                            Show More Products
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
