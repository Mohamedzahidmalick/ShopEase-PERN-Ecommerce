import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BuyerLayout from "../../components/BuyerLayout";
import api from "../../services/Api";
import Loader from "../../components/Loader";

const BuyerOrderDetails = () => {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      console.error("Order ID is missing in URL");
      return;
    }

    const fetchDetails = async () => {
     setLoading(true);
    const start = Date.now();
      try {
        const res = await api.get(`/orders/order-details/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("buyer_token")}`,
          },
        });

        console.log("API response:", res.data);
        const elapsed = Date.now() - start;
      const delay = Math.max(300 - elapsed, 0); // Ensure at least 500ms loading time
      setTimeout(() => {
        setOrder(res.data.order);
        setItems(res.data.items);
        setLoading(false);
      },delay);
      } catch (error) {
        console.error("Error fetching order details:", error);
        setLoading(false); //  stop loader
      }
    };

    fetchDetails();
  }, [id]);

  //  optional debug (keep if needed)
  const decodeToken = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch {
      return null;
    }
  };

  const token = localStorage.getItem("buyer_token");
  console.log(decodeToken(token));

  //  LOADER UI
  if (loading) {
    return (
      <BuyerLayout>
        <div className="p-10 flex justify-center">
          <Loader/>
        </div>
      </BuyerLayout>
    );
  }

  //  NO ORDER
  if (!loading && !order) {
    return (
      <BuyerLayout>
        <div className="p-6 text-center text-gray-500">
          Order not found
        </div>
      </BuyerLayout>
    );
  }

  //  STATUS STYLE
  const getStatusColor = (status) => {
    if (status === "Pending") return "bg-yellow-100 text-yellow-700";
    if (status === "Delivered") return "bg-green-100 text-green-700";
    if (status === "Cancelled") return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <BuyerLayout>
      <div className="p-6 space-y-6">

        {/* ORDER INFO */}
        <div className="bg-white p-5 rounded-xl shadow card card-glow">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">
              Order #{order.order_id}
            </h2>

            <span
              className={`px-3 py-1 text-sm rounded-full ${getStatusColor(order.status)}`}
            >
              {order.status}
            </span>
          </div>

          <p className="mt-2 text-gray-600">
            Total: ₹{order.total_amount}
          </p>
        </div>

        {/* ITEMS */}
        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="font-semibold mb-4">Items</h3>

          {items.length === 0 ? (
            <p className="text-gray-500">No items found</p> 
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 border-b py-4">
                <img
                  src={item.image_url || "/no-image.png"}
                  alt={item.name}
                  onError={(e) => {
                    e.target.src = "/no-image.png";
                  }}
                  className="w-24 h-24 rounded-lg object-cover border"
                />

                <div className="flex flex-col justify-center">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-gray-600">Qty: {item.quantity}</p>
                  <p className="text-blue-600 font-semibold">
                    ₹{item.price}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </BuyerLayout>
  );
};

export default BuyerOrderDetails;