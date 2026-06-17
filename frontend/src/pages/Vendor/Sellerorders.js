import React, { useEffect, useState } from "react";
import SellerLayout from "../../components/SellerLayout";
import api from "../../services/Api";
import { toast } from "react-toastify";
import { ChevronDown } from "lucide-react";
import Loader from "../../components/Loader";

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openOrder, setOpenOrder] = useState(null);
  const toggleOrder = (id) => {
    setOpenOrder(openOrder === id ? null : id);
  };
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const start = Date.now();
      const res = await api.get("/orders/seller", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("seller_token")}`,
        },
      });

      //  GROUPING PRODUCTS INTO ORDERS
      const grouped = {};

      res.data.forEach((item) => {
        if (!grouped[item.order_id]) {
          grouped[item.order_id] = {
            order_id: item.order_id,
            status: item.status,
            items: [],
          };
        }

        grouped[item.order_id].items.push(item);
      });

      const elapsed = Date.now() - start;
      const delay = Math.max(300 - elapsed, 0); // Ensure at least 300ms loading time
      setTimeout(() => {
        setOrders(Object.values(grouped));
        setLoading(false);
      }, delay);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(
        `/orders/seller/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("seller_token")}`,
          },
        },
      );

      toast.success("Status Updated");
      fetchOrders();
    } catch (err) {
      toast.error("Failed");
      setLoading(false);
    }
  };

  const fixImageURL = (url) => {
    if (!url) return "/no-image.png";
    if (url.startsWith("http")) return url;
    return `http://localhost:3000${url}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Confirmed":
        return "bg-blue-100 text-blue-700";
      case "Shipped":
        return "bg-purple-100 text-purple-700";
      case "Delivered":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <SellerLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Seller Orders</h1>

        {loading ? (
          <div className="flex justify-center">
            <Loader />
          </div>
        ) : orders.length === 0 ? (
          <p>No orders found</p>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => (
              <div
                key={order.order_id}
                className="relative z-0 bg-white rounded-xl shadow overflow-hidden card-glow"
              >
                {/*  HEADER (CLICKABLE) */}
                <div
                  onClick={() => toggleOrder(order.order_id)}
                  className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50 transition transform hover:scale-[1.01]"
                >
                  <div>
                    <h2 className="font-bold text-lg">
                      Order {order.order_id}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {order.items.length} items
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* STATUS */}
                    <span
                      className={`px-3 py-1 rounded text-sm ${getStatusColor(
                        order.status,
                      )}`}
                    >
                      {order.status}
                    </span>

                    {/* ICON */}
                    <ChevronDown
                      className={`transition-transform duration-300 ${
                        openOrder === order.order_id ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </div>

                {/*  DROPDOWN CONTENT */}
                <div
                  className={`transition-all  duration-500 ease-in-out overflow-hidden border-t ${
                    openOrder === order.order_id
                      ? "max-h-[600px] opacity-100 p-4"
                      : "max-h-0 opacity-0 p-0"
                  }`}
                >
                  <div className="space-y-4">
                    {/* STATUS CHANGE */}
                    <div className="flex justify-end">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateStatus(order.order_id, e.target.value)
                        }
                        className="border px-3 py-1 rounded"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </div>

                    {/* PRODUCTS */}
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-4 items-center border p-3 rounded-lg"
                      >
                        <img
                          src={fixImageURL(item.image_url)}
                          className="w-16 h-16 rounded object-cover"
                          alt=""
                        />

                        <div>
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-sm text-gray-500">
                            Qty: {item.quantity}
                          </p>
                          <p className="text-blue-600 font-bold">
                            ₹{item.price}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </SellerLayout>
  );
};

export default SellerOrders;
