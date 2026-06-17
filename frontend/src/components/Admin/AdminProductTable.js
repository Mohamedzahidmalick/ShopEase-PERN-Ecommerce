import React, { useState } from "react";
import api from "../../services/Api";
import { Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import Confirmpopup from "../../Confirmpopup";

const AdminProductTable = ({ products, refresh }) => {
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [stockFilter, setStockFilter] = useState("all");

  const filteredProducts = products.filter((p) => {
  if (stockFilter === "in") return p.stock > 0;
  if (stockFilter === "out") return p.stock === 0;
  return true;
});

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setOpen(true);
  };

  const deleteProduct = async () => {
    try {
      await api.delete(`/admin/products/${deleteId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
      });

      toast.success("Deleted");

      setOpen(false);

      refresh();
    } catch (err) {
      toast.error("Delete failed");
    }
  };
  const toggleStatus = async (id) => {
    try {
      const res = await api.put(
        `/admin/products/toggle/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          },
        },
      );

      toast.success(res.data.message);

      refresh();
    } catch {
      toast.error("Failed");
    }
  };

  return (
    <>
      <Confirmpopup
        open={open}
        onCancel={() => setOpen(false)}
        onConfirm={deleteProduct}
        message="Delete product?"
      />

      <div className="bg-white dark:bg-[#161b22] shadow rounded-lg p-4 mt-4 overflow-visible relative">
        <select
  value={stockFilter}
  onChange={(e) => setStockFilter(e.target.value)}
  className="border px-3 py-2 rounded mb-4"
>
  <option value="all">All</option>
  <option value="in">In Stock</option>
  <option value="out">Out of Stock</option>
</select>
        <table className="w-full table-auto table-custom">
          <thead>
            <tr className="bg-gray-100 dark:bg-[#1a1f25] text-gray-600 dark:text-gray-400 text-left uppercase text-sm">
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th className="text-center">Stock</th>
              <th className="text-center">Seller</th>
              <th className="text-center">Created at</th>
              <th className="text-center">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.map((p) => (
              <tr
                key={p.id}
                className="border-b hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td className="text-center">
                  <img
                    src={p.image_url}
                    alt=""
                    className="table-img w-14 h-14 rounded object-cover border"
                    onError={(e) => (e.target.src = "/no-image.png")}
                  />
                </td>

                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>₹{p.price}</td>
                <td className=" p-3 text-center">{p.stock}</td>
                <td>{p.seller_name}</td>
                <td className="p-3 text-center">
                  {new Date(p.created_at).toLocaleDateString()}
                </td>

                <td>
                  <button
                    onClick={() => toggleStatus(p.id)}
                    className={`relative w-14 h-7 rounded-full transition
    ${p.is_active_admin ? "bg-green-500" : "bg-red-500"}
  `}
                  >
                    <span
                      className={`absolute top-1 w-5 h-5 bg-white rounded-full transition
    ${p.is_active_admin ? "right-1" : "left-1"}
  `}
                    />
                  </button>
                </td>

                <td className="p-3 text-center">
                  <button
                    onClick={() => handleDeleteClick(p.id)}
                    className="text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AdminProductTable;
