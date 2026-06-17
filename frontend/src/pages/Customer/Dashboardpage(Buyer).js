import React from "react";
import Buyerlayout from "../../components/BuyerLayout";
import { useEffect, useState } from "react";
import api from "../../services/Api";
const Dashboardpage = () => {
  const [stats, setStats] = useState({});

  useEffect(() => {
    api
      .get("/products/buyer-dashboardpage", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("buyer_token")}`,
        },
      })
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Buyer dashboard error:", err.response?.data));
  }, []);
  return (
    <Buyerlayout>
      <div className="p-6 card card-glow">
        <h1 className="text-3xl font-bold">Buyer Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Overview of your sales, products & revenue.
        </p>

        <div className="rid grid-cols-4 gap-4 mt-6">
          <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="bg-white p-4 rounded shadow dark:bg-[#161b22]">
            <h2 className="font-semibold card-label">Total Orders</h2>
            <p className="card-number"><h2>{stats.total_orders}</h2></p>
          </div>

          <div className="bg-white p-4 rounded shadow dark:bg-[#161b22]">
            <h2 className="font-semibold card-label">Pending Orders</h2>
            <p className="card-number"><h2>{stats.pending_orders}</h2></p>
          </div>

          <div className="bg-white p-4 rounded shadow dark:bg-[#161b22]">
            <h2 className="font-semibold card-label">Completed Orders</h2>
            <p className="card-number"><h2>{stats.completed_orders}</h2></p>
          </div>

          <div className="bg-white p-4 rounded shadow dark:bg-[#161b22]">
            <h2 className="font-semibold card-label">Wishlist Items</h2>
            <p className="card-number"><h2>{stats.wishlist_count}</h2></p>
          </div>
        </div>
      </div>
      </div>
    </Buyerlayout>
  );
};

export default Dashboardpage;
