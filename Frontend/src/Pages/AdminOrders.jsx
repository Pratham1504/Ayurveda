import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { motion, AnimatePresence } from 'framer-motion';
import { server } from '../main';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [priceRange, setPriceRange] = useState('All');
  const [sortOption, setSortOption] = useState('Newest');

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(`${server}/api/orders/all`, {
        headers: {
          token: localStorage.getItem('token'),
        },
      });
      const fetchedOrders = Array.isArray(data) ? data : data.orders || [];
      const normalizedOrders = fetchedOrders.map((order) => ({
        ...order,
        user: typeof order.user === 'object' && order.user !== null ? order.user : {},
        items: Array.isArray(order.items)
          ? order.items.map((item) => ({
              ...item,
              product: typeof item.product === 'object' && item.product !== null ? item.product : { name: 'Product' },
            }))
          : [],
      }));
      setOrders(normalizedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

  const filteredOrders = orders.filter((order) => {
    const statusMatch = statusFilter === 'All' || order.orderStatus === statusFilter;
    const priceMatch =
      priceRange === 'All' ||
      (priceRange === '<500' && order.amountPaid < 500) ||
      (priceRange === '500-1000' && order.amountPaid >= 500 && order.amountPaid <= 1000) ||
      (priceRange === '>1000' && order.amountPaid > 1000);
    return statusMatch && priceMatch;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortOption === 'Oldest') return new Date(a.createdAt) - new Date(b.createdAt);
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const handleStatusChange = (orderId, newStatus) => {
    // Implement API call to update order status here
    console.log('Change status for order', orderId, 'to', newStatus);
  };

  const handleRefund = (orderId) => {
    // Implement API call to trigger refund here
    console.log('Refund requested for order', orderId);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-full lg:w-2/3 p-6">
        <h1 className="text-2xl font-bold mb-4 text-black">Orders</h1>

        <div className="flex gap-4 mb-4 flex-wrap">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 border border-gray-300 rounded-xl bg-white"
          >
            <option value="All">All Statuses</option>
            <option value="Order Placed">Order Placed</option>
            <option value="Order Confirmed">Order Confirmed</option>
            <option value="In Transit">In Transit</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Refund Issued">Refund Issued</option>
            <option value="Refunded">Refunded</option>
          </select>

          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="p-2 border border-gray-300 rounded-xl bg-white"
          >
            <option value="All">All Prices</option>
            <option value="<500">Below ₹500</option>
            <option value="500-1000">₹500-₹1000</option>
            <option value=">1000">Above ₹1000</option>
          </select>

          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="p-2 border border-gray-300 rounded-xl bg-white"
          >
            <option value="Newest">Newest First</option>
            <option value="Oldest">Oldest First</option>
          </select>
        </div>

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left font-semibold text-gray-600">Order ID</th>
                <th className="p-3 text-left font-semibold text-gray-600">Status</th>
                <th className="p-3 text-left font-semibold text-gray-600">Amount</th>
                <th className="p-3 text-left font-semibold text-gray-600">Date</th>
                <th className="p-3 text-left font-semibold text-gray-600"></th>
              </tr>
            </thead>
            <tbody>
              {sortedOrders.map((order) => (
                <tr
                  key={order._id}
                  className="hover:bg-gray-100 cursor-pointer"
                  onClick={() => setSelectedOrder(order)}
                >
                  <td className="p-3 text-black font-medium">#{order._id?.slice(-6)?.toUpperCase()}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        order.orderStatus.includes('Cancelled') || order.orderStatus.includes('Refund')
                          ? 'bg-red-100 text-red-700'
                          : order.orderStatus === 'Delivered'
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="p-3 text-black">{formatCurrency(order.amountPaid)}</td>
                  <td className="p-3 text-black">{moment(order.createdAt).format('MMM D')}</td>
                  <td className="p-3 text-right">
                    <span className="text-sky-500 font-semibold">View</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            className="w-full lg:w-1/3 bg-white shadow-xl p-6 overflow-y-auto border-l border-gray-200"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-black">
                Order #{selectedOrder._id?.slice(-6)?.toUpperCase()}
              </h2>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-500 hover:text-black">
                ✕
              </button>
            </div>

            <p className="text-sm text-gray-500 mb-2">
              {moment(selectedOrder.createdAt).format('MMM D, HH:mm')}
            </p>

            <div className="mb-4">
              <h3 className="font-semibold text-black mb-1">Customer Info</h3>
              <p className="text-sm text-gray-800">{selectedOrder.user?.fullName}</p>
              <p className="text-sm text-gray-600">{selectedOrder.user?.email}</p>
              <p className="text-sm text-gray-600">{selectedOrder.user?.mobileNo}</p>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold text-black mb-2">Order items</h3>
              <ul className="space-y-3">
                {selectedOrder.items?.map((item, idx) => (
                  <li key={idx} className="flex justify-between text-sm">
                    <span>{item?.product?.name || 'Product'}</span>
                    <span className="text-gray-500">x{item?.quantity}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-700">
                Mode of Payment: <strong>{selectedOrder.modeOfPayment}</strong>
              </p>
              {selectedOrder.transactionId && (
                <p className="text-sm text-gray-700">
                  Transaction ID: <strong>{selectedOrder.transactionId}</strong>
                </p>
              )}
              {selectedOrder.paymentScreenshot && (
                <a
                  href={selectedOrder.paymentScreenshot}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-sky-600 underline"
                >
                  View payment screenshot
                </a>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-black mb-1">Change Status</label>
              <select
                onChange={(e) => handleStatusChange(selectedOrder._id, e.target.value)}
                defaultValue={selectedOrder.orderStatus}
                className="w-full border rounded-xl p-2 bg-gray-50 text-sm"
              >
                <option value="Order Placed">Order Placed</option>
                <option value="Order Confirmed">Order Confirmed</option>
                <option value="In Transit">In Transit</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Refund Issued">Refund Issued</option>
                <option value="Refunded">Refunded</option>
              </select>
            </div>

            <button
              onClick={() => handleRefund(selectedOrder._id)}
              className="w-full bg-red-100 text-red-600 font-semibold py-2 rounded-xl text-sm hover:bg-red-200"
            >
              Request Refund
            </button>

            <div className="font-semibold text-lg text-black mt-4">
              Total: {formatCurrency(selectedOrder.amountPaid)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrderList;
