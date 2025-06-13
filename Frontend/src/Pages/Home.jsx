import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useProducts } from '../Context/ProductContext';
import { useBlogs } from "../Context/BlogContext";
import HeroSection from "./Home/HeroSection";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/products");
        setProducts(response.data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err);
      }
    };

    const fetchBlogs = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/blogs");
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
    }, 5000);
    return () => clearInterval(interval);
  }, [blogs]);

  const handleNextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % blogs.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide(
      (prevSlide) => (prevSlide - 1 + blogs.length) % blogs.length
    );
  };

  const truncateHtml = (html, maxLength) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const textContent = tempDiv.textContent || tempDiv.innerText || "";
    return textContent.length > maxLength
      ? textContent.substring(0, maxLength) + "..."
      : textContent;
  };

  const calculateDiscount = (price, MRP) => {
    if (!MRP || price >= MRP) return 0;
    const discount = ((MRP - price) / MRP) * 100;
    return discount.toFixed(0);
  };

  if (loading)
    return (
      <div className="text-center py-20 text-gray-500 text-xl">Loading...</div>
    );
  if (error)
    return (
      <div className="text-red-500 text-center py-20">
        Error fetching data: {error.message}
      </div>
    );

  return (
    <div className="font-sans text-[#333] bg-white ">
      <HeroSection />

      <section className="py-20 bg-[#f5faff] border-b">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-14 text-[#1a365d]">
            Why Choose Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                icon: (
                  <svg
                    className="w-12 h-12 mx-auto mb-4 text-sky-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="#e0f2fe"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 12l2 2 4-4"
                      stroke="#38bdf8"
                      strokeWidth="2"
                    />
                  </svg>
                ),
                title: "Pure & Natural",
                desc: "Products crafted with ingredients rooted in Ayurveda for authentic healing.",
              },
              {
                icon: (
                  <svg
                    className="w-12 h-12 mx-auto mb-4 text-sky-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                  >
                    <rect
                      x="4"
                      y="4"
                      width="16"
                      height="16"
                      rx="4"
                      fill="#e0f2fe"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 12l2 2 4-4"
                      stroke="#38bdf8"
                      strokeWidth="2"
                    />
                  </svg>
                ),
                title: "Doctor-Approved",
                desc: "Every product is reviewed and validated by Ayurvedic professionals.",
              },
              {
                icon: (
                  <svg
                    className="w-12 h-12 mx-auto mb-4 text-sky-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                  >
                    <rect
                      x="2"
                      y="7"
                      width="20"
                      height="13"
                      rx="4"
                      fill="#e0f2fe"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7 10l5 5 5-5"
                      stroke="#38bdf8"
                      strokeWidth="2"
                    />
                  </svg>
                ),
                title: "Delivered with Care",
                desc: "Eco-friendly packaging and fast delivery to your doorstep.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-100 p-8 rounded-2xl text-center shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group"
              >
                <div className="flex justify-center items-center mb-4">
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold text-[#1a365d] mb-2 group-hover:text-sky-600 transition">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-base">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a365d]">
              Latest Blogs
            </h2>
            <Link
              to="/blogs"
              className="text-sky-600 hover:underline text-base font-semibold"
            >
              View All
            </Link>
          </div>
          {blogs.length > 0 && (
            <div className="relative overflow-visible">
              {/* Slider Controls */}
              <button
                onClick={handlePrevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-white border border-gray-200 hover:bg-sky-100 text-sky-600 p-3 rounded-full shadow z-10 transition"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <div className="mx-12">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 flex flex-col gap-2 transition-all duration-300">
                  <Link to={`/blogs/${blogs[currentSlide]._id}`}>
                    <h3 className="text-2xl font-bold text-[#1a365d] mb-2 hover:text-sky-600 transition">
                      {blogs[currentSlide].title}
                    </h3>
                    <span className="inline-block bg-sky-100 text-sky-700 text-xs font-semibold px-3 py-1 rounded mb-2">
                      {blogs[currentSlide].topic}
                    </span>
                    <p className="text-xs text-gray-400 mb-3">
                      {new Date(
                        blogs[currentSlide].createdAt
                      ).toLocaleDateString()}
                    </p>
                    <p className="text-gray-600 mb-4 text-base leading-relaxed line-clamp-4">
                      {truncateHtml(blogs[currentSlide].description, 300)}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>👍 {blogs[currentSlide].likes}</span>
                      <span>👎 {blogs[currentSlide].dislikes}</span>
                      <span>
                        💬 {blogs[currentSlide].comments.length} Comments
                      </span>
                    </div>
                  </Link>
                </div>
              </div>

              <button
                onClick={handleNextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-white border border-gray-200 hover:bg-sky-100 text-sky-600 p-3 rounded-full shadow z-10 transition"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          )}
          {blogs.length === 0 && (
            <div className="text-center text-gray-400 py-12">
              No blogs available.
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

                  <div className="flex justify-center items-center mb-4 h-44">
                    <img
                      src={product.image || "/placeholder.png"}
                      alt={product.name}
                      className="w-full h-44 object-contain rounded-xl bg-[#f5faff] group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <h3 className="font-semibold text-lg text-[#1a365d] mb-1 truncate">
                    {product.name}
                  </h3>
                  <p className="text-sky-600 text-sm mb-2">{product.company}</p>

                  <div className="flex items-center justify-between text-base mb-2">
                    <span className="text-gray-400 line-through">
                      {product.MRP ? `₹${product.MRP}` : ""}
                    </span>
                    <span className="text-xl font-bold text-[#1a365d]">
                      ₹{product.price}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-sky-100 text-sky-700 px-2 py-0.5 rounded text-xs font-semibold flex items-center">
                      ★{" "}
                      {product.ratings.length > 0
                        ? (
                            product.ratings.reduce(
                              (acc, r) => acc + r.rating,
                              0
                            ) / product.ratings.length
                          ).toFixed(1)
                        : "No Ratings"}
                    </span>
                    <span className="text-gray-400 text-xs">
                      ({product.ratings.length})
                    </span>
                  </div>

                  <button
                    className="mt-auto bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 rounded-lg shadow transition w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/products/${product._id}`);
                    }}
                  >
                    View Details
                  </button>
                </div>
              );
            })}
          </div>
          <div className="flex justify-center mt-10">
            <Link
              to="/products"
              className="bg-sky-600 hover:bg-sky-700 text-white font-semibold px-8 py-3 rounded-lg shadow transition text-lg"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
