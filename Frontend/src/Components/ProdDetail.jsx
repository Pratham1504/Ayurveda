import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../Context/CartContext';
import { motion } from 'framer-motion';
import { UserData } from '../Context/UserContext';
import { Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { useProducts } from '../Context/ProductContext';

const ProdDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { products, productLoading, productError } = useProducts();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const { cart, addToCart, updateQuantity } = useCart();
    const [rating, setRating] = useState({ name: '', email: '', review: '', rating: 0 });
    const { user, modalIsOpen, setModalIsOpen } = UserData();
    const [hasRated, setHasRated] = useState(false);

    useEffect(() => {
        try {
            if (!productLoading && products.length > 0) {
                const foundProduct = products.find(p => p._id === id);
                if (foundProduct) {
                    setProduct(foundProduct);

                    // Set related products (same company, exclude current)
                    const related = products.filter(p => p._id !== id && p.company === foundProduct.company);
                    setRelatedProducts(related);

                    // Check if user has rated
                    if (user && foundProduct.ratings?.some(r => r.email === user.email)) {
                        setHasRated(true);
                    } else {
                        setHasRated(false);
                    }
                }
            }

        } catch (err) {
            console.error('Error fetching product:', err);
        }
    }, [products, id, user, productLoading]);

    const getProductQuantity = () => {
        const cartItem = cart.find(item => item._id === product?._id);
        return cartItem ? cartItem.quantity : 0;
    };

    const StarRating = ({ value, onChange }) => {
        const [hover, setHover] = useState(0);

        return (
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        type="button"
                        key={star}
                        onClick={() => onChange(star)}
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(0)}
                        className="text-yellow-400"
                    >
                        <Star
                            fill={(hover || value) >= star ? '#facc15' : 'none'}
                            stroke="#facc15"
                            className="w-6 h-6 transition-all"
                        />
                    </button>
                ))}
            </div>
        );
    };


    useEffect(() => {
        if (user && user._id) {
            setRating((prev) => ({
                ...prev,
                name: user.fullName || '',
                email: user.email || '',
            }));
        }
    }, [user]);

    const handleReviewChange = (e) => {
        setRating({ ...rating, [e.target.name]: e.target.value });
    };

    const submitReview = async () => {
        if (!rating.review || rating.rating === 0) {
            toast.error('Please provide both review and rating.');
            return;
        }
        try {
            const newReview = { ...rating };
            const response = await axios.post(`http://localhost:4000/api/products/${id}/rating`, newReview);
            setProduct(response.data.product);
            setRating({ name: '', email: '', review: '', rating: 0 });
            setHasRated(true);
            toast.success('Thanks For Your Valuable Review!');
        } catch (err) {
            console.error('Error submitting review:', err);
            toast.error('Something went wrong. Try again later.');
        }
    };

    if (productError) return <div className="text-red-500 text-center py-20">Error loading product: {productError.message}</div>;
    // if (!product) return <div className="text-center py-20 text-gray-500 text-xl">Product not found.</div>;

    if (!product || productLoading) return (
        <div className="bg-gradient-to-br from-white to-sky-50 container mx-auto px-4 max-w-screen-xl py-10 font-sans text-black">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white rounded-xl shadow-lg p-8 animate-pulse"
            >
                {/* Image Skeleton */}
                <div className="rounded-xl w-full h-[450px] bg-gray-200" />

                {/* Right Side Skeleton */}
                <div className="space-y-5">
                    {/* Title */}
                    <div className="h-8 bg-gray-200 rounded w-3/4" />

                    {/* Company */}
                    <div className="h-4 bg-gray-200 rounded w-1/2" />

                    {/* Price Row */}
                    <div className="flex items-center gap-4">
                        <div className="h-6 w-20 bg-gray-200 rounded" />
                        <div className="h-4 w-16 bg-gray-200 rounded" />
                        <div className="h-4 w-16 bg-gray-200 rounded" />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded w-full" />
                        <div className="h-3 bg-gray-200 rounded w-5/6" />
                        <div className="h-3 bg-gray-200 rounded w-4/6" />
                    </div>

                    {/* Size */}
                    <div className="h-4 bg-gray-200 rounded w-1/4" />

                    {/* Ingredients */}
                    <div>
                        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
                        <ul className="space-y-2">
                            <li className="h-3 bg-gray-200 rounded w-2/3" />
                            <li className="h-3 bg-gray-200 rounded w-1/2" />
                            <li className="h-3 bg-gray-200 rounded w-3/4" />
                        </ul>
                    </div>

                    {/* Button/Quantity Skeleton */}
                    <div className="h-10 w-3/4 bg-gray-300 rounded-md mt-4" />
                </div>
            </motion.div>
        </div>


    );

    const quantity = getProductQuantity();



    return (
        <div className="container mx-auto px-4 max-w-screen-xl py-10 font-sans text-black">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className=" bg-gradient-to-br from-white to-sky-50 grid grid-cols-1 md:grid-cols-2 gap-10 bg-white rounded-xl shadow-lg p-8"
            >
                <img src={product.image} alt={product.name} className="rounded-xl w-full h-[450px] object-contain border" />

                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
                    <p className="text-gray-600">by <span className="text-sky-700 font-semibold">{product.company}</span></p>

                    <div className="flex items-center gap-4">
                        <span className="text-black-600 text-3xl font-bold">₹{product.price}</span>
                        <span className="text-gray-400 line-through text-lg">₹{product.MRP}</span>
                        <span className="text-sky-500 text-lg font-semibold">{Math.round((product.MRP - product.price) / product.MRP * 100)}% off</span>
                    </div>

                    <p className="text-gray-700 text-sm">{product.description}</p>

                    <p className="text-gray-600"><strong>Size:</strong> {product.size}</p>

                    <div>
                        <h2 className="text-md font-semibold text-gray-800 mt-4 mb-2">Ingredients:</h2>
                        <ul className="list-disc pl-5 text-sm text-gray-700">
                            {product.ingredients?.length ? product.ingredients.map((ing, idx) => (
                                <li key={idx}>{ing}</li>
                            )) : <li>No ingredients listed.</li>}
                        </ul>
                    </div>
                    {quantity > 0 ? (
                        <div className="flex items-center justify-between mt-auto w-3/4 position">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    updateQuantity(product._id, -1);
                                }}
                                className="bg-sky-600 text-white px-3 py-2 rounded-l-md hover:bg-sky-700 text-sm"
                            >
                                -
                            </button>
                            <span className="px-3 py-2 text-lg ">{quantity}</span>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    updateQuantity(product._id, 1);
                                }}
                                className="bg-sky-600 text-white px-3 py-2 rounded-r-md hover:bg-sky-700 text-sm"
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
                            className="w-3/4 bg-sky-600 text-white px-3 py-2 rounded-md hover:bg-sky-700 transition mt-auto text-sm"
                        >
                            Add to Cart
                        </button>
                    )}
                </div>
            </motion.div>

            <div
                className="mt-10 bg-white p-6 rounded-xl shadow bg-gradient-to-br from-white to-sky-50"
            >
                <h2 className="text-xl font-semibold mb-4">Customer Reviews</h2>
                {product.ratings.length > 0 ? product.ratings.map((rev, idx) => (
                    <div
                        key={idx}
                        className="mb-4 bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition"
                    >
                        <div className="flex justify-between items-center">
                            <p className="font-semibold text-gray-800">{rev.name}</p>
                            <span className="text-yellow-500">{'★'.repeat(rev.rating)}</span>
                        </div>
                        <p className="text-gray-600 text-sm mt-1">{rev.review}</p>
                    </div>
                )) : <p className="text-gray-500">No reviews yet.</p>}
            </div>

            <div className="mt-10 bg-white p-6 rounded-xl shadow bg-gradient-to-br from-white to-sky-50">
                <h2 className="text-xl font-semibold mb-4">Submit Your Review</h2>

                {!user || Object.keys(user).length === 0 ? (
                    <p className="text-red-500 text-sm">
                        Please <span onClick={() => setModalIsOpen(true)} className="text-sky-600 underline cursor-pointer">log in</span> to submit a review.
                    </p>
                ) : hasRated ? (
                    <p className="text-gray-600 text-sm">✅ You have already submitted a review for this product.</p>
                ) : (
                    <form onSubmit={(e) => { e.preventDefault(); submitReview(); }} className="space-y-4">
                        <div>
                            <StarRating
                                value={rating.rating}
                                onChange={(newRating) => setRating((prev) => ({ ...prev, rating: newRating }))}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Your Review</label>
                            <textarea
                                name="review"
                                value={rating.review}
                                onChange={handleReviewChange}
                                required
                                placeholder="Write your thoughts..."
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 resize-none"
                                rows={4}
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className={`w-full py-2 rounded-lg font-semibold shadow-md transition
                            ${!rating.review || rating.rating === 0
                                    ? 'bg-gray-300 cursor-not-allowed text-gray-600'
                                    : 'bg-sky-600 hover:bg-sky-700 text-white'}
                                `}>
                            Submit Review
                        </button>
                    </form>

                )}
            </div>

            {relatedProducts.length > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mt-16"
                >
                    <h2 className="text-2xl font-bold mb-6">More from {product.company}</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {relatedProducts.map(item => (
                            <div key={item._id} className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md" onClick={() => navigate(`/products/${item._id}`)}>
                                <img src={item.image} alt={item.name} className="h-40 w-full object-cover rounded mb-2" />
                                <p className="font-medium text-sm truncate">{item.name}</p>
                                <p className="text-xs text-gray-500">₹{item.price}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default ProdDetail;
