import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../Context/ProductContext';
import { useBlogs } from '../Context/BlogContext';

const Home = () => {
    const { products, productLoading, productError } = useProducts();
    const { blogs, blogLoading, blogError } = useBlogs();
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % blogs.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [blogs]);

    const handleNextSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % blogs.length);
    };

    const handlePrevSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide - 1 + blogs.length) % blogs.length);
    };

    const truncateHtml = (html, maxLength) => {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = html;
        const textContent = tempDiv.textContent || tempDiv.innerText || "";
        return textContent.length > maxLength 
            ? textContent.substring(0, maxLength) + '...' 
            : textContent;
    };

    const calculateDiscount = (price, MRP) => {
        if (!MRP || price >= MRP) return 0;
        const discount = ((MRP - price) / MRP) * 100;
        return discount.toFixed(0);
    };

    if (productLoading || blogLoading)
        return <div className="text-center py-20 text-gray-500 text-xl">Loading...</div>;
    if (productError || blogError)
        return <div className="text-red-500 text-center py-20">Error fetching data</div>;

    return (
        <div className="font-sans text-[#333] bg-white">
            <section className="py-16 border-b">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-3xl md:text-4xl font-semibold text-center mb-12">Why Choose Us?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                title: "Pure & Natural",
                                desc: "Products crafted with ingredients rooted in Ayurveda for authentic healing."
                            },
                            {
                                title: "Doctor-Approved",
                                desc: "Every product is reviewed and validated by Ayurvedic professionals."
                            },
                            {
                                title: "Delivered with Care",
                                desc: "Eco-friendly packaging and fast delivery to your doorstep."
                            },
                        ].map((item, idx) => (
                            <div key={idx} className="bg-[#f9fafb] border border-gray-200 p-6 rounded-xl text-center shadow-sm hover:shadow-md transition">
                                <h3 className="text-lg font-medium text-[#1a1a1a] mb-2">{item.title}</h3>
                                <p className="text-gray-500 text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl md:text-4xl font-semibold">Latest Blogs</h2>
                        <Link to="/blogs" className="text-blue-600 hover:underline text-base">View All</Link>
                    </div>
                    {blogs.length > 0 && (
                        <div className="relative overflow-hidden rounded-xl border border-gray-200">
                            <button
                                onClick={handlePrevSlide}
                                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 text-gray-600 p-2 rounded-full z-10"
                            >
                                &lt;
                            </button>

                            <div className="p-9 bg-white ml-3">
                                <Link to={`/blogs/${blogs[currentSlide]._id}`}>
                                    <h3 className="text-xl font-semibold  text-[#111827]">{blogs[currentSlide].title}</h3>
                                    <span className="bg-sky-100 text-sky-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded mb-1">
              {blogs[currentSlide].topic}
            </span>
                                    <p className="text-xs text-gray-400 mb-3">{new Date(blogs[currentSlide].createdAt).toLocaleDateString()}</p>
                                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">{truncateHtml(blogs[currentSlide].description, 500)}</p>
                                    <div className="text-xs text-gray-500">
                                        {blogs[currentSlide].likes} Likes | {blogs[currentSlide].dislikes} Dislikes | {blogs[currentSlide].comments.length} Comments
                                    </div>
                                </Link>
                            </div>

                            <button
                                onClick={handleNextSlide}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 text-gray-600 p-2 rounded-full z-10"
                            >
                                &gt;
                            </button>
                        </div>
                    )}
                </div>
            </section>

            <section className="py-16 bg-[#f9f9f9]">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-3xl md:text-4xl font-semibold mb-10">Featured Products</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {products?.slice(0, 8).map((product) => {
                            const discount = calculateDiscount(product.price, product.MRP);
                            return (
                                <div
                            key={product._id}
                            className="bg-white rounded-xl shadow hover:shadow-lg transition duration-300 transform hover:-translate-y-1 p-5 flex flex-col cursor-pointer border border-sky-100 relative"
                            onClick={() => navigate(`/products/${product._id}`)}
                        >
                            {discount > 0 && (
                                <span className="absolute top-2 left-2 bg-sky-200 text-black text-xs px-2 py-1 rounded">
                                    {discount}% OFF
                                </span>
                            )}

                            <img src={product.image} alt={product.name} className="mb-3 w-full h-40 object-cover rounded" />

                            <h2 className="font-sans text-base font-medium text-black mb-1 truncate">{product.name}</h2>
                            <p className="text-sky-600 text-sm mb-1">{product.company}</p>

                            <div className="flex items-center justify-between text-sm text-black mt-1 mb-2">
                                <p className="text text-gray-600 line-through">₹{product.MRP}</p>
                                <p className='text-xl'>₹{product.price}</p>
                            </div>

                            <div className="flex items-center text-sm text-black mb-2">
                                <span className="mr-1">★</span>
                                <span>{(product.ratings.length > 0 ? (product.ratings.reduce((acc, r) => acc + r.rating, 0) / product.ratings.length).toFixed(1) : 'No Ratings')}</span>
                                <span className="text-black-300 ml-1">({product.ratings.length})</span>
                            </div>

                            
                        </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
