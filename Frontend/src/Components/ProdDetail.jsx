import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useCart } from '../context/CartContextProv';

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

    if (!product) return <p>Loading...</p>;

    const quantity = getProductQuantity();

    return (
        <div className="container px-4 mx-auto max-w-screen-xl lg:py-8 lg:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <img src={product.image} alt={product.name} className="rounded-lg object-cover w-full h-80" />
                <div className="space-y-4">
                    <h1 className="text-3xl font-bold">{product.name}</h1>
                    <p className="text-gray-500">by {product.company}</p>
                    <div className="flex items-center">
                        <span className="text-green-600 text-2xl font-bold">₹{product.price}</span>
                        <span className="text-gray-500 line-through ml-2">₹{product.MRP}</span>
                        <span className="text-green-500 ml-4">
                            {Math.round((product.MRP - product.price) / product.MRP * 100)}% off
                        </span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="text-yellow-500">&#9733;</span>
                        <span>{product.ratings.length} Ratings</span>
                    </div>
                    <div>
                        <span className="text-gray-600">Size: </span>
                        <span className="text-green-500 font-semibold">{product.size}</span>
                    </div>
                    <div className="flex items-center mt-4">
                        {quantity > 0 ? (
                            <div className="flex items-center">
                                <button onClick={() => updateQuantity(product._id, -1)} className="bg-green-500 text-white px-4 py-2 rounded-l-md">-</button>
                                <span className="px-4 py-2">{quantity}</span>
                                <button onClick={() => updateQuantity(product._id, 1)} className="bg-green-500 text-white px-4 py-2 rounded-r-md">+</button>
                            </div>
                        ) : (
                            <button onClick={() => addToCart(product)} className="bg-green-500 text-white w-48 py-2 rounded-md">Add to Cart</button>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-2xl font-bold">Details of {product.name}</h2>
                <p className="mt-4 text-gray-700">{product.description}</p>
            </div>

            <div className="mt-6">
                <h3 className="text-xl font-bold">Ingredients</h3>
                <ul className="list-disc pl-6 mt-2 text-gray-700">
                    {product.ingredients?.map((ingredient, index) => (
                        <li key={index}>{ingredient}</li>
                    )) || <li>No ingredients listed.</li>}
                </ul>
            </div>

            <div className="mt-10">
                <h3 className="text-2xl font-bold">Ratings & Reviews</h3>
                <div className="mt-4 space-y-6">
                    {product.ratings.length ? (
                        product.ratings.map((rev, index) => (
                            <div key={index} className="border-b pb-4">
                                <div className="flex justify-between items-center">
                                    <p className="text-lg font-semibold">{rev.name}</p>
                                    <span className="text-yellow-500">{'★'.repeat(rev.rating)}</span>
                                </div>
                                <p className="mt-2 text-gray-600">{rev.review}</p>
                            </div>
                        ))
                    ) : (
                        <p>No reviews available.</p>
                    )}
                </div>
            </div>

            <div className="mt-10">
                <h3 className="text-xl font-bold">Submit Your Review</h3>
                <form className="space-y-4 mt-4" onSubmit={(e) => {
                    e.preventDefault();
                    submitReview();
                }}>
                    <div>
                        <label className="block text-gray-700">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={rating.name}
                            onChange={handleReviewChange}
                            className="w-full border border-gray-300 px-4 py-2 rounded-md"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={rating.email}
                            onChange={handleReviewChange}
                            className="w-full border border-gray-300 px-4 py-2 rounded-md"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700">Review</label>
                        <textarea
                            name="review"
                            value={rating.review}
                            onChange={handleReviewChange}
                            className="w-full border border-gray-300 px-4 py-2 rounded-md"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700">Rating</label>
                        <select
                            name="rating"
                            value={rating.rating}
                            onChange={handleReviewChange}
                            className="w-full border border-gray-300 px-4 py-2 rounded-md"
                            required
                        >
                            <option value={0}>Select Rating</option>
                            {[...Array(5).keys()].map(n => (
                                <option key={n + 1} value={n + 1}>{n + 1} Star</option>
                            ))}
                        </select>
                    </div>

                    <button type="submit" className="bg-green-500 text-white px-6 py-2 rounded-md">
                        Post Review
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProdDetail;
