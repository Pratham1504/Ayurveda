// import React, { useEffect, useState } from "react";
// import { useCart } from "../Context/CartContext";
// import { UserData } from "../Context/UserContext";
// import axios from "axios";
// import { server } from "../main";
// import { useNavigate } from "react-router-dom";

// const Checkout = () => {
//   const { cart } = useCart();
//   const { user } = UserData();
//   const [step, setStep] = useState(1);
//   const [addresses, setAddresses] = useState([]);
//   const [selectedAddress, setSelectedAddress] = useState(null);
//   const [showAddAddress, setShowAddAddress] = useState(false);
//   const [addressForm, setAddressForm] = useState({
//     phone: "",
//     houseNo: "",
//     street: "",
//     landmark: "",
//     city: "",
//     state: "",
//     pincode: "",
//     addressType: "Home",
//   });
//   const [modeOfPayment, setModeOfPayment] = useState("COD");
//   const [placingOrder, setPlacingOrder] = useState(false);
//   const navigate = useNavigate();

//   const [checkoutItems, setCheckoutItems] = useState(() => {
//     const stored = localStorage.getItem("checkoutItems");
//     return stored ? JSON.parse(stored) : [];
//   });
//     const [products, setProducts] = useState([]);

//     useEffect(() => {
//         const fetchProducts = async () => {
//             if (checkoutItems.length === 0) return;
//             // Assuming you have an endpoint to get multiple products by IDs
//             const ids = checkoutItems.map(item => item.productId);
//             const res = await axios.post(`${server}/api/products/byIds`, { ids });
//             setProducts(res.data.products); // [{_id, name, price, ...}]
//         };
//         fetchProducts();
//     }, [checkoutItems]);
//     // Then, for cost calculation:
//     const totalPrice = checkoutItems.reduce((total, item) => {
//         const prod = products.find(p => p._id === item.productId);
//         return prod ? total + prod.price * item.quantity : total;
//     }, 0);

//   // Fetch addresses on mount
//   useEffect(() => {
//     const fetchAddresses = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const res = await axios.get(`${server}/api/user/getAddress`, {
//           headers: { token: `${token}` },
//         });
//         setAddresses(res.data.addresses || []);
//       } catch (err) {
//         setAddresses([]);
//       }
//     };
//     fetchAddresses();
//   }, [user]);

//   // Add new address
//   const handleAddAddress = async (e) => {
//     e.preventDefault();
//     try {
//       const token = user?.token;
//       const res = await axios.post(
//         `${server}/api/user/addAddress`,
//         addressForm,
//         { headers: {
//           token: localStorage.getItem("token"),
//         }, }
//       );
//       setAddresses((prev) => [...prev, res.data.address]);
//       setShowAddAddress(false);
//       setAddressForm({
//         phone: "",
//         houseNo: "",
//         street: "",
//         landmark: "",
//         city: "",
//         state: "",
//         pincode: "",
//         addressType: "Home",
//       });
//     } catch (err) {
//       alert("Failed to add address");
//     }
//   };

//   // Place order
//   const handlePlaceOrder = async () => {
//     setPlacingOrder(true);
//     try {
//       const token = localStorage.getItem("token");
//       const items = JSON.parse(localStorage.getItem("checkoutItems")) || [];

//       const body = {
//         items, // already in [{ productId, quantity }] format
//         orderAdress: selectedAddress,
//         modeOfPayment,
//       };
//       await axios.post(`${server}/api/orders/place`, body, {
//         headers: { token: `${token}` },
//       });
//       alert("Order placed successfully!");
//       navigate("/my-orders");
//     } catch (err) {
//       alert("Order failed!");
//     }
//     setPlacingOrder(false);
//   };

//   // Steps UI
//   return (
//     <div className="max-w-2xl mx-auto py-10 px-4">
//       <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>
//       {/* Stepper */}
//       <div className="flex justify-between mb-8">
//         <div className={`flex-1 text-center ${step === 1 ? "font-bold text-sky-600" : ""}`}>1. Address</div>
//         <div className={`flex-1 text-center ${step === 2 ? "font-bold text-sky-600" : ""}`}>2. Payment</div>
//         <div className={`flex-1 text-center ${step === 3 ? "font-bold text-sky-600" : ""}`}>3. Review</div>
//       </div>

//       {/* Step 1: Address Selection */}
//       {step === 1 && (
//         <div>
//           <h2 className="text-xl font-semibold mb-4">Select Delivery Address</h2>
//           {addresses.length === 0 && (
//             <div className="mb-4 text-gray-600">No addresses found. Please add one.</div>
//           )}
//           <div className="space-y-3 mb-4">
//             {addresses.map((addr) => (
//               <label key={addr._id} className="block border rounded-lg p-3 cursor-pointer hover:border-sky-400">
//                 <input
//                   type="radio"
//                   name="address"
//                   value={addr._id}
//                   checked={selectedAddress === addr._id}
//                   onChange={() => setSelectedAddress(addr._id)}
//                   className="mr-2"
//                 />
//                 {addr.houseNo}, {addr.street}, {addr.landmark}, {addr.city}, {addr.state} - {addr.pincode} ({addr.addressType})
//               </label>
//             ))}
//           </div>
//           {showAddAddress ? (
//             <form onSubmit={handleAddAddress} className="space-y-2 border rounded-lg p-4 mb-4">
//               <input type="text" placeholder="Phone" className="w-full border p-2 rounded" required value={addressForm.phone} onChange={e => setAddressForm({ ...addressForm, phone: e.target.value })} />
//               <input type="text" placeholder="House No" className="w-full border p-2 rounded" required value={addressForm.houseNo} onChange={e => setAddressForm({ ...addressForm, houseNo: e.target.value })} />
//               <input type="text" placeholder="Street" className="w-full border p-2 rounded" required value={addressForm.street} onChange={e => setAddressForm({ ...addressForm, street: e.target.value })} />
//               <input type="text" placeholder="Landmark" className="w-full border p-2 rounded" required value={addressForm.landmark} onChange={e => setAddressForm({ ...addressForm, landmark: e.target.value })} />
//               <input type="text" placeholder="City" className="w-full border p-2 rounded" required value={addressForm.city} onChange={e => setAddressForm({ ...addressForm, city: e.target.value })} />
//               <input type="text" placeholder="State" className="w-full border p-2 rounded" required value={addressForm.state} onChange={e => setAddressForm({ ...addressForm, state: e.target.value })} />
//               <input type="text" placeholder="Pincode" className="w-full border p-2 rounded" required value={addressForm.pincode} onChange={e => setAddressForm({ ...addressForm, pincode: e.target.value })} />
//               <select className="w-full border p-2 rounded" value={addressForm.addressType} onChange={e => setAddressForm({ ...addressForm, addressType: e.target.value })}>
//                 <option value="Home">Home</option>
//                 <option value="Work">Work</option>
//                 <option value="Other">Other</option>
//               </select>
//               <div className="flex gap-2">
//                 <button type="submit" className="bg-sky-600 text-white px-4 py-2 rounded">Save Address</button>
//                 <button type="button" className="bg-gray-300 px-4 py-2 rounded" onClick={() => setShowAddAddress(false)}>Cancel</button>
//               </div>
//             </form>
//           ) : (
//             <button className="bg-sky-600 text-white px-4 py-2 rounded mb-4" onClick={() => setShowAddAddress(true)}>
//               + Add New Address
//             </button>
//           )}
//           <div className="flex justify-end">
//             <button
//               className="bg-sky-600 text-white px-6 py-2 rounded disabled:opacity-50"
//               disabled={!selectedAddress}
//               onClick={() => setStep(2)}
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Step 2: Payment Mode */}
//       {step === 2 && (
//         <div>
//           <h2 className="text-xl font-semibold mb-4">Select Payment Mode</h2>
//           <div className="flex flex-col gap-3 mb-6">
//             <label className="flex items-center gap-2">
//               <input type="radio" name="payment" value="COD" checked={modeOfPayment === "COD"} onChange={() => setModeOfPayment("COD")} />
//               Cash on Delivery (COD)
//             </label>
//             <label className="flex items-center gap-2">
//               <input type="radio" name="payment" value="UPI" checked={modeOfPayment === "UPI"} onChange={() => setModeOfPayment("UPI")} />
//               UPI
//             </label>
//           </div>
//           <div className="flex justify-between">
//             <button className="bg-gray-300 px-6 py-2 rounded" onClick={() => setStep(1)}>Back</button>
//             <button className="bg-sky-600 text-white px-6 py-2 rounded" onClick={() => setStep(3)}>Next</button>
//           </div>
//         </div>
//       )}

//       {/* Step 3: Review & Place Order */}
//       {step === 3 && (
//         <div>
//           <h2 className="text-xl font-semibold mb-4">Review Your Order</h2>
//           <div className="mb-4">
//             <div className="font-semibold mb-2">Products:</div>
//             <ul className="mb-2">
//               {cart.map(item => (
//                 <li key={item._id} className="flex justify-between">
//                   <span>{item.name} x {item.quantity}</span>
//                   <span>₹{item.price * item.quantity}</span>
//                 </li>
//               ))}
//             </ul>
//             <div className="font-semibold mb-2">Delivery Address:</div>
//             <div className="mb-2 text-gray-700">
//               {addresses.find(a => a._id === selectedAddress) ? (
//                 <>
//                   {addresses.find(a => a._id === selectedAddress).houseNo}, {addresses.find(a => a._id === selectedAddress).street}, {addresses.find(a => a._id === selectedAddress).landmark}, {addresses.find(a => a._id === selectedAddress).city}, {addresses.find(a => a._id === selectedAddress).state} - {addresses.find(a => a._id === selectedAddress).pincode} ({addresses.find(a => a._id === selectedAddress).addressType})
//                 </>
//               ) : "No address selected"}
//             </div>
//             <div className="font-semibold mb-2">Payment Mode:</div>
//             <div className="mb-4 text-gray-700">{modeOfPayment}</div>
//             <div className="flex justify-between text-lg font-bold">
//               <span>Total</span>
//               <span>
//                 ₹{cart.reduce((total, item) => total + item.price * item.quantity, 0)}
//               </span>
//             </div>
//           </div>
//           <div className="flex justify-between">
//             <button className="bg-gray-300 px-6 py-2 rounded" onClick={() => setStep(2)}>Back</button>
//             <button
//               className="bg-green-600 text-white px-6 py-2 rounded"
//               onClick={handlePlaceOrder}
//               disabled={placingOrder}
//             >
//               {placingOrder ? "Placing Order..." : "Place Order"}
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Checkout;

import React, { useEffect, useState } from "react";
import { useCart } from "../Context/CartContext";
import { UserData } from "../Context/UserContext";
import axios from "axios";
import { server } from "../main";
import { useNavigate } from "react-router-dom";
import {
  HomeIcon,
  CreditCardIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

const Checkout = () => {
  const { cart } = useCart();
  const { user } = UserData();
  const [step, setStep] = useState(1);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    phone: "",
    houseNo: "",
    street: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    addressType: "Home",
  });
  const [modeOfPayment, setModeOfPayment] = useState("COD");
  const [placingOrder, setPlacingOrder] = useState(false);
  const navigate = useNavigate();

  const [checkoutItems, setCheckoutItems] = useState(() => {
    const stored = localStorage.getItem("checkoutItems");
    return stored ? JSON.parse(stored) : [];
  });
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (checkoutItems.length === 0) return;
      try {
        const productPromises = checkoutItems.map((item) =>
          axios
            .get(`${server}/api/products/${item.productId}`)
            .then((res) => res.data) // <-- FIXED HERE
            .catch(() => null)
        );
        const productsArr = await Promise.all(productPromises);
        setProducts(productsArr.filter(Boolean));
      } catch (err) {
        setProducts([]);
      }
    };
    fetchProducts();
  }, [checkoutItems]);

  const totalPrice = checkoutItems.reduce((total, item) => {
    const prod = products.find((p) => p && p._id === item.productId);
    return prod ? total + prod.price * item.quantity : total;
  }, 0);

  // Fetch addresses on mount
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${server}/api/user/getAddress`, {
          headers: { token: `${token}` },
        });
        setAddresses(res.data.addresses || []);
      } catch (err) {
        setAddresses([]);
      }
    };
    fetchAddresses();
  }, [user]);

  // Add new address
  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${server}/api/user/addAddress`,
        addressForm,
        { headers: { token: localStorage.getItem("token") } }
      );
      setAddresses((prev) => [...prev, res.data.address]);
      setShowAddAddress(false);
      setAddressForm({
        phone: "",
        houseNo: "",
        street: "",
        landmark: "",
        city: "",
        state: "",
        pincode: "",
        addressType: "Home",
      });
    } catch (err) {
      alert("Failed to add address");
    }
  };

  // Place order
  const handlePlaceOrder = async () => {
    setPlacingOrder(true);
    try {
      const token = localStorage.getItem("token");
      const items = JSON.parse(localStorage.getItem("checkoutItems")) || [];
      const body = {
        items,
        orderAdress: selectedAddress,
        modeOfPayment,
      };
      await axios.post(`${server}/api/orders/place`, body, {
        headers: { token: `${token}` },
      });
      alert("Order placed successfully!");
      navigate("/my-orders");
    } catch (err) {
      alert("Order failed!");
    }
    setPlacingOrder(false);
  };

  // Stepper UI
  const steps = [
    { label: "Address", icon: <HomeIcon className="h-6 w-6" /> },
    { label: "Payment", icon: <CreditCardIcon className="h-6 w-6" /> },
    { label: "Review", icon: <CheckCircleIcon className="h-6 w-6" /> },
  ];

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-extrabold text-sky-700 mb-10 text-center tracking-tight">
        Checkout
      </h1>
      {/* Stepper */}
      <div className="relative mb-10 max-w-3xl mx-auto">
  {/* Horizontal line */}
  <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 z-0" style={{transform: 'translateY(-50%)'}} />
  {/* Stepper icons and labels */}
  <div className="flex justify-between items-center relative z-10">
    {steps.map((stepObj, idx) => (
      <div key={stepObj.label} className="flex flex-col items-center flex-1">
        <div
          className={`rounded-full p-2 border-2 mb-2
            ${step === idx + 1
              ? "border-sky-600 bg-sky-50 text-sky-700"
              : "border-gray-200 bg-gray-50 text-gray-400"
            }`}
        >
          {stepObj.icon}
        </div>
        <span
          className={`text-sm font-semibold
            ${step === idx + 1 ? "text-sky-700" : "text-gray-400"}
          `}
        >
          {stepObj.label}
        </span>
      </div>
    ))}
  </div>
</div>

      {/* Step 1: Address Selection */}
      {/* {step === 1 && (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-sky-100 max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-sky-700 mb-4 flex items-center gap-2">
            <HomeIcon className="h-6 w-6 text-sky-500" />
            Select Delivery Address
          </h2>
          {addresses.length === 0 && (
            <div className="mb-4 text-gray-600">
              No addresses found. Please add one.
            </div>
          )}
          <div className="space-y-3 mb-4">
            {addresses.map((addr) => (
              <label
                key={addr._id}
                className={`block border rounded-xl p-4 cursor-pointer transition hover:border-sky-400 ${
                  selectedAddress === addr._id
                    ? "border-sky-600 bg-sky-50"
                    : "border-gray-200"
                }`}
              >
                <input
                  type="radio"
                  name="address"
                  value={addr._id}
                  checked={selectedAddress === addr._id}
                  onChange={() => setSelectedAddress(addr._id)}
                  className="mr-2 accent-sky-600"
                />
                <span className="font-semibold">{addr.addressType}:</span>{" "}
                {addr.houseNo}, {addr.street}, {addr.landmark}, {addr.city},{" "}
                {addr.state} - {addr.pincode}
                <span className="ml-2 text-gray-500 text-xs">
                  ({addr.phone})
                </span>
              </label>
            ))}
          </div>
          {showAddAddress ? (
            <form
              onSubmit={handleAddAddress}
              className="space-y-2 border rounded-xl p-4 mb-4 bg-sky-50"
            >
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Phone"
                  className="border p-2 rounded"
                  required
                  value={addressForm.phone}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, phone: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="House No"
                  className="border p-2 rounded"
                  required
                  value={addressForm.houseNo}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, houseNo: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Street"
                  className="border p-2 rounded"
                  required
                  value={addressForm.street}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, street: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Landmark"
                  className="border p-2 rounded"
                  required
                  value={addressForm.landmark}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, landmark: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="City"
                  className="border p-2 rounded"
                  required
                  value={addressForm.city}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, city: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="State"
                  className="border p-2 rounded"
                  required
                  value={addressForm.state}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, state: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Pincode"
                  className="border p-2 rounded"
                  required
                  value={addressForm.pincode}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, pincode: e.target.value })
                  }
                />
                <select
                  className="border p-2 rounded"
                  value={addressForm.addressType}
                  onChange={(e) =>
                    setAddressForm({
                      ...addressForm,
                      addressType: e.target.value,
                    })
                  }
                >
                  <option value="Home">Home</option>
                  <option value="Work">Work</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  type="submit"
                  className="bg-sky-600 text-white px-4 py-2 rounded-lg shadow hover:bg-sky-700 transition"
                >
                  Save Address
                </button>
                <button
                  type="button"
                  className="bg-gray-300 px-4 py-2 rounded-lg"
                  onClick={() => setShowAddAddress(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button
              className="bg-gradient-to-r from-sky-600 to-sky-400 text-white px-4 py-2 rounded-lg shadow hover:from-sky-700 hover:to-sky-500 mb-4"
              onClick={() => setShowAddAddress(true)}
            >
              + Add New Address
            </button>
          )}
          <div className="flex justify-end">
            <button
              className="bg-gradient-to-r from-sky-600 to-sky-400 text-white px-6 py-2 rounded-lg shadow hover:from-sky-700 hover:to-sky-500 disabled:opacity-50"
              disabled={!selectedAddress}
              onClick={() => setStep(2)}
            >
              Next
            </button>
          </div>
        </div>
      )} */}

      {step === 1 && (
  <div className="bg-white rounded-2xl shadow-lg p-8 border border-sky-100 max-w-3xl mx-auto">
    <h2 className="text-2xl font-bold text-sky-700 mb-8 flex items-center gap-3">
      <HomeIcon className="h-7 w-7 text-sky-500" />
      Select Delivery Address
    </h2>
    <div className="space-y-4 mb-6">
      {addresses.length === 0 && (
        <div className="mb-4 text-gray-600 text-center">
          No addresses found. Please add one.
        </div>
      )}
      {addresses.map((addr) => (
        <label
          key={addr._id}
          className={`flex items-start gap-4 border-2 rounded-xl p-5 cursor-pointer transition
            ${selectedAddress === addr._id
              ? "border-sky-600 bg-sky-50 shadow"
              : "border-gray-200 bg-gray-50 hover:border-sky-400"
            }`}
        >
          <input
            type="radio"
            name="address"
            value={addr._id}
            checked={selectedAddress === addr._id}
            onChange={() => setSelectedAddress(addr._id)}
            className="mt-1 accent-sky-600 h-5 w-5"
          />
          <div>
            <div className="font-semibold text-base text-sky-700 flex items-center gap-2">
              <span>{addr.addressType}</span>
              <span className="text-xs text-gray-400">({addr.phone})</span>
            </div>
            <div className="text-gray-700 text-sm mt-1">
              {addr.houseNo}, {addr.street}, {addr.landmark},<br />
              {addr.city}, {addr.state} - {addr.pincode}
            </div>
          </div>
        </label>
      ))}
    </div>
    {showAddAddress ? (
      <form
        onSubmit={handleAddAddress}
        className="space-y-2 border-2 border-sky-100 rounded-xl p-6 mb-6 bg-sky-50"
      >
        <div className="grid grid-cols-2 gap-3">
          <input type="text" placeholder="Phone" className="border p-2 rounded" required value={addressForm.phone} onChange={e => setAddressForm({ ...addressForm, phone: e.target.value })} />
          <input type="text" placeholder="House No" className="border p-2 rounded" required value={addressForm.houseNo} onChange={e => setAddressForm({ ...addressForm, houseNo: e.target.value })} />
          <input type="text" placeholder="Street" className="border p-2 rounded" required value={addressForm.street} onChange={e => setAddressForm({ ...addressForm, street: e.target.value })} />
          <input type="text" placeholder="Landmark" className="border p-2 rounded" required value={addressForm.landmark} onChange={e => setAddressForm({ ...addressForm, landmark: e.target.value })} />
          <input type="text" placeholder="City" className="border p-2 rounded" required value={addressForm.city} onChange={e => setAddressForm({ ...addressForm, city: e.target.value })} />
          <input type="text" placeholder="State" className="border p-2 rounded" required value={addressForm.state} onChange={e => setAddressForm({ ...addressForm, state: e.target.value })} />
          <input type="text" placeholder="Pincode" className="border p-2 rounded" required value={addressForm.pincode} onChange={e => setAddressForm({ ...addressForm, pincode: e.target.value })} />
          <select className="border p-2 rounded" value={addressForm.addressType} onChange={e => setAddressForm({ ...addressForm, addressType: e.target.value })}>
            <option value="Home">Home</option>
            <option value="Work">Work</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="flex gap-2 mt-3">
          <button type="submit" className="bg-sky-600 text-white px-4 py-2 rounded-lg shadow hover:bg-sky-700 transition">Save Address</button>
          <button type="button" className="bg-gray-300 px-4 py-2 rounded-lg" onClick={() => setShowAddAddress(false)}>Cancel</button>
        </div>
      </form>
    ) : (
      <button className="bg-gradient-to-r from-sky-600 to-sky-400 text-white px-4 py-2 rounded-lg shadow hover:from-sky-700 hover:to-sky-500 mb-6" onClick={() => setShowAddAddress(true)}>
        + Add New Address
      </button>
    )}
    <div className="flex justify-end">
      <button
        className="bg-gradient-to-r from-sky-600 to-sky-400 text-white px-8 py-2 rounded-lg shadow hover:from-sky-700 hover:to-sky-500 font-semibold disabled:opacity-50"
        disabled={!selectedAddress}
        onClick={() => setStep(2)}
      >
        Next
      </button>
    </div>
  </div>
)}

      {/* Step 2: Payment Mode */}
      {/* {step === 2 && (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-sky-100 max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-sky-700 mb-4 flex items-center gap-2">
            <CreditCardIcon className="h-6 w-6 text-sky-500" />
            Select Payment Mode
          </h2>
          <div className="flex flex-col gap-3 mb-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="payment"
                value="COD"
                checked={modeOfPayment === "COD"}
                onChange={() => setModeOfPayment("COD")}
                className="accent-sky-600"
              />
              <span className="font-medium">Cash on Delivery (COD)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="payment"
                value="UPI"
                checked={modeOfPayment === "UPI"}
                onChange={() => setModeOfPayment("UPI")}
                className="accent-sky-600"
              />
              <span className="font-medium">UPI</span>
            </label>
          </div>
          <div className="flex justify-between">
            <button
              className="bg-gray-300 px-6 py-2 rounded-lg"
              onClick={() => setStep(1)}
            >
              Back
            </button>
            <button
              className="bg-gradient-to-r from-sky-600 to-sky-400 text-white px-6 py-2 rounded-lg shadow hover:from-sky-700 hover:to-sky-500"
              onClick={() => setStep(3)}
            >
              Next
            </button>
          </div>
        </div>
      )} */}

      {step === 2 && (
  <div className="bg-white rounded-2xl shadow-lg p-8 border border-sky-100 max-w-3xl mx-auto">
    <h2 className="text-2xl font-bold text-sky-700 mb-8 flex items-center gap-3">
      <CreditCardIcon className="h-7 w-7 text-sky-500" />
      Select Payment Mode
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <label
        className={`flex items-center gap-4 p-5 rounded-xl border-2 cursor-pointer transition 
          ${modeOfPayment === "COD"
            ? "border-sky-600 bg-sky-50 shadow"
            : "border-gray-200 bg-gray-50 hover:border-sky-400"
          }`}
      >
        <span className="bg-sky-100 p-3 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <rect x="3" y="7" width="18" height="10" rx="2" strokeWidth="2" />
            <path d="M3 10h18" strokeWidth="2" />
          </svg>
        </span>
        <div className="flex-1">
          <div className="font-semibold text-lg">Cash on Delivery</div>
          <div className="text-gray-500 text-sm">Pay with cash when your order is delivered.</div>
        </div>
        <input
          type="radio"
          name="payment"
          value="COD"
          checked={modeOfPayment === "COD"}
          onChange={() => setModeOfPayment("COD")}
          className="accent-sky-600 h-5 w-5"
        />
      </label>
      <label
        className={`flex items-center gap-4 p-5 rounded-xl border-2 cursor-pointer transition 
          ${modeOfPayment === "UPI"
            ? "border-sky-600 bg-sky-50 shadow"
            : "border-gray-200 bg-gray-50 hover:border-sky-400"
          }`}
      >
        <span className="bg-sky-100 p-3 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M4 7h16M4 12h16M4 17h16" strokeWidth="2" />
            <circle cx="8" cy="12" r="1.5" fill="currentColor" />
            <circle cx="16" cy="12" r="1.5" fill="currentColor" />
          </svg>
        </span>
        <div className="flex-1">
          <div className="font-semibold text-lg">UPI</div>
          <div className="text-gray-500 text-sm">Pay instantly using your UPI app.</div>
        </div>
        <input
          type="radio"
          name="payment"
          value="UPI"
          checked={modeOfPayment === "UPI"}
          onChange={() => setModeOfPayment("UPI")}
          className="accent-sky-600 h-5 w-5"
        />
      </label>
    </div>
    <div className="flex justify-between">
      <button
        className="bg-gray-300 px-8 py-2 rounded-lg font-semibold"
        onClick={() => setStep(1)}
      >
        Back
      </button>
      <button
        className="bg-gradient-to-r from-sky-600 to-sky-400 text-white px-8 py-2 rounded-lg shadow hover:from-sky-700 hover:to-sky-500 font-semibold"
        onClick={() => setStep(3)}
      >
        Next
      </button>
    </div>
  </div>
)}

      {/* Step 3: Review & Place Order */}
      {/* {step === 3 && (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-sky-100">
          <h2 className="text-xl font-bold text-sky-700 mb-4 flex items-center gap-2">
            <CheckCircleIcon className="h-6 w-6 text-sky-500" />
            Review Your Order
          </h2>
          <div className="mb-4">
            <div className="font-semibold mb-2 text-gray-700">Products:</div>
            
            <div className="mb-6">
              <h3 className="text-lg font-bold text-sky-700 mb-2 border-b pb-1">
                Items
              </h3>
              <div className="space-y-4">
                {checkoutItems.map((item) => {
                  const prod = products.find(
                    (p) => String(p._id) === String(item.productId)
                  );
                  if (!prod) return null;
                  return (
                    <div
                      key={item.productId}
                      className="flex items-center gap-4 bg-sky-50 rounded-2xl p-4 shadow-sm border border-sky-100"
                    >
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-20 h-20 object-contain rounded-lg border bg-white"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/80x80?text=No+Image";
                        }}
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-lg text-gray-900">
                          {prod.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {prod.company && <span>{prod.company}</span>}
                          {prod.size && <span> • {prod.size}</span>}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          Qty:{" "}
                          <span className="font-semibold">{item.quantity}</span>
                        </div>
                        <div className="text-sm text-gray-700 mt-1">
                          Price: ₹{prod.price} × {item.quantity} ={" "}
                          <span className="font-bold text-sky-700">
                            ₹{prod.price * item.quantity}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="font-semibold mb-2 text-gray-700">
              Delivery Address:
            </div>
            <div className="mb-2 text-gray-700">
              {addresses.find((a) => a._id === selectedAddress) ? (
                <>
                  {addresses.find((a) => a._id === selectedAddress).houseNo},{" "}
                  {addresses.find((a) => a._id === selectedAddress).street},{" "}
                  {addresses.find((a) => a._id === selectedAddress).landmark},{" "}
                  {addresses.find((a) => a._id === selectedAddress).city},{" "}
                  {addresses.find((a) => a._id === selectedAddress).state} -{" "}
                  {addresses.find((a) => a._id === selectedAddress).pincode} (
                  {addresses.find((a) => a._id === selectedAddress).addressType}
                  )
                </>
              ) : (
                "No address selected"
              )}
            </div>
            <div className="font-semibold mb-2 text-gray-700">
              Payment Mode:
            </div>
            <div className="mb-4 text-gray-700">{modeOfPayment}</div>
            <div className="flex justify-between text-lg font-bold border-t pt-4">
              <span>Total</span>
              <span className="text-sky-700">₹{totalPrice}</span>
            </div>
          </div>
          <div className="flex justify-between">
            <button
              className="bg-gray-300 px-6 py-2 rounded-lg"
              onClick={() => setStep(2)}
            >
              Back
            </button>
            <button
              className="bg-gradient-to-r from-green-600 to-green-400 hover:from-green-700 hover:to-green-500 text-white px-6 py-2 rounded-lg shadow font-semibold"
              onClick={handlePlaceOrder}
              disabled={placingOrder}
            >
              {placingOrder ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </div>
      )} */}

      {step === 3 && (
  <div className="flex flex-col md:flex-row gap-8">
    {/* LEFT: Product List */}
    <div className="w-full md:w-2/3">
      <h3 className="text-lg font-bold text-sky-700 mb-2 border-b pb-1">Items</h3>
      <div className="space-y-4">
        {checkoutItems.map(item => {
          const prod = products.find(p => String(p._id) === String(item.productId));
          if (!prod) return null;
          return (
            <div
              key={item.productId}
              className="flex items-center gap-4 bg-sky-50 rounded-2xl p-4 shadow-sm border border-sky-100"
            >
              <img
                src={prod.image}
                alt={prod.name}
                className="w-20 h-20 object-contain rounded-lg border bg-white"
                onError={e => { e.target.src = "https://via.placeholder.com/80x80?text=No+Image"; }}
              />
              <div className="flex-1">
                <div className="font-semibold text-lg text-gray-900">{prod.name}</div>
                <div className="text-sm text-gray-500">
                  {prod.company && <span>{prod.company}</span>}
                  {prod.size && <span> • {prod.size}</span>}
                </div>
                <div className="text-sm text-gray-600 mt-1">Qty: <span className="font-semibold">{item.quantity}</span></div>
                <div className="text-sm text-gray-700 mt-1">
                  Price: ₹{prod.price} × {item.quantity} = <span className="font-bold text-sky-700">₹{prod.price * item.quantity}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>

    {/* RIGHT: Order Summary */}
    <div className="w-full md:w-1/3">
      <div className="bg-white rounded-2xl shadow-lg border border-sky-100 p-6 sticky top-8">
        <h3 className="text-lg font-bold text-sky-700 mb-4">Order Summary</h3>
        <div className="mb-2 flex justify-between text-gray-700">
          <span>Items Total</span>
          <span>₹{totalPrice}</span>
        </div>
        {/* Add delivery charges if any */}
        <div className="mb-2 flex justify-between text-gray-700">
          <span>Delivery</span>
          <span>₹0</span>
        </div>
        <div className="border-t my-3"></div>
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span className="text-sky-700">₹{totalPrice}</span>
        </div>
        <div className="mt-4">
          <div className="font-semibold text-gray-700 mb-1">Delivery Address:</div>
          <div className="text-sm text-gray-600 mb-2">
            {addresses.find(a => a._id === selectedAddress) ? (
              <>
                {addresses.find(a => a._id === selectedAddress).houseNo}, {addresses.find(a => a._id === selectedAddress).street}, {addresses.find(a => a._id === selectedAddress).landmark}, {addresses.find(a => a._id === selectedAddress).city}, {addresses.find(a => a._id === selectedAddress).state} - {addresses.find(a => a._id === selectedAddress).pincode} ({addresses.find(a => a._id === selectedAddress).addressType})
              </>
            ) : "No address selected"}
          </div>
          <div className="font-semibold text-gray-700 mb-1">Payment Mode:</div>
          <div className="text-sm text-gray-600 mb-4">{modeOfPayment}</div>
        </div>
        <button
          className="w-full bg-gradient-to-r from-sky-600 to-sky-400 text-white hover:from-sky-700 hover:to-sky-500 px-6 py-3 rounded-lg shadow font-semibold text-lg transition mb-2"
          onClick={handlePlaceOrder}
          disabled={placingOrder}
        >
          {placingOrder ? "Placing Order..." : "Place Order"}
        </button>
        <button
          className="w-full bg-gray-200 text-gray-700 px-6 py-2 rounded-lg mt-2"
          onClick={() => setStep(2)}
        >
          Back
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default Checkout;
