import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useCart } from '../Context/CartContext';

const ProdDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const { cart, addToCart, updateQuantity } = useCart();
    const [rating, setRating] = useState({
        name: '',
        email: '',
        review: '',
        rating: 0
    });

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/api/products/${id}`);
                response.data.ratings = response.data.ratings || [];
                setProduct(response.data);
            } catch (err) {
                console.error('Error fetching product details:', err);
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
            const newReview = {
                name: rating.name,
                email: rating.email,
                review: rating.review,
                rating: rating.rating
            };
            const response = await axios.post(`http://localhost:4000/api/products/${id}/rating`, newReview);
            setProduct(response.data.product);
            setRating({
                name: '',
                email: '',
                review: '',
                rating: 0
            });
        } catch (err) {
            console.error('Error submitting review:', err);
        }
    };

    if (!product) return <p className="text-center mt-20 text-lg">Loading...</p>;

    const quantity = getProductQuantity();

    return (
        <div className="container mx-auto max-w-screen-xl px-4 py-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white shadow-xl rounded-2xl p-6">
                <img src={product.image} alt={product.name} className="w-full h-96 object-contain rounded-xl border" />

                <div className="space-y-4">
                    <h1 className="text-4xl font-bold text-gray-800">{product.name}</h1>
                    <p className="text-gray-500 text-lg">by <span className="text-blue-600">{product.company}</span></p>

                    <div className="flex items-center gap-3">
                        <span className="text-green-600 text-3xl font-bold">₹{product.price}</span>
                        <span className="text-gray-400 line-through text-lg">₹{product.MRP}</span>
                        <span className="text-green-500 font-semibold text-lg">
                            {Math.round((product.MRP - product.price) / product.MRP * 100)}% off
                        </span>
                    </div>

                    <div className="flex items-center gap-2 text-yellow-500">
                        <span className="text-xl">&#9733;</span>
                        <span className="text-gray-700 text-base">{product.ratings.length} Ratings</span>
                    </div>

                    <div className="text-base text-gray-600">
                        <span className="font-semibold">Size: </span>{product.size}
                    </div>

                    <div className="mt-6">
                        {quantity > 0 ? (
                            <div className="flex items-center shadow rounded-lg overflow-hidden border">
                                <button onClick={() => updateQuantity(product._id, -1)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2">-</button>
                                <span className="px-6 py-2 text-lg font-medium bg-gray-100">{quantity}</span>
                                <button onClick={() => updateQuantity(product._id, 1)} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2">+</button>
                            </div>
                        ) : (
                            <button onClick={() => addToCart(product)} className="bg-green-600 hover:bg-green-700 text-white w-full py-3 rounded-lg text-lg font-semibold">
                                Add to Cart
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-10 bg-white p-6 rounded-2xl shadow space-y-6">
                <div>
                    <h2 className="text-2xl font-bold mb-2">Details</h2>
                    <p className="text-gray-700">{product.description}</p>
                </div>

                <div>
                    <h3 className="text-xl font-bold mb-2">Ingredients</h3>
                    <ul className="list-disc pl-6 text-gray-700">
                        {product.ingredients?.length > 0 ? (
                            product.ingredients.map((ingredient, index) => (
                                <li key={index}>{ingredient}</li>
                            ))
                        ) : (
                            <li>No ingredients listed.</li>
                        )}
                    </ul>
                </div>
            </div>

            <div className="mt-10 bg-white p-6 rounded-2xl shadow">
                <h3 className="text-2xl font-bold mb-4">Ratings & Reviews</h3>
                {product.ratings.length > 0 ? (
                    <div className="space-y-6">
                        {product.ratings.map((rev, index) => (
                            <div key={index} className="border-b pb-4">
                                <div className="flex justify-between items-center">
                                    <p className="font-semibold text-lg">{rev.name}</p>
                                    <span className="text-yellow-500 text-lg">{'★'.repeat(rev.rating)}</span>
                                </div>
                                <p className="text-gray-600 mt-1">{rev.review}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No reviews available.</p>
                )}
            </div>

            <div className="mt-10 bg-white p-6 rounded-2xl shadow">
                <h3 className="text-xl font-bold mb-4">Submit Your Review</h3>
                <form className="space-y-4" onSubmit={(e) => {
                    e.preventDefault();
                    submitReview();
                }}>
                    <div>
                        <label className="block mb-1 font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={rating.name}
                            onChange={handleReviewChange}
                            className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring focus:border-blue-400"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={rating.email}
                            onChange={handleReviewChange}
                            className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring focus:border-blue-400"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium text-gray-700">Review</label>
                        <textarea
                            name="review"
                            value={rating.review}
                            onChange={handleReviewChange}
                            className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring focus:border-blue-400"
                            rows={4}
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium text-gray-700">Rating</label>
                        <select
                            name="rating"
                            value={rating.rating}
                            onChange={handleReviewChange}
                            className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring focus:border-blue-400"
                            required
                        >
                            <option value={0}>Select Rating</option>
                            {[...Array(5).keys()].map(n => (
                                <option key={n + 1} value={n + 1}>{n + 1} Star</option>
                            ))}
                        </select>
                    </div>

                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium">
                        Post Review
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProdDetail;
