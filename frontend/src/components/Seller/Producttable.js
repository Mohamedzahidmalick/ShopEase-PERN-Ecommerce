import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Pencil, Trash2 } from "lucide-react";
import api from "../../services/Api";
import { toast } from "react-toastify";
import ActionMenu from "../../Common_Actions_menu";
import Confirmpopup from "../../Confirmpopup";

const ProductTable = ({ products, refresh }) => {
  const navigate = useNavigate();
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [stockFilter, setStockFilter] = useState("all");

  const filteredProducts = products.filter((p) => {
    if (stockFilter === "in") return p.stock > 0;
    if (stockFilter === "out") return p.stock === 0;
    return true;
  });

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteConfirmation(true);
  };
  const deleteProduct = async () => {
    try {
      await api.delete(`/products/delete/${deleteId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("seller_token")}`,
        },
      });

      toast.success("Product deleted");

      setDeleteConfirmation(false);
      setDeleteId(null);

      refresh();
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete product");
    }
  };
  // ---------------- Toggle Active / Inactive ----------------
  const toggleStatus = async (id) => {
    try {
      await api.put(
        `/products/toggle-status/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("seller_token")}`,
          },
        },
      );

      toast.success("Status updated");
      refresh();
    } catch (err) {
      console.error(err);
      if (err.response?.status === 403) {
        toast.error(
          "Product disabled by admin, Contact admin for Futher details!",
        );
      } else {
        toast.error("Failed to update status");
      }
    }
  };
  return (
    <>
      <Confirmpopup
        open={deleteConfirmation}
        onCancel={() => setDeleteConfirmation(false)}
        onConfirm={deleteProduct}
        deleteId={deleteId}
        message="Are you sure you want to delete this product?"
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
              <th className="p-3">Image</th>
              <th className="p-3">Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Created At</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products && products.length > 0 ? (
              filteredProducts.map((item) => (
                <tr
                  key={item.id}
                  className="border-b hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="p-3">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      onError={(e) => (e.target.src = "/no-image.png")}
                      className="table-img w-14 h-14 rounded object-cover border"
                    />
                  </td>

                  <td className="p-3 font-medium">{item.name}</td>
                  <td className="p-3">{item.category}</td>
                  <td className="p-3 product-price">₹{item.price}</td>
                  <td className="p-3">{item.stock}</td>
                  <td>{new Date(item.created_at).toLocaleDateString()}</td>

                  {/* STATUS TOGGLE */}
                  <td className="p-3">
                    <button
                      title={
                        !item.is_active_admin
                          ? "Disabled by admin"
                          : "Toggle status"
                      }
                      onClick={() => {
                        if (!item.is_active_admin) {
                          toast.error(
                            "Product disabled by admin. Contact admin for details.",
                          );

                          return;
                        }

                        toggleStatus(item.id);
                      }}
                      className={`relative w-14 h-7 rounded-full transition

    ${
      !item.is_active_admin
        ? "bg-red-600 cursor-not-allowed opacity-80"
        : !item.is_active_seller
          ? "bg-red-500"
          : "bg-green-500"
    }

  `}
                    >
                      <span
                        className={`absolute top-1 w-5 h-5 bg-white rounded-full transition

    ${item.is_active_admin && item.is_active_seller ? "right-1" : "left-1"}

  `}
                      />
                    </button>
                  </td>

                  <td className="p-3 text-center">
                    <ActionMenu>
                      <button
                        onClick={() =>
                          navigate(`/seller/products/view/${item.id}`)
                        }
                        className=" text-blue-600 flex items-center gap-2 px-4 py-2 hover:bg-gray-100 w-full text-left"
                      >
                        <Eye size={16} /> View
                      </button>

                      <button
                        onClick={() =>
                          navigate(`/seller/products/edit/${item.id}`)
                        }
                        className="text-green-600 flex items-center gap-2 px-4 py-2 hover:bg-gray-100 w-full text-left"
                      >
                        <Pencil size={16} /> Edit
                      </button>

                      <button
                        onClick={() => handleDeleteClick(item.id)}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-red-600 w-full text-left"
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </ActionMenu>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ProductTable;
