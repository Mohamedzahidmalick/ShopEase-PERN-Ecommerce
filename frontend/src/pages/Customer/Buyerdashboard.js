import React, { useState, useEffect } from "react";
import BuyerLayout from "../../components/BuyerLayout";
import Carousel from "../Carousel";
import api from "../../services/Api";
import { useNavigate } from "react-router-dom";
import { Heart, Plus } from "lucide-react";
import { toast } from "react-toastify";
import { useCart } from "../../Context/CartContext";
import SkeletonCard from "../../components/Skeletonloader";

const BuyerDashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const { increaseCart } = useCart();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const scrollToDown = () => {
    window.scrollTo({ top: 900, behavior: "smooth" });
  };

  const toggleWishlist = async (productId) => {
    const notliked = wishlist.includes(productId);
    try {
      if (notliked) {
        await api.delete(`/wishlist/remove/${productId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("buyer_token")}`,
          },
        });
        setWishlist((prev) => prev.filter((id) => id !== productId));
      } else {
        await api.post(
          `/wishlist/add/`,
          { product_id: productId },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("buyer_token")}`,
            },
          },
        );
        setWishlist((prev) => [...prev, productId]);
      }
    } catch (error) {
      console.error("Wishlist error:", error);
    }
  };

  useEffect(() => {
    api
      .get("/wishlist", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("buyer_token")}`,
        },
      })
      .then((res) => {
        const ids = res.data.map((p) => p.product_id);
        setWishlist(ids);
      })
      .catch((err) => {
        console.error("Wishlist fetch error:", err);
      });
  }, []);

  // Fix image URL (ensures correct /uploads path)
  const fixImageURL = (url) => {
    if (!url) return "/placeholder.png";
    if (url.startsWith(`${process.env.REACT_APP_API_URL}`)) return url;
    return `${process.env.REACT_APP_API_URL}${url}`;
  };

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true);

        //  Run API + delay together
        const [res] = await Promise.all([
          api.get("/products/all"),
          new Promise((resolve) => setTimeout(resolve, 800)),
        ]);

        setProducts(res.data.products || res.data || []);
      } catch (err) {
        console.error("Error loading products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  const addToCart = async (id) => {
    try {
      await api.post(
        "/cart/add",
        { product_id: id, quantity: 1 },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("buyer_token")}`,
          },
        },
      );
      increaseCart();
      toast.success("Added to Cart");
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error("Failed to add");
    }
  };

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const formattedTodayDate = today.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTomorrowDate = tomorrow.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <BuyerLayout>
      <div className="p-6 space-y-12  ">
        {/* HERO BANNER */}
        <div
          className="rounded-xl p-8 text-center shadow-[0_0_20px_#00E7FF22]
bg-gradient-to-r from-[#0A0D2E] via-[#10164B] to-[#0A0D2E]
border border-[#13183C] card-glow"
        >
          <h1 className="text-3xl font-bold text-white">
            Welcome to <span className="text-[#00E7FF]">ShopEase</span>
          </h1>

          <p className="text-[#C8D0E0] mt-2">
            Discover amazing deals and trending products everyday.
          </p>

          <button
            onClick={scrollToDown}
            className="mt-6 px-6 py-3 rounded-lg card-glow-hover
    bg-[#00E7FF] text-black font-semibold
    hover:scale-105 transition-all shadow-[0_0_10px_#00E7FF66]"
          >
            Start Shopping
          </button>
        </div>

        {/* CAROUSEL */}
        <div>
          <Carousel />
        </div>

        {/* CATEGORIES */}
        <div>
          <h2 className="text-2xl font-bold mb-4 product-grid">Categories</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 ">
            {[
              { name: "Mobile", color: "from-blue-400 to-blue-600" },
              { name: "Laptops", color: "from-green-400 to-green-600" },
              { name: "Food", color: "from-red-400 to-red-600" },
              { name: "Fashion", color: "from-pink-400 to-pink-600" },
              { name: "Game", color: "from-purple-400 to-purple-600" },
              { name: "Electronics", color: "from-orange-400 to-orange-600" },
            ].map((cat, i) => (
              <div
                key={i}
                className={`p-4 text-white rounded-xl shadow-lg cursor-pointer transform hover:scale-105 transition bg-gradient-to-br ${cat.color}`}
                onClick={() => navigate(`/buyer/products?category=${cat.name}`)}
              >
                <p className="font-semibold text-center">{cat.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FEATURED PRODUCTS */}

        <div>
          <h2 className="text-2xl font-bold mb-4 ">Featured Products</h2>
          <div className="relative min-h-[300px]">
            {loading && (
              <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 z-10">
                {[...Array(4)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            )}

            <div
              className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 transition ${
                loading ? "opacity-50 pointer-events-none blur-[1px]" : ""
              }`}
            >
              {products.slice(0, 4).map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden
  transition-all duration-300
  hover:-translate-y-2 hover:shadow-2xl
  group cursor-pointer"
                  onClick={() => navigate(`/buyer/product/${p.id}`)}
                >
                  {/* PRODUCT IMAGE */}
                  <img
                    src={fixImageURL(p.image_url)}
                    onError={(e) => (e.target.src = "/no-image.png")}
                    alt={p.name}
                    className="w-full h-44 object-cover
    transition-transform duration-300
    group-hover:scale-110"
                  />

                  <div className="p-4">
                    {/* NAME + WISHLIST */}
                    <div className="flex justify-between items-start">
                      <h2 className="text-lg font-semibold text-gray-800">
                        {p.name}
                      </h2>

                      <Heart
                        size={24}
                        strokeWidth={2}
                        fill={wishlist.includes(p.id) ? "currentColor" : "none"}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(p.id);
                        }}
                        className={`
 cursor-pointer 
 transition-all 
 duration-200
 hover:scale-125
 ${wishlist.includes(p.id) ? "text-pink-500" : "text-gray-400"}
 `}
                      />
                    </div>

                    {/* PRICE */}
                    <p className="text-blue-600 font-bold text-xl mt-1">
                      ₹{p.price}
                    </p>

                    {/* STOCK */}
                    <p className="text-sm text-gray-500">
                      {p.stock > 0 ? `In Stock: ${p.stock}` : "Out of Stock"}
                    </p>

                    {/* RATING + CART */}
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex text-yellow-400 text-sm">
                        ⭐⭐⭐⭐⭐
                        <span className="text-gray-500 ml-1">(32)</span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(p.id);
                        }}
                        className="bg-yellow-400 w-10 h-10 rounded-full
        flex items-center justify-center
        transition-all duration-200
        hover:bg-yellow-500 hover:scale-110 hover:shadow-lg"
                      >
                        <Plus size={18} />
                      </button>
                    </div>

                    {/* DELIVERY */}
                    <p className="text-green-600 text-sm mt-3">
                      Free Delivery on {formattedTodayDate}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ALL PRODUCTS */}
        <div>
          <h2 className="text-2xl font-bold mb-4 ">All Products</h2>

          {/* WRAPPER (IMPORTANT) */}
          <div className="relative min-h-[500px]">
            {/*  SKELETON OVERLAY */}
            {loading && (
              <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 z-10">
                {[...Array(8)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            )}

            {/*  PRODUCT GRID WITH BLUR */}
            <div
              className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 transition duration-300 ${
                loading ? "opacity-50 pointer-events-none blur-[1px]" : ""
              }`}
            >
              {products.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden
          transition-all duration-300
          hover:-translate-y-2 hover:shadow-2xl
          group cursor-pointer"
                  onClick={() => navigate(`/buyer/product/${p.id}`)}
                >
                  <img
                    src={fixImageURL(p.image_url)}
                    onError={(e) => (e.target.src = "/no-image.png")}
                    alt={p.name}
                    className="w-full h-44 object-cover group-hover:scale-110 transition-transform duration-300"
                  />

                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <h2 className="text-lg font-semibold text-gray-800">
                        {p.name}
                      </h2>

                      <Heart
                        size={22}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(p.id);
                        }}
                        className={`cursor-pointer transition duration-200 hover:scale-125 ${
                          wishlist.includes(p.id)
                            ? "text-pink-500 fill-pink-500"
                            : "text-gray-400"
                        }`}
                      />
                    </div>

                    <p className="text-blue-600 font-bold text-xl mt-1">
                      ₹{p.price}
                    </p>

                    <p className="text-sm text-gray-500">
                      {p.stock > 0 ? `In Stock (${p.stock})` : "Out of Stock"}
                    </p>

                    <div className="flex justify-between items-center mt-2">
                      <div className="flex text-yellow-400 text-sm">
                        ⭐⭐⭐⭐⭐
                        <span className="text-gray-500 ml-1">(12)</span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(p.id);
                        }}
                        className="bg-yellow-400 w-10 h-10 rounded-full flex items-center justify-center hover:bg-yellow-500 hover:scale-110 transition"
                      >
                        <Plus size={18} />
                      </button>
                    </div>

                    <p className="text-green-600 text-sm mt-3">
                      Free Delivery on {formattedTomorrowDate}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </BuyerLayout>
  );
};

export default BuyerDashboard;
