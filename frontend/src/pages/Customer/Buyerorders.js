import React, { useEffect, useState } from "react";
import BuyerLayout from "../../components/BuyerLayout";
import api from "../../services/Api";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";

const BuyerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("month");
  const navigate = useNavigate();

  const fetchOrders = async (selectedFilter = filter) => {
    try {
      setLoading(true);
      const start = Date.now();
      const res = await api.get(`/cart/orders?filter=${selectedFilter}`);
      const elapsed = Date.now() - start;
      const delay = Math.max(300 - elapsed, 0); // Ensure at least 300ms loading time
      setTimeout(() => {
        setOrders(res.data);
        setLoading(false);
      }, delay);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(filter); // eslint-disable-next-line
  }, [filter]);

  return (
    <BuyerLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold">My Orders</h1>

        {/* FILTER */}
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="today">Today</option>
          <option value="yesterday">Yesterday</option>
          <option value="week">Last 1 Week</option>
          <option value="month">Last 1 Month</option>
          <option value="6months">Last 6 Months</option>
          <option value="all">All Orders</option>
        </select>

        {/* ORDERS */}
        {loading ? (
          <div className="flex justify-center">
            <Loader />
          </div>
        ) : orders.length === 0 ? (
          <p className="text-gray-500">No orders yet.</p>
        ) : (
          orders.map((order) => (
            <div
              key={order.order_id}
              className="bg-white dark:bg-[#161b22] shadow-lg rounded-xl p-6 border card card-glow cursor-pointer hover:shadow-xl transition"
              
              //  FIXED HERE
              onClick={() =>
                navigate(`/buyer/order/${order.order_id}`)
              }
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-lg">
                    Order #{order.order_id}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xl font-bold text-indigo-600">
                    ₹{order.total_amount}
                  </p>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">
                    {order.status || "Pending"}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </BuyerLayout>
  );
};

export default BuyerOrders;