import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import api from "../../services/Api";

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({});

  const fetchStats = async () => {
    try {
      const res = await api.get("/admin/stats", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
      });

      setStats(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-4 gap-4">
        <Card title="Users" value={stats.users} />

        <Card title="Sellers" value={stats.sellers} />

        <Card title="Buyers" value={stats.buyers} />

        <Card title="Products" value={stats.products} />

        <Card title="Orders" value={stats.orders} />
      </div>
    </AdminLayout>
  );
};

const Card = ({ title, value }) => (
  <div className="bg-white shadow rounded p-4">
    <p className="text-gray-500">{title}</p>

    <h2 className="text-2xl font-bold">{value || 0}</h2>
  </div>
);

export default AdminDashboardPage;
