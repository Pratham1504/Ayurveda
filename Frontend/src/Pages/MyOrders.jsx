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





import { useEffect, useState } from "react";
import axios from "axios";
import { server } from "../main";

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
    <div className="max-w-4xl mx-auto py-8 px-2">
      <h2 className="text-2xl font-bold mb-6">My Orders</h2>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : orders.length === 0 ? (
        <div>No orders found.</div>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-gray-50 border rounded-xl p-4 shadow flex flex-col md:flex-row md:items-start md:justify-between"
            >
              {/* Left: Order Info and Items */}
              <div className="flex-1">
                <div className="flex flex-wrap gap-8 items-center mb-2 text-gray-700 text-sm">
                  <div>
                    <span className="font-semibold">ORDER PLACED</span>
                    <div>{new Date(order.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <span className="font-semibold">TOTAL</span>
                    <div>₹{order.amountPaid}</div>
                  </div>
                  <div>
                    <span className="font-semibold">SHIP TO</span>
                    <div className="text-sky-700 font-medium">You</div>
                  </div>
                  <div className="ml-auto">
                    <span className="font-semibold">ORDER #</span>
                    <div className="text-xs">{order._id}</div>
                  </div>
                </div>
                <hr className="my-2" />
                <div className="text-green-700 font-semibold mb-2">
                  {order.orderStatus === "Order Placed"
                    ? "Arriving Soon"
                    : order.orderStatus}
                </div>
                {/* Items */}
                <div className="flex flex-wrap gap-6 items-center">
                  {order.items &&
                    order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 mb-2">
                        <img
                          src={item.product?.image}
                          alt={item.product?.name}
                          className="w-16 h-16 object-cover rounded border"
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
              <div className="flex flex-col justify-center h-full gap-2 mt-4 md:mt-0 md:ml-8 min-w-[200px]">
                <button className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 rounded-full items-center justify-center">
                  Order Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;