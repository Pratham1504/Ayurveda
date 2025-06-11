import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { server } from "../main";

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

  if (loading) return <div className="py-10 text-center">Loading...</div>;
  if (error) return <div className="py-10 text-center text-red-500">{error}</div>;
  if (!order) return <div className="py-10 text-center">Order not found.</div>;

  return (
    <div className="max-w-3xl mx-auto py-8 px-2">
      <Link to="/my-orders" className="text-sky-600 hover:underline text-md font-semibold mb-4 inline-block">&larr; Back to My Orders</Link>
      <div className="bg-white border rounded-xl shadow p-4">
        <div className="flex flex-wrap gap-8 items-center mb-4 text-gray-700 text-sm">
          <div>
            <span className="font-semibold">ORDER PLACED</span>
            <div>{new Date(order.createdAt).toLocaleDateString()}</div>
          </div>
          <div>
            <span className="font-semibold">TOTAL</span>
            <div>₹{order.amountPaid}</div>
          </div>
          <div>
            <span className="font-semibold">PAYMENT</span>
            <div>{order.modeOfPayment}</div>
          </div>
          <div className="ml-auto">
            <span className="font-semibold">ORDER #</span>
            <div className="text-xs break-all">{order._id}</div>
          </div>
        </div>
        <div className="mb-2 text-green-700 font-semibold">
          {order.orderStatus === "Order Placed" ? "Arriving Soon" : order.orderStatus}
        </div>
        <hr className="my-2" />

        <div>
          <h3 className="font-semibold mb-2 text-lg">Items</h3>
          <div className="flex flex-col gap-4">
            {order.items.map((item, idx) => (
              <div key={item._id} className="flex gap-4 items-center border-b pb-3 last:border-b-0">
                <img
                  src={item.product?.image}
                  alt={item.product?.name}
                  className="w-20 h-20 object-cover rounded border"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900 text-base">{item.product?.name}</div>
                  <div className="text-xs text-gray-500 mb-1">{item.product?.company} &middot; {item.product?.size}</div>
                  <div className="text-xs text-gray-500 mb-1">Qty: {item.quantity}</div>
                  <div className="text-xs text-gray-500">Price: ₹{item.product?.price} &times; {item.quantity} = <span className="font-semibold text-gray-700">₹{item.product?.price * item.quantity}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <hr className="my-4" />

        <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
          <div>
            <span className="font-semibold">Order Status:</span>{" "}
            <span className="text-green-700">{order.orderStatus}</span>
          </div>
          <div>
            <span className="font-semibold">Total Paid:</span>{" "}
            <span className="text-gray-900 font-bold">₹{order.amountPaid}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;