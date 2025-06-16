import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCart } from '../Context/CartContext';
import { useNavigate } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import { useProducts } from '../Context/ProductContext';

const Products = () => {
    const { products, productLoading } = useProducts();
    const [searchTerm, setSearchTerm] = useState('');
    const [companyFilter, setCompanyFilter] = useState('');
    const [ratingFilter, setRatingFilter] = useState(0);
    const [priceRange, setPriceRange] = useState([0, 10000]);
    const [showFilters, setShowFilters] = useState(false);
    const { cart, addToCart, updateQuantity } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const companies = [...new Set(products.map(p => p.company))];

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCompany = !companyFilter || product.company === companyFilter;
        const matchesRating = (product.ratings.reduce((acc, r) => acc + r.rating, 0) / (product.ratings.length || 1)) >= ratingFilter;
        const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
        return matchesSearch && matchesCompany && matchesRating && matchesPrice;
    });

    const getProductQuantity = (_productId) => {
        const cartItem = cart.find(item => item._id === _productId);
        return cartItem ? cartItem.quantity : 0;
    };

    const calculateDiscount = (price, MRP) => {
        const discount = ((MRP - price) / MRP) * 100;
        return discount.toFixed(0);
    };

    const ProductSkeletonCard = () => (
        <div className="bg-white rounded-2xl border border-sky-100 p-5 animate-pulse">
            <div className="bg-gray-200 h-40 w-full rounded mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="flex justify-between items-center mb-2">
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-300 rounded w-1/4"></div>
            </div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-300 rounded w-full"></div>
        </div>
    );

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="font-sans container px-4 mx-auto max-w-screen-xl lg:py-10 lg:px-6 text-black lg:max-w-3/4 lg:mx-auto">
            <h1 className="text-4xl font-semibold text-center mb-10 text-black">Browse Our Products</h1>

            <div className="flex items-center mb-6 gap-4">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border border-sky-300 rounded-md px-4 py-2 w-3/4 focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="w-1/4 flex justify-center items-center gap-2 border border-sky-300 px-3 py-2 rounded-md text-sky-700 hover:bg-sky-50"
                >
                    <SlidersHorizontal size={16} /> Filters
                </button>
            </div>

            {showFilters && (
                <div className="mb-10 p-4 bg-white rounded-lg shadow-sm border border-sky-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-2">
                        <span className="text-sm text-gray-700 font-medium">Company</span>
                        <select
                            value={companyFilter}
                            onChange={(e) => setCompanyFilter(e.target.value)}
                            className="border border-sky-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-sky-400"
                        >
                            <option value="">All Companies</option>
                            {companies.map(company => <option key={company} value={company}>{company}</option>)}
                        </select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="text-sm text-gray-700 font-medium">Ratings</span>
                        <select
                            value={ratingFilter}
                            onChange={(e) => setRatingFilter(parseFloat(e.target.value))}
                            className="border border-sky-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-sky-400"
                        >
                            <option value={0}>All Ratings</option>
                            <option value={4}>4 Stars & up</option>
                            <option value={3}>3 Stars & up</option>
                            <option value={2}>2 Stars & up</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <span className="text-sm text-gray-700 font-medium">Price Range (₹)</span>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                min="0"
                                max="10000"
                                value={priceRange[0]}
                                onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
                                className="border border-sky-300 rounded-md p-2 w-full focus:outline-none"
                                placeholder="Min ₹"
                            />
                            <input
                                type="number"
                                min="0"
                                max="10000"
                                value={priceRange[1]}
                                onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
                                className="border border-sky-300 rounded-md p-2 w-full focus:outline-none"
                                placeholder="Max ₹"
                            />
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                {productLoading
                    ? Array.from({ length: 8 }).map((_, index) => <ProductSkeletonCard key={index} />)
                    : filteredProducts.map(product => {
                        const quantity = getProductQuantity(product._id);
                        const discount = calculateDiscount(product.price, product.MRP);

                        return (
                            <div
                                key={product._id}
                                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 p-6 flex flex-col cursor-pointer border border-sky-100 relative group"
                                onClick={() => navigate(`/products/${product._id}`)}
                            >
                                {discount > 0 && (
                                    <span className="absolute top-4 left-4 bg-gradient-to-r from-sky-400 to-sky-200 text-white text-xs font-bold px-3 py-1 rounded-full shadow z-20">
                                        {discount}% OFF
                                    </span>
                                )}

                                <div className="flex justify-center items-center mb-4 h-44 relative">
                                    <img
                                        src={product.image || "/placeholder.png"}
                                        alt={product.name}
                                        className="w-full h-44 object-contain rounded-xl bg-[#f5faff] group-hover:scale-105 transition-transform duration-300 z-10"
                                    />
                                </div>

                                <h3 className="font-semibold text-lg text-[#1a365d] mb-1 truncate">{product.name}</h3>
                                <p className="text-sky-600 text-sm mb-2">{product.company}</p>

                                <div className="flex items-center justify-between text-base mb-2">
                                    <span className="text-gray-400 line-through">{product.MRP ? `₹${product.MRP}` : ""}</span>
                                    <span className="text-xl font-bold text-[#1a365d]">₹{product.price}</span>
                                </div>

                                <div className="flex items-center gap-2 mb-4">
                                    <span className="bg-sky-100 text-sky-700 px-2 py-0.5 rounded text-xs font-semibold flex items-center">
                                        ★ {(product.ratings.length > 0
                                            ? (product.ratings.reduce((acc, r) => acc + r.rating, 0) / product.ratings.length).toFixed(1)
                                            : 'No Ratings')}
                                    </span>
                                    <span className="text-gray-400 text-xs">({product.ratings.length})</span>
                                </div>

                                {quantity > 0 ? (
                                    <div className="flex items-center justify-between mt-auto">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                updateQuantity(product._id, -1);
                                            }}
                                            className="bg-gradient-to-r from-sky-600 to-sky-400 hover:from-sky-700 hover:to-sky-500 text-white px-3 py-1 rounded-l-md text-sm transition"
                                        >
                                            -
                                        </button>
                                        <span className="px-3 py-1 text-lg">{quantity}</span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                updateQuantity(product._id, 1);
                                            }}
                                            className="bg-gradient-to-r from-sky-600 to-sky-400 hover:from-sky-700 hover:to-sky-500 text-white px-3 py-1 rounded-r-md text-sm transition"
                                        >
                                            +
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            addToCart(product);
                                        }}
                                        className="mt-auto bg-gradient-to-r from-sky-600 to-sky-400 hover:from-sky-700 hover:to-sky-500 text-white font-semibold py-2 rounded-lg shadow transition w-full"
                                    >
                                        Add to Cart
                                    </button>
                                )}
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};

export default Products;