import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/Api";
import AdminLayout from "../AdminLayout";

const ViewSellersProfileDetails = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchUserDetails();// eslint-disable-next-line
  }, []);

  const fetchUserDetails = async () => {
    try {
      const res = await api.get(`/admin/users/${id}`);
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!data) return <div className="p-6 text-center">Loading...</div>;

  const { user, stats } = data;

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">

        {/* USER CARD */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold">
            {user.first_name} {user.last_name}
          </h2>
          <p className="opacity-90">{user.email}</p>

          <div className="mt-3 flex gap-3">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
              user.role === "seller"
                ? "bg-yellow-400 text-black"
                : "bg-green-400 text-black"
            }`}>
              {user.role}
            </span>

            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
              user.status === "approved"
                ? "bg-green-500"
                : user.status === "pending"
                ? "bg-yellow-500"
                : "bg-red-500"
            }`}>
              {user.status}
            </span>
          </div>
        </div>

        {/* SELLER UI */}
        {user.role === "seller" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">

              <StatCard title="Products" value={stats.products} color="blue" />
              <StatCard title="Orders" value={stats.orders} color="purple" />
              <StatCard title="Revenue" value={`₹${stats.revenue}`} color="green" />
              <StatCard title="AOV" value={`₹${stats.aov}`} color="orange" />

            </div>

            {/* ORDER STATUS */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold mb-4">Order Status</h3>

              <div className="flex gap-6">

                <StatusBadge label="Delivered" value={stats.status.delivered} color="green" />
                <StatusBadge label="Pending" value={stats.status.pending} color="yellow" />
                <StatusBadge label="Cancelled" value={stats.status.cancelled} color="red" />

              </div>
            </div>
          </>
        )}

        {/* BUYER UI */}
        {user.role === "buyer" && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">

            <StatCard title="Orders" value={stats.orders} color="blue" />
            <StatCard title="Total Spent" value={`₹${stats.revenue}`} color="green" />
            <StatCard title="Items Bought" value={stats.items} color="purple" />
            <StatCard title="Avg Order Size" value={`₹${stats.avgSize.toFixed(2)}`} color="orange" />

          </div>
        )}

      </div>
    </AdminLayout>
  );
};

/* 🔥 STAT CARD */
const StatCard = ({ title, value, color }) => {
  const colors = {
    blue: "from-blue-500 to-blue-700",
    green: "from-green-500 to-green-700",
    purple: "from-purple-500 to-purple-700",
    orange: "from-orange-400 to-orange-600",
  };

  return (
    <div className={`bg-gradient-to-r ${colors[color]} text-white p-5 rounded-xl shadow-lg text-center`}>
      <h3 className="text-sm opacity-80">{title}</h3>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
};

/* 🔥 STATUS BADGE */
const StatusBadge = ({ label, value, color }) => {
  const colors = {
    green: "bg-green-100 text-green-700",
    yellow: "bg-yellow-100 text-yellow-700",
    red: "bg-red-100 text-red-700",
  };

  return (
    <div className={`px-4 py-2 rounded-lg font-medium ${colors[color]}`}>
      {label}: {value}
    </div>
  );
};

export default ViewSellersProfileDetails;