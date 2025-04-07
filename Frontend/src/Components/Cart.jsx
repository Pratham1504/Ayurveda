import React from 'react';
import { useCart } from '../context/CartContextProv';

const Cart = ({ onClose }) => {
    const { cart, updateQuantity } = useCart();

    const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    const gst = (totalPrice * 0.18).toFixed(2); // 18% GST
    const grandTotal = (totalPrice + Number(gst)).toFixed(2);

    return (
        <div className="fixed top-0 right-0 w-80 bg-white shadow-lg h-full overflow-y-auto">
            {/* X button to close the cart */}
            <button onClick={onClose} className="text-2xl absolute top-2 left-4 text-red-500 font-bold">
                &times;
            </button>

            <h2 className="text-xl font-bold mb-4 text-center mt-8">Your Cart</h2>
            {cart.length === 0 ? (
                <p className="text-center">Your cart is empty.</p>
            ) : (
                <div className="flex flex-col h-full justify-between overflow-y-auto">
                    <div className="mb-24">
                        {cart.map((item) => (
                            <div key={item._id} className="flex justify-between items-center mb-4 px-2">
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold">{item.name}</span>
                                    <span className="text-sm text-gray-500">₹{item.price}</span>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => updateQuantity(item._id, 1)}
                                        className="bg-blue-500 text-white px-2 py-1 rounded-l-md transition duration-300 hover:bg-blue-600"
                                    >
                                        +
                                    </button>
                                    <span className="px-2">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item._id, -1)}
                                        className="bg-blue-500 text-white px-2 py-1 rounded-r-md transition duration-300 hover:bg-blue-600"
                                    >
                                        -
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="fixed bottom-0 left-0 w-full bg-white p-4 shadow-inner">
                        <div className="flex justify-between text-sm mb-1">
                            <span>Total</span>
                            <span>₹{totalPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm mb-1">
                            <span>GST (18%)</span>
                            <span>₹{gst}</span>
                        </div>
                        <hr className="border-dotted border-gray-300 my-2" />
                        <div className="flex justify-between text-lg font-semibold mb-2">
                            <span>Grand Total</span>
                            <span className="font-bold">₹{grandTotal}</span>
                        </div>
                        <button
                            className="bg-green-500 text-white w-full py-2 rounded-md transition duration-300 hover:bg-green-600"
                            onClick={() => console.log('Checkout')}
                        >
                            Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
