// import { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import axios from "axios";
// import { server } from "../main";

// const OrderDetail = () => {
//   const { id } = useParams();
//   const [order, setOrder] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchOrder = async () => {
//       setLoading(true);
//       setError("");
//       try {
//         const { data } = await axios.get(`${server}/api/orders/my-orders/${id}`, {
//           headers: {
//             token: localStorage.getItem("token"),
//           },
//         });
//         setOrder(data);
//       } catch (err) {
//         setError("Failed to fetch order details");
//       }
//       setLoading(false);
//     };
//     fetchOrder();
//   }, [id]);

//   if (loading) return <div className="py-10 text-center">Loading...</div>;
//   if (error) return <div className="py-10 text-center text-red-500">{error}</div>;
//   if (!order) return <div className="py-10 text-center">Order not found.</div>;

//   return (
//     <div className="max-w-3xl mx-auto py-8 px-2">
//       <Link to="/my-orders" className="text-sky-600 hover:underline text-md font-semibold mb-4 inline-block">&larr; Back to My Orders</Link>
//       <div className="bg-white border rounded-xl shadow p-4">
//         <div className="flex flex-wrap gap-8 items-center mb-4 text-gray-700 text-sm">
//           <div>
//             <span className="font-semibold">ORDER PLACED</span>
//             <div>{new Date(order.createdAt).toLocaleDateString()}</div>
//           </div>
//           <div>
//             <span className="font-semibold">TOTAL</span>
//             <div>₹{order.amountPaid}</div>
//           </div>
//           <div>
//             <span className="font-semibold">PAYMENT</span>
//             <div>{order.modeOfPayment}</div>
//           </div>
//           <div className="ml-auto">
//             <span className="font-semibold">ORDER #</span>
//             <div className="text-xs break-all">{order._id}</div>
//           </div>
//         </div>
//         <div className="mb-2 text-green-700 font-semibold">
//           {order.orderStatus === "Order Placed" ? "Arriving Soon" : order.orderStatus}
//         </div>
//         <hr className="my-2" />

//         <div>
//           <h3 className="font-semibold mb-2 text-lg">Items</h3>
//           <div className="flex flex-col gap-4">
//             {order.items.map((item, idx) => (
//               <div key={item._id} className="flex gap-4 items-center border-b pb-3 last:border-b-0">
//                 <img
//                   src={item.product?.image}
//                   alt={item.product?.name}
//                   className="w-20 h-20 object-cover rounded border"
//                 />
//                 <div className="flex-1">
//                   <div className="font-medium text-gray-900 text-base">{item.product?.name}</div>
//                   <div className="text-xs text-gray-500 mb-1">{item.product?.company} &middot; {item.product?.size}</div>
//                   <div className="text-xs text-gray-500 mb-1">Qty: {item.quantity}</div>
//                   <div className="text-xs text-gray-500">Price: ₹{item.product?.price} &times; {item.quantity} = <span className="font-semibold text-gray-700">₹{item.product?.price * item.quantity}</span></div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <hr className="my-4" />

//         <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
//           <div>
//             <span className="font-semibold">Order Status:</span>{" "}
//             <span className="text-green-700">{order.orderStatus}</span>
//           </div>
//           <div>
//             <span className="font-semibold">Total Paid:</span>{" "}
//             <span className="text-gray-900 font-bold">₹{order.amountPaid}</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrderDetail;



import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { server } from "../main";
import { ArrowLeftIcon, CubeTransparentIcon } from "@heroicons/react/24/outline";

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await axios.get(`${server}/api/orders/my-orders/${id}`, {
          headers: {
            token: localStorage.getItem("token"),
          },
        });
        setOrder(data);
      } catch (err) {
        setError("Failed to fetch order details");
      }
      setLoading(false);
    };
    fetchOrder();
  }, [id]);

  if (loading)
    return (
      <div className="py-16 flex flex-col items-center text-sky-600">
        <svg className="animate-spin h-8 w-8 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
        </svg>
        Loading order details...
      </div>
    );
  if (error)
    return (
      <div className="py-16 text-center text-red-500 font-semibold">{error}</div>
    );
  if (!order)
    return (
      <div className="py-16 text-center text-gray-500">
        <CubeTransparentIcon className="h-10 w-10 mx-auto mb-2 text-sky-200" />
        Order not found.
      </div>
    );

  // Status color
  let statusColor =
    order.orderStatus === "Delivered"
      ? "text-green-700"
      : order.orderStatus === "Cancelled"
      ? "text-red-600"
      : "text-yellow-600";

  return (
    <div className="max-w-4xl mx-auto py-10 px-2 sm:px-6">
      <Link
        to="/my-orders"
        className="inline-flex items-center gap-1 text-sky-600 hover:underline text-md font-semibold mb-6"
      >
        <ArrowLeftIcon className="h-5 w-5" />
        Back to My Orders
      </Link>
      <div className="bg-white border border-sky-100 rounded-2xl shadow-xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <CubeTransparentIcon className="h-7 w-7 text-sky-600" />
          <h2 className="text-2xl font-bold text-sky-700 tracking-tight">
            Order Details
          </h2>
        </div>
        <div className="flex flex-wrap gap-8 items-center mb-4 text-gray-700 text-sm">
          <div>
            <span className="font-semibold text-sky-700">ORDER PLACED</span>
            <div>{new Date(order.createdAt).toLocaleDateString()}</div>
          </div>
          <div>
            <span className="font-semibold text-sky-700">TOTAL</span>
            <div>₹{order.amountPaid}</div>
          </div>
          <div>
            <span className="font-semibold text-sky-700">PAYMENT</span>
            <div>{order.modeOfPayment}</div>
          </div>
          <div className="ml-auto">
            <span className="font-semibold text-sky-700">ORDER ID</span>
            <div className="text-sm break-all">
              #{order._id?.slice(-6) || ""}
            </div>
          </div>
        </div>
        <div className={`mb-2 font-semibold ${statusColor}`}>
          {order.orderStatus === "Order Placed"
            ? "Arriving Soon"
            : order.orderStatus}
        </div>
        <hr className="my-4 border-sky-100" />

        <div>
          <h3 className="font-semibold mb-3 text-lg text-sky-700">Items</h3>
          <div className="flex flex-col gap-4">
            {order.items.map((item, idx) => (
              <div
                key={item._id}
                className="flex gap-4 items-center bg-sky-50 rounded-xl p-3 shadow-sm border border-sky-100"
              >
                <img
                  src={item.product?.image}
                  alt={item.product?.name}
                  className="w-20 h-20 object-cover rounded border border-sky-200 bg-white"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900 text-base">
                    {item.product?.name}
                  </div>
                  <div className="text-xs text-gray-500 mb-1">
                    {item.product?.company} &middot; {item.product?.size}
                  </div>
                  <div className="text-xs text-gray-500 mb-1">
                    Qty: {item.quantity}
                  </div>
                  <div className="text-xs text-gray-500">
                    Price: ₹{item.product?.price} &times; {item.quantity} ={" "}
                    <span className="font-semibold text-gray-700">
                      ₹{item.product?.price * item.quantity}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <hr className="my-6 border-sky-100" />

        <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
          <div>
            <span className="font-semibold text-sky-700">Order Status:</span>{" "}
            <span className={statusColor}>{order.orderStatus}</span>
          </div>
          <div>
            <span className="font-semibold text-sky-700">Total Paid:</span>{" "}
            <span className="text-gray-900 font-bold">₹{order.amountPaid}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;