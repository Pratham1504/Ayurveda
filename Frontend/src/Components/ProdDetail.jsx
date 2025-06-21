import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../Context/CartContext';
import { motion } from 'framer-motion';
import { UserData } from '../Context/UserContext';
import { Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { useProducts } from '../Context/ProductContext';
import { server } from '../main';
import logo from '../../assets/SWASTHAMANA_no_bg.png';

const ProdDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { products, productLoading, productError } = useProducts();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const { cart, addToCart, updateQuantity } = useCart();
    const [rating, setRating] = useState({ name: '', email: '', review: '', rating: 0 });
    const { user, setModalIsOpen } = UserData();
    const [hasRated, setHasRated] = useState(false);
    const [showAllReviews, setShowAllReviews] = useState(false);

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
        setRating((prev) => ({
            ...prev,
            review: e.target.value,
        }));
    };

    const submitReview = async () => {
        if (!rating.review || rating.rating === 0) {
            toast.error('Please provide both review and rating.');
            return;
        }
        try {
            const newReview = { ...rating };
            const response = await axios.post(`${server}/api/products/${id}/rating`, newReview);
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



//     return (
//         <div className="container mx-auto px-4 max-w-screen-xl py-10 font-sans text-black lg:max-w-3/4 lg:mx-auto">
//             <motion.div
//                 initial={{ opacity: 0, y: 30 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.6 }}
//                 className=" bg-gradient-to-br from-white to-sky-50 grid grid-cols-1 md:grid-cols-2 gap-10 bg-white rounded-xl shadow-lg p-8"
//             >
//                 <img src={product.image} alt={product.name} className="rounded-xl w-full h-[450px] object-contain border" />

//                 <div className="space-y-2">
//                     <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
//                     <p className="text-gray-600">by <span className="text-sky-700 font-semibold">{product.company}</span></p>

//                     <div className="flex items-center gap-4">
//                         <span className="text-black-600 text-3xl font-bold">₹{product.price}</span>
//                         <span className="text-gray-400 line-through text-lg">₹{product.MRP}</span>
//                         <span className="text-sky-500 text-lg font-semibold">{Math.round((product.MRP - product.price) / product.MRP * 100)}% off</span>
//                     </div>

//                     <p className="text-gray-700 text-sm">{product.description}</p>

//                     <p className="text-gray-600"><strong>Size:</strong> {product.size}</p>

//                     <div>
//                         <h2 className="text-md font-semibold text-gray-800 mt-4 mb-2">Ingredients:</h2>
//                         <ul className="list-disc pl-5 text-sm text-gray-700">
//                             {product.ingredients?.length ? product.ingredients.map((ing, idx) => (
//                                 <li key={idx}>{ing}</li>
//                             )) : <li>No ingredients listed.</li>}
//                         </ul>
//                     </div>
//                     {quantity > 0 ? (
//                         <div className="flex items-center justify-between mt-auto w-3/4 position">
//                             <button
//                                 onClick={(e) => {
//                                     e.stopPropagation();
//                                     updateQuantity(product._id, -1);
//                                 }}
//                                 className="bg-sky-600 text-white px-3 py-2 rounded-l-md hover:bg-sky-700 text-sm"
//                             >
//                                 -
//                             </button>
//                             <span className="px-3 py-2 text-lg ">{quantity}</span>
//                             <button
//                                 onClick={(e) => {
//                                     e.stopPropagation();
//                                     updateQuantity(product._id, 1);
//                                 }}
//                                 className="bg-sky-600 text-white px-3 py-2 rounded-r-md hover:bg-sky-700 text-sm"
//                             >
//                                 +
//                             </button>
//                         </div>
//                     ) : (
//                         <button
//                             onClick={(e) => {
//                                 e.stopPropagation();
//                                 addToCart(product);
//                             }}
//                             className="w-3/4 bg-sky-600 text-white px-3 py-2 rounded-md hover:bg-sky-700 transition mt-auto text-sm"
//                         >
//                             Add to Cart
//                         </button>
//                     )}
//                 </div>
//             </motion.div>

//             {/* import moment from "moment"; */}

//             {/* // Inside your component
// const [showAllReviews, setShowAllReviews] = useState(false); */}

//             <div className="mt-10">
//                 <h2 className="text-2xl font-semibold mb-4 text-gray-800">Customer Reviews</h2>

//                 {product.ratings && product.ratings.length > 0 ? (
//                     <>
//                         <div className="space-y-4 transition-all duration-300 ease-in-out overflow-hidden">
//                             {(showAllReviews ? product.ratings : product.ratings.slice(0, 3)).map((rev, index) => (
//                                 <div
//                                     key={index}
//                                     className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition"
//                                 >
//                                     <div className="flex items-center gap-3">
//                                         <div className="w-8 h-8 bg-sky-500 text-white text-xs flex items-center justify-center rounded-full font-bold uppercase">
//                                             {rev.name?.[0] || "U"}
//                                         </div>
//                                         <div>
//                                             <p className="font-medium text-gray-800">{rev.name || "Unnamed User"}</p>
//                                             <p className="text-sm text-yellow-500">
//                                                 {"★".repeat(rev.rating)}{"☆".repeat(5 - rev.rating)}
//                                             </p>
//                                         </div>
//                                     </div>
//                                     <p className="mt-3 text-gray-700 text-sm">{rev.review}</p>
//                                 </div>
//                             ))}
//                         </div>

//                         {product.ratings.length > 3 && (
//                             <div className="text-center mt-4">
//                                 <button
//                                     onClick={() => setShowAllReviews(!showAllReviews)}
//                                     className="text-sm text-sky-600 font-medium hover:underline transition"
//                                 >
//                                     {showAllReviews
//                                         ? "Show Less Reviews"
//                                         : `Show ${product.ratings.length - 3} More Review(s)`}
//                                 </button>
//                             </div>
//                         )}
//                     </>
//                 ) : (
//                     <p className="text-gray-500">No reviews yet. Be the first to review!</p>
//                 )}
//             </div>

//             <div className="mt-10">
//                 <h2 className="text-2xl font-semibold mb-4 text-gray-800">Submit Your Review</h2>

//                 {!user || Object.keys(user).length === 0 ? (
//                     <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-lg p-4 mb-6">
//                         Please{" "}
//                         <span
//                             onClick={() => setModalIsOpen(true)}
//                             className="text-blue-600 font-medium hover:underline cursor-pointer"
//                         >
//                             login
//                         </span>{" "}
//                         to submit a review.
//                     </div>
//                 ) : hasRated ? (
//                     <div className="mt-6 p-4 border border-yellow-300 bg-yellow-50 text-yellow-700 rounded-lg shadow-sm">
//                         <p className="font-semibold">You have already reviewed this product.</p>
//                         <p className="text-sm mt-1">Thank you for your valuable feedback!</p>
//                     </div>
//                 ) : (
//                     <form onSubmit={(e) => { e.preventDefault(); submitReview(); }} className="space-y-6 mt-4">

//                         {/* Rating Stars */}
//                         <div className="relative">
//                             <label className="block text-sm font-medium text-gray-700 mb-1">Your Rating</label>
//                             <StarRating
//                                 value={rating.rating}
//                                 onChange={(newRating) => setRating((prev) => ({ ...prev, rating: newRating }))}
//                             />
//                         </div>

//                         {/* Review Text */}
//                         <div className="relative">
//                             <textarea
//                                 id="review"
//                                 rows="4"
//                                 value={rating.review}
//                                 onChange={handleReviewChange}
//                                 placeholder=" "
//                                 className="peer w-full px-3 pt-5 pb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 outline-none resize-none"
//                                 required
//                             ></textarea>
//                             <label
//                                 htmlFor="review"
//                                 className={`absolute left-3 top-1.5 text-gray-400 text-sm transition-all 
//       peer-placeholder-shown:top-1.5 peer-placeholder-shown:text-base 
//       peer-focus:top-1 peer-focus:text-sm peer-focus:text-sky-500`}
//                             >
//                                 Write your thoughts...
//                             </label>
//                         </div>

//                         {/* Submit Button */}
//                         <button
//                             type="submit"
//                             className={`w-full md:w-auto px-6 py-2 rounded-lg font-medium shadow transition
//           ${!rating.review || rating.rating === 0
//                                     ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
//                                     : 'bg-sky-600 hover:bg-sky-700 text-white'}
//         `}
//                             disabled={!rating.review || rating.rating === 0}
//                         >
//                             Submit Review
//                         </button>
//                     </form>
//                 )}
//             </div>

//             {relatedProducts.length > 0 && (
//                 <motion.div
//                     initial={{ opacity: 0 }}
//                     whileInView={{ opacity: 1 }}
//                     transition={{ delay: 0.2 }}
//                     className="mt-16"
//                 >
//                     <h2 className="text-2xl font-bold mb-6">More from {product.company}</h2>
//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//                         {relatedProducts.map(item => (
//                             <div key={item._id} className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md" onClick={() => navigate(`/products/${item._id}`)}>
//                                 <img src={item.image} alt={item.name} className="h-40 w-full object-cover rounded mb-2" />
//                                 <p className="font-medium text-sm truncate">{item.name}</p>
//                                 <p className="text-xs text-gray-500">₹{item.price}</p>
//                             </div>
//                         ))}
//                     </div>
//                 </motion.div>
//             )}
//         </div>
//     );

return (
  <div className="container mx-auto px-4 max-w-5xl py-10 font-sans text-black">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white/80 backdrop-blur-lg grid grid-cols-1 md:grid-cols-2 gap-12 rounded-3xl shadow-2xl p-10 border border-sky-100"
    >
      {/* Product Image */}
      <div className="relative flex flex-row items-center">
        <img
          src={product.image}
          alt={product.name}
          className="rounded-2xl w-full h-[420px] object-contain border border-sky-100 shadow-md bg-white"
        />
        <div className="mt-6 flex flex-wrap gap-2">
          {product.ingredients?.length > 4 && (
            <span className="bg-sky-200 text-sky-700 px-3 py-1 rounded-full text-xs font-semibold">
              +{product.ingredients.length - 4} more
            </span>
          )}
        </div>
        {/* Website Logo at bottom right */}
        <img
            src={logo} // <-- replace with your actual logo path
            alt="Website Logo"
            className="absolute bottom-4 right-4 w-14 h-14 object-contain opacity-90"
            draggable={false}
        />
      </div>

      {/* Product Details */}
      <div className="flex flex-col h-full">
        <h1 className="text-4xl font-extrabold text-sky-800 mb-2">{product.name}</h1>
        <p className="text-gray-500 mb-2 text-lg">
          by <span className="text-sky-600 font-semibold">{product.company}</span>
        </p>
        <div className="flex items-center gap-4 mb-4">
          <span className="text-3xl font-bold text-sky-700">₹{product.price}</span>
          <span className="text-gray-400 line-through text-lg">₹{product.MRP}</span>
          <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-semibold">
            {Math.round((product.MRP - product.price) / product.MRP * 100)}% OFF
          </span>
        </div>
        <p className="text-gray-700 mb-4">{product.description}</p>
        <div className="flex items-center gap-4 mb-4">
          <span className="bg-sky-50 text-sky-700 px-3 py-1 rounded text-sm font-medium">
            Size: {product.size}
          </span>
        </div>
        <div className="mb-6">
          <h2 className="text-md font-semibold text-gray-800 mb-1">Ingredients:</h2>
          <ul className="list-disc pl-5 text-sm text-gray-700">
            {product.ingredients?.length ? product.ingredients.map((ing, idx) => (
              <li key={idx}>{ing}</li>
            )) : <li>No ingredients listed.</li>}
          </ul>
        </div>
        {/* Cart Controls */}
        <div className="mt-auto flex items-center justify-center">
          {quantity > 0 ? (
            <div className="flex items-center w-full border border-sky-200 rounded-lg overflow-hidden shadow-sm">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  updateQuantity(product._id, -1);
                }}
                className="bg-sky-600 text-white px-4 py-2 hover:bg-sky-700 text-lg font-bold"
              >
                -
              </button>
              <span className="flex-1 text-center text-lg font-semibold">{quantity}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  updateQuantity(product._id, 1);
                }}
                className="bg-sky-600 text-white px-4 py-2 hover:bg-sky-700 text-lg font-bold"
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
              className="w-full bg-gradient-to-r from-sky-600 to-sky-400 hover:from-sky-700 hover:to-sky-500 text-white px-6 py-3 rounded-lg font-semibold shadow transition"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </motion.div>

    
    

    {/* Reviews Section */}
    <div className="mt-14">
      <h2 className="text-2xl font-bold mb-6 text-sky-800">Customer Reviews</h2>
      {product.ratings && product.ratings.length > 0 ? (
        <>
          <div className="space-y-4 transition-all duration-300 ease-in-out overflow-hidden">
            {(showAllReviews ? product.ratings : product.ratings.slice(0, 3)).map((rev, index) => (
              <div
                key={index}
                className="bg-white border border-sky-100 rounded-xl p-5 shadow hover:shadow-md transition"
              >
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-9 h-9 bg-sky-500 text-white text-base flex items-center justify-center rounded-full font-bold uppercase">
                    {rev.name?.[0] || "U"}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{rev.name || "Unnamed User"}</p>
                    <p className="text-sm text-yellow-500">
                      {"★".repeat(rev.rating)}{"☆".repeat(5 - rev.rating)}
                    </p>
                  </div>
                </div>
                <p className="mt-2 text-gray-700 text-base">{rev.review}</p>
              </div>
            ))}
          </div>
          {product.ratings.length > 3 && (
            <div className="text-center mt-4">
              <button
                onClick={() => setShowAllReviews(!showAllReviews)}
                className="text-sm text-sky-600 font-semibold hover:underline transition"
              >
                {showAllReviews
                  ? "Show Less Reviews"
                  : `Show ${product.ratings.length - 3} More Review(s)`}
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="text-gray-500">No reviews yet. Be the first to review!</p>
      )}
    </div>

    {/* Submit Review Section */}
    <div className="mt-14">
      <h2 className="text-2xl font-bold mb-6 text-sky-800">Submit Your Review</h2>
      {!user || Object.keys(user).length === 0 ? (
        <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-lg p-4 mb-6">
          Please{" "}
          <span
            onClick={() => setModalIsOpen(true)}
            className="text-blue-600 font-medium hover:underline cursor-pointer"
          >
            login
          </span>{" "}
          to submit a review.
        </div>
      ) : hasRated ? (
        <div className="mt-6 p-4 border border-yellow-300 bg-yellow-50 text-yellow-700 rounded-lg shadow-sm">
          <p className="font-semibold">You have already reviewed this product.</p>
          <p className="text-sm mt-1">Thank you for your valuable feedback!</p>
        </div>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); submitReview(); }} className="space-y-6 mt-4">
          {/* Rating Stars */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Rating</label>
            <StarRating
              value={rating.rating}
              onChange={(newRating) => setRating((prev) => ({ ...prev, rating: newRating }))}
            />
          </div>
          {/* Review Text */}
          <div className="relative">
            <textarea
              id="review"
              rows="4"
              value={rating.review}
              onChange={handleReviewChange}
              placeholder=" "
              className="peer w-full px-3 pt-5 pb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 outline-none resize-none"
              required
            ></textarea>
            <label
              htmlFor="review"
              className={`absolute left-3 top-1.5 text-gray-400 text-sm transition-all 
                peer-placeholder-shown:top-1.5 peer-placeholder-shown:text-base 
                peer-focus:top-1 peer-focus:text-sm peer-focus:text-sky-500`}
            >
              Write your thoughts...
            </label>
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full md:w-auto px-6 py-2 rounded-lg font-medium shadow transition
              ${!rating.review || rating.rating === 0
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : 'bg-sky-600 hover:bg-sky-700 text-white'}
            `}
            disabled={!rating.review || rating.rating === 0}
          >
            Submit Review
          </button>
        </form>
      )}
    </div>

    {/* Related Products */}
    {relatedProducts.length > 0 && (
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-20"
      >
        <h2 className="text-2xl font-bold mb-6 text-sky-800">
          More from {product.company}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {relatedProducts.map(item => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow p-4 cursor-pointer hover:shadow-lg border border-sky-100 transition"
              onClick={() => navigate(`/products/${item._id}`)}
            >
              <img
                src={item.image}
                alt={item.name}
                className="h-36 w-full object-cover rounded mb-2"
              />
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
