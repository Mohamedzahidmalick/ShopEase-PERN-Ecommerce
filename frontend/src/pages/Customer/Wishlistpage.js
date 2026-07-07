import React, { useEffect, useState } from "react";
import BuyerLayout from "../../components/BuyerLayout";
import api from "../../services/Api";
import { toast } from "react-toastify";

const WishlistPage = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api
      .get("/wishlist", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("buyer_token")}`,
        },
      })
      .then((res) => {
        setItems(res.data);
      });
  }, []);

  const removeItem = async (productId) => {
    try {
      await api.delete(`/wishlist/remove/${productId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("buyer_token")}`,
        },
      });

      setItems(items.filter((i) => i.product_id !== productId));
      toast.success("Removed from wishlist");
    } catch (err) {
      console.error(err);
    }
  };
  const fixImageURL = (url) => {
    if (!url) return "/no-image.png";
    if (url.startsWith("http")) return url;
    return `${process.env.REACT_APP_API_URL}/${url.replace(/^\/+/, "")}`;
    
  };

  return (
    <BuyerLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">My Wishlist ❤️</h1>

        {items.length === 0 ? (
          <p className="text-gray-500">Your wishlist is empty</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <div key={item.product_id} className="bg-white p-4 rounded-lg shadow">
                <img
                  src={fixImageURL(item.image_url)}
                  onError={(e) => (e.target.src = "/no-image.png")}
                  alt={item.name}
                  className="w-full h-44 object-cover
    transition-transform duration-300
    group-hover:scale-110"
                />

                <h3 className="font-semibold mt-2">{item.name}</h3>

                <p className="text-blue-600 font-bold">₹{item.price}</p>

                <button
                  onClick={() => removeItem(item.product_id)}
                  className="mt-3 w-full bg-red-500 text-white py-2 rounded"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </BuyerLayout>
  );
};

export default WishlistPage;