// import { useEffect, useState } from "react";
// import axios from "axios";
// import { server } from "../main";

// const MyOrders = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchOrders = async () => {
//       setLoading(true);
//       setError("");
//       try {
//         const { data } = await axios.get(`${server}/api/orders/my-orders`, {
//           headers: {
//             token: localStorage.getItem("token"),
//           },
//         });
//         setOrders(data.orders || []);
//       } catch (err) {
//         setError("Failed to fetch orders");
//       }
//       setLoading(false);
//     };
//     fetchOrders();
//   }, []);

//   return (
//     <div className="max-w-3xl mx-auto py-8 px-4">
//       <h2 className="text-2xl font-bold mb-6">My Orders</h2>
//       {loading ? (
//         <div>Loading...</div>
//       ) : error ? (
//         <div className="text-red-500">{error}</div>
//       ) : orders.length === 0 ? (
//         <div>No orders found.</div>
//       ) : (
//         <div className="space-y-6">
//           {orders.map((order) => (
//             <div key={order._id} className="border rounded-lg p-4 shadow">
//               <div className="mb-2">
//                 <span className="font-semibold">Order ID:</span> {order._id}
//               </div>
//               <div className="mb-2">
//                 <span className="font-semibold">Status:</span> {order.status}
//               </div>
//               <div className="mb-2">
//                 <span className="font-semibold">Date:</span>{" "}
//                 {new Date(order.createdAt).toLocaleString()}
//               </div>
//               <div>
//                 <span className="font-semibold">Items:</span>
//                 <ul className="list-disc ml-6">
//                   {order.items && order.items.map((item, idx) => (
//                     <li key={idx}>
//                       {item.name} x {item.quantity}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//               <div className="mt-2">
//                 <span className="font-semibold">Total:</span> ₹{order.total}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyOrders;



// import { useEffect, useState } from "react";
// import axios from "axios";
// import { server } from "../main";

// const MyOrders = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchOrders = async () => {
//       setLoading(true);
//       setError("");
//       try {
//         const { data } = await axios.get(`${server}/api/orders/my-orders`, {
//           headers: {
//             token: localStorage.getItem("token"),
//           },
//         });
//         setOrders(Array.isArray(data) ? data : data.orders || []);
//       } catch (err) {
//         setError("Failed to fetch orders");
//       }
//       setLoading(false);
//     };
//     fetchOrders();
//   }, []);

//   return (
//     <div className="max-w-3xl mx-auto py-8 px-4">
//       <h2 className="text-2xl font-bold mb-6">My Orders</h2>
//       {loading ? (
//         <div>Loading...</div>
//       ) : error ? (
//         <div className="text-red-500">{error}</div>
//       ) : orders.length === 0 ? (
//         <div>No orders found.</div>
//       ) : (
//         <div className="space-y-6">
//           {orders.map((order) => (
//             <div key={order._id} className="border rounded-lg p-4 shadow">
//               <div className="mb-2">
//                 <span className="font-semibold">Order ID:</span> {order._id}
//               </div>
//               <div className="mb-2">
//                 <span className="font-semibold">Status:</span> {order.orderStatus}
//               </div>
//               <div className="mb-2">
//                 <span className="font-semibold">Date:</span>{" "}
//                 {new Date(order.createdAt).toLocaleString()}
//               </div>
//               <div>
//                 <span className="font-semibold">Items:</span>
//                 <ul className="list-disc ml-6">
//                     {order.items && order.items.map((item, idx) => (
//                         <li key={idx} className="flex items-center gap-3 mb-2">
//                         <img
//                             src={item.product?.image}
//                             alt={item.product?.name}
//                             className="w-12 h-12 object-cover rounded border"
//                         />
//                         <span>
//                             {item.product?.name || "-"} x {item.quantity}
//                         </span>
//                         </li>
//                     ))}
//                 </ul>
//               </div>
//               <div className="mt-2">
//                 <span className="font-semibold">Total:</span> ₹{order.amountPaid}
//               </div>
//               <div>
//                 <span className="font-semibold">Payment Mode:</span> {order.modeOfPayment}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyOrders;


// *************************************************************************


// import { useEffect, useState } from "react";
// import axios from "axios";
// import { server } from "../main";
// import { Link } from "react-router-dom";
// // import { Toaster } from "react-hot-toast";
// // import { useContext } from "react";
// // import { UserContext } from "../Context/UserContext";

// const MyOrders = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchOrders = async () => {
//       setLoading(true);
//       setError("");
//       try {
//         const { data } = await axios.get(`${server}/api/orders/my-orders`, {
//           headers: {
//             token: localStorage.getItem("token"),
//           },
//         });
//         setOrders(Array.isArray(data) ? data : data.orders || []);
//       } catch (err) {
//         setError("Failed to fetch orders");
//       }
//       setLoading(false);
//     };
//     fetchOrders();
//   }, []);

//   return (
//     <div className="max-w-4xl mx-auto py-8 px-2">
//       <h2 className="text-2xl font-bold mb-6">My Orders</h2>
//       {loading ? (
//         <div>Loading...</div>
//       ) : error ? (
//         <div className="text-red-500">{error}</div>
//       ) : orders.length === 0 ? (
//         <div>No orders found.</div>
//       ) : (
//         <div className="space-y-8">
//           {orders.map((order) => (
//             <div
//               key={order._id}
//               className="bg-gray-50 border rounded-xl p-4 shadow flex flex-col md:flex-row md:items-start md:justify-between"
//             >
//               {/* Left: Order Info and Items */}
//               <div className="flex-1">
//                 <div className="flex flex-wrap gap-8 items-center mb-2 text-gray-700 text-sm">
//                   <div>
//                     <span className="font-semibold">ORDER PLACED</span>
//                     <div>{new Date(order.createdAt).toLocaleDateString()}</div>
//                   </div>
//                   <div>
//                     <span className="font-semibold">TOTAL</span>
//                     <div>₹{order.amountPaid}</div>
//                   </div>
//                   <div>
//                     <span className="font-semibold">SHIP TO</span>
//                     <div className="text-sky-700 font-medium">You</div>
//                   </div>
//                   <div className="ml-auto">
//                     <span className="font-semibold">ORDER #</span>
//                     <div className="text-xs">{order._id}</div>
//                   </div>
//                 </div>
//                 <hr className="my-2" />
//                 <div className="text-green-700 font-semibold mb-2">
//                   {order.orderStatus === "Order Placed"
//                     ? "Arriving Soon"
//                     : order.orderStatus}
//                 </div>
//                 {/* Items */}
//                 <div className="flex flex-wrap gap-6 items-center">
//                   {order.items &&
//                     order.items.map((item, idx) => (
//                       <div key={idx} className="flex items-center gap-3 mb-2">
//                         <img
//                           src={item.product?.image}
//                           alt={item.product?.name}
//                           className="w-16 h-16 object-cover rounded border"
//                         />
//                         <div>
//                           <div className="font-medium text-gray-900">
//                             {item.product?.name || "-"}
//                           </div>
//                           <div className="text-xs text-gray-500">
//                             Qty: {item.quantity}
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                 </div>
//               </div>

//               {/* Right: Actions */}
//               <div className="flex flex-col justify-center h-full gap-2 mt-4 md:mt-0 md:ml-8 min-w-[200px]">
//                 <button className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 rounded-full items-center justify-center">
//                   <Link to={`/my-orders/${order._id}`}>Order Details</Link>
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyOrders;



import { useEffect, useState } from "react";
import axios from "axios";
import { server } from "../main";
import { Link } from "react-router-dom";
import { CubeTransparentIcon } from "@heroicons/react/24/outline";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await axios.get(`${server}/api/orders/my-orders`, {
          headers: {
            token: localStorage.getItem("token"),
          },
        });
        setOrders(Array.isArray(data) ? data : data.orders || []);
      } catch (err) {
        setError("Failed to fetch orders");
      }
      setLoading(false);
    };
    fetchOrders();
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-10 px-2 sm:px-6">
      <div className="flex items-center gap-3 mb-8">
        <CubeTransparentIcon className="h-8 w-8 text-sky-600" />
        <h2 className="text-3xl font-extrabold text-sky-700 tracking-tight">My Orders</h2>
      </div>
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <svg className="animate-spin h-8 w-8 text-sky-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
          </svg>
          <span className="text-sky-600 font-semibold">Loading your orders...</span>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 text-gray-500 text-lg">
          <CubeTransparentIcon className="h-12 w-12 mx-auto mb-2 text-sky-200" />
          No orders found.
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white border border-sky-100 rounded-2xl p-6 shadow-lg flex flex-col md:flex-row md:items-start md:justify-between hover:shadow-2xl transition"
            >
              {/* Left: Order Info and Items */}
              <div className="flex-1">
                <div className="flex flex-wrap gap-8 items-center mb-2 text-gray-700 text-sm">
                  <div>
                    <span className="font-semibold text-sky-700">ORDER PLACED</span>
                    <div>{new Date(order.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <span className="font-semibold text-sky-700">TOTAL</span>
                    <div>₹{order.amountPaid}</div>
                  </div>
                  <div>
                    <span className="font-semibold text-sky-700">SHIP TO</span>
                    <div className="text-sky-700 font-medium">You</div>
                  </div>
                  <div className="ml-auto">
                    <span className="font-semibold text-sky-700">ORDER #</span>
                    <div className="text-xs break-all">{order._id}</div>
                  </div>
                </div>
                <hr className="my-2 border-sky-100" />
                <div className={`mb-2 font-semibold ${
                  order.orderStatus === "Delivered"
                    ? "text-green-700"
                    : order.orderStatus === "Cancelled"
                    ? "text-red-600"
                    : "text-yellow-600"
                }`}>
                  {order.orderStatus === "Order Placed"
                    ? "Arriving Soon"
                    : order.orderStatus}
                </div>
                {/* Items */}
                <div className="flex flex-wrap gap-6 items-center">
                  {order.items &&
                    order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 mb-2 bg-sky-50 rounded-xl p-2 pr-4 shadow-sm">
                        <img
                          src={item.product?.image}
                          alt={item.product?.name}
                          className="w-16 h-16 object-cover rounded border border-sky-100 bg-white"
                        />
                        <div>
                          <div className="font-medium text-gray-900">
                            {item.product?.name || "-"}
                          </div>
                          <div className="text-xs text-gray-500">
                            Qty: {item.quantity}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex flex-col justify-center h-full gap-2 mt-6 md:mt-0 md:ml-8 min-w-[200px]">
                <Link
                  to={`/my-orders/${order._id}`}
                  className="bg-gradient-to-r from-sky-600 to-sky-400 hover:from-sky-700 hover:to-sky-500 text-white font-semibold py-2 rounded-xl shadow text-center transition"
                >
                  View Details
                </Link>
                <div className="mt-2 text-xs text-gray-500 text-center">
                  Payment: <span className="font-semibold text-gray-700">{order.modeOfPayment}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;