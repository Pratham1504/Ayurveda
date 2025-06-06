import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../Context/CartContext';
import { motion } from 'framer-motion';

const ProdDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const { cart, addToCart, updateQuantity } = useCart();
    const [rating, setRating] = useState({ name: '', email: '', review: '', rating: 0 });

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/api/products/${id}`);
                response.data.ratings = response.data.ratings || [];
                setProduct(response.data);
                fetchRelated(response.data.company);
            } catch (err) {
                console.error('Error fetching product:', err);
            }
        };

        const fetchRelated = async (company) => {
            try {
                const res = await axios.get(`http://localhost:4000/api/products?company=${company}`);
                setRelatedProducts(res.data.filter(p => p._id !== id));
            } catch (err) {
                console.error('Error fetching related products:', err);
            }
        };

        fetchProduct();
    }, [id]);

    const getProductQuantity = () => {
        const cartItem = cart.find(item => item._id === product?._id);
        return cartItem ? cartItem.quantity : 0;
    };

    const handleReviewChange = (e) => {
        setRating({ ...rating, [e.target.name]: e.target.value });
    };

    const submitReview = async () => {
        try {
            const newReview = { ...rating };
            const response = await axios.post(`http://localhost:4000/api/products/${id}/rating`, newReview);
            setProduct(response.data.product);
            setRating({ name: '', email: '', review: '', rating: 0 });
        } catch (err) {
            console.error('Error submitting review:', err);
        }
    };

    if (!product) return <p className="text-center mt-20 text-lg animate-pulse">Loading...</p>;

    const quantity = getProductQuantity();

    return (
        <div className="container mx-auto px-4 max-w-screen-xl py-10 font-sans text-black">
            <motion.div 
                initial={{ opacity: 0, y: 30 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.6 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white rounded-xl shadow-lg p-8"
            >
                <img src={product.image} alt={product.name} className="rounded-xl w-full h-[450px] object-contain border" />

                <div className="space-y-5">
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
                        <div className="flex items-center border rounded overflow-hidden w-max">
                            <button onClick={() => updateQuantity(product._id, -1)} className="bg-red-500 text-white px-4 py-2 hover:bg-red-600">-</button>
                            <span className="px-6 py-2 text-lg bg-gray-100">{quantity}</span>
                            <button onClick={() => updateQuantity(product._id, 1)} className="bg-green-500 text-white px-4 py-2 hover:bg-green-600">+</button>
                        </div>
                    ) : (
                        <button onClick={() => addToCart(product)} className="bg-sky-600 text-white px-6 py-3 rounded-md hover:bg-sky-700 transition">Add to Cart</button>
                    )}
                </div>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, x: 50 }} 
                whileInView={{ opacity: 1, x: 0 }} 
                transition={{ duration: 0.5 }}
                className="mt-10 bg-white p-6 rounded-xl shadow"
            >
                <h2 className="text-xl font-semibold mb-4">Customer Reviews</h2>
                {product.ratings.length > 0 ? product.ratings.map((rev, idx) => (
                    <motion.div 
                        key={idx} 
                        className="mb-4 bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition"
                        initial={{ opacity: 0, y: 10 }} 
                        whileInView={{ opacity: 1, y: 0 }} 
                        transition={{ duration: 0.3, delay: idx * 0.1 }}
                    >
                        <div className="flex justify-between items-center">
                            <p className="font-semibold text-gray-800">{rev.name}</p>
                            <span className="text-yellow-500">{'★'.repeat(rev.rating)}</span>
                        </div>
                        <p className="text-gray-600 text-sm mt-1">{rev.review}</p>
                    </motion.div>
                )) : <p className="text-gray-500">No reviews yet.</p>}
            </motion.div>

            <div 
                initial={{ opacity: 0 }} 
                whileInView={{ opacity: 1 }} 
                transition={{ delay: 0.3 }}
                className="mt-10 bg-white p-6 rounded-xl shadow"
            >
                <h2 className="text-xl font-semibold mb-4">Submit Your Review</h2>
                <form onSubmit={(e) => { e.preventDefault(); submitReview(); }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" name="name" placeholder="Name" value={rating.name} onChange={handleReviewChange} required className="border px-4 py-2 rounded-md focus:ring focus:ring-sky-400" />
                    <input type="email" name="email" placeholder="Email" value={rating.email} onChange={handleReviewChange} required className="border px-4 py-2 rounded-md focus:ring focus:ring-sky-400" />
                    <textarea name="review" placeholder="Your review" value={rating.review} onChange={handleReviewChange} required className="col-span-1 md:col-span-2 border px-4 py-2 rounded-md focus:ring focus:ring-sky-400" rows={4}></textarea>
                    <select name="rating" value={rating.rating} onChange={handleReviewChange} required className="border px-4 py-2 rounded-md focus:ring focus:ring-sky-400">
                        <option value={0}>Select Rating</option>
                        {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} Star</option>)}
                    </select>
                    <button type="submit" className="bg-sky-600 text-white px-4 py-2 rounded-md hover:bg-sky-700 transition">Post Review</button>
                </form>
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
