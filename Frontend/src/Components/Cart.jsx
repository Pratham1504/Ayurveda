import React from "react";
import { useCart } from "../Context/CartContext";
import { XMarkIcon, ShoppingBagIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { server } from "../main"; // adjust if your server URL is elsewhere
import { UserData } from "../Context/UserContext"; // if you need user token
import { useNavigate, useLocation } from "react-router-dom";
import toast from 'react-hot-toast';

const Cart = ({ onClose }) => {

  const navigate = useNavigate();
  const location = useLocation();

  const { cart, updateQuantity } = useCart();
  const { user } = UserData(); // if you need auth
  const { isAuth, setModalIsOpen } = UserData(); // add isAuth and setModalIsOpen


  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const gst = (totalPrice * 0.18).toFixed(2); // 18% GST
  const grandTotal = (totalPrice + Number(gst)).toFixed(2);

  const handleCheckout = async () => {
    const orderItems = cart.map(item => ({
      productId: item._id,
      quantity: item.quantity
    }));

    try {
      // If you need auth, add headers with token
      // const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(`${server}/api/orders/place`, { items: orderItems } /*, config */);
      // Optionally clear cart here
      // on success, show success message or redirect
      alert("Order placed successfully!");
      // Optionally clear cart here
    } catch (err) {
      alert("Order failed!");
    }
  };

  return (
    <div className="fixed top-0 right-0 w-[370px] max-w-full bg-white shadow-2xl h-full flex flex-col z-50 border-l border-sky-100 animate-slide-in">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 left-4 text-gray-400 hover:text-red-500 transition text-2xl z-10"
        aria-label="Close cart"
      >
        <XMarkIcon className="h-7 w-7" />
      </button>

      <div className="flex items-center justify-center gap-2 mt-8 mb-6">
        <ShoppingBagIcon className="h-7 w-7 text-sky-600" />
        <h2 className="text-2xl font-bold text-sky-700 tracking-tight">
          Your Cart
        </h2>
      </div>
      {cart.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
          <ShoppingBagIcon className="h-16 w-16 mb-2 text-sky-100" />
          <p className="text-lg">Your cart is empty.</p>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto pb-60 px-2">
            {cart.map((item) => (
              <div
                key={item._id}
                className="flex justify-between items-center mb-4 bg-sky-50 rounded-xl p-3 shadow-sm"
              >
                <div className="flex flex-col">
                  <span className="text-base font-semibold text-gray-800">
                    {item.name}
                  </span>
                  <span className="text-sm text-gray-500">₹{item.price}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity(item._id, -1)}
                    className="bg-sky-500 text-white px-2 py-1 rounded-l-md hover:bg-sky-600 transition"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="px-2 font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item._id, 1)}
                    className="bg-sky-500 text-white px-2 py-1 rounded-r-md hover:bg-sky-600 transition"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="absolute bottom-0 left-0 w-full bg-white p-5 shadow-inner rounded-t-2xl border-t border-sky-100">
            <div className="flex justify-between text-base mb-1">
              <span className="text-gray-700">Total</span>
              <span className="font-semibold">₹{totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base mb-1">
              <span className="text-gray-700">GST (18%)</span>
              <span className="font-semibold">₹{gst}</span>
            </div>
            <hr className="border-dotted border-gray-300 my-2" />
            <div className="flex justify-between text-lg font-bold mb-3">
              <span className="text-sky-700">Grand Total</span>
              <span className="text-sky-700">₹{grandTotal}</span>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <svg
                className="h-5 w-5 text-green-500"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
              <span className="text-green-600 text-md font-semibold">
                Free delivery on all orders!
              </span>
            </div>
            <button
      className="bg-gradient-to-r from-sky-600 to-sky-400 hover:from-sky-700 hover:to-sky-500 text-white w-full py-2 rounded-lg shadow font-semibold text-lg transition"
      onClick={() => {
        const items = cart.map(item => ({
          productId: item._id,
          quantity: item.quantity
        }));
        localStorage.setItem("checkoutItems", JSON.stringify(items));
        onClose();
        if (isAuth) {
          // User is logged in, go to checkout
          navigate('/checkout');
        } else {
          // User not logged in, open login modal
          setModalIsOpen(true);
          toast.error("Please login to place order");
        }
      }}
    >
      Checkout
    </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
