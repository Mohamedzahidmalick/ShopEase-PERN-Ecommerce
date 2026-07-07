import React, { useState, useEffect, useRef } from "react";
import BuyerLayout from "../../components/BuyerLayout";
import api from "../../services/Api";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Heart, Plus } from "lucide-react";
import { toast } from "react-toastify";
import { useCart } from "../../Context/CartContext";
import SkeletonCard from "../../components/Skeletonloader";

const Buyerproductfilter = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const firstLoad = useRef(true);
  const [loading, setLoading] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [color, setColor] = useState("");
  const [rating, setRating] = useState(0);
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(200000);
  const [sort, setSort] = useState("latest");

  // Products
  const [products, setProducts] = useState([]);

  const { increaseCart } = useCart();
  const [wishlist, setWishlist] = useState([]);

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

  const filterused =
    search !== "" ||
    category !== "" ||
    brand !== "" ||
    color !== "" ||
    rating !== 0 ||
    priceMin !== 0 ||
    priceMax !== 200000 ||
    sort !== "latest";

  const toggleWishlist = async (productId) => {
    const liked = wishlist.includes(productId);
    try {
      if (liked) {
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
  // Fix image URL (ensures correct /uploads path)
  const fixImageURL = (url) => {
    if (!url) return "/placeholder.png";
    if (url.startsWith(`${process.env.REACT_APP_API_URL}`)) return url;
    return `${process.env.REACT_APP_API_URL}${url}`;
  };

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const res = await api.get("/products/all");
        setProducts(res.data || []);
      } catch (err) {
        console.error("Error loading products:", err);
      }
    };

    fetchAllProducts();
  }, []);

  useEffect(() => {
    fetchFiltered(); //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category, brand, color, rating, priceMin, priceMax, sort]);

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

  const formattedTomorrowDate = tomorrow.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const fetchFiltered = async () => {
    try {
      setLoading(true);
      const res = await api.get("/products/filter", {
        params: {
          search,
          category,
          brand,
          color,
          rating,
          price_min: priceMin,
          price_max: priceMax,
          sort,
        },
      });
      await new Promise((resolve) => setTimeout(resolve, 500)); // Ensure at least 500ms loading time
      setProducts(res.data.products);
    } catch (err) {
      console.error("Filter error:", err);
    }finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    if (firstLoad.current) {
      firstLoad.current = false;
      return;
    }
    const params = {};
    if (search) params.search = search;
    if (category) params.category = category;
    if (brand) params.brand = brand;
    if (color) params.color = color;
    if (rating) params.rating = rating;
    if (priceMin) params.price_min = priceMin;
    if (priceMax !== 200000) params.price_max = priceMax;
    if (sort !== "latest") params.sort = sort;
    setSearchParams(params);
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category, brand, color, rating, priceMin, priceMax, sort]);

  useEffect(() => {
    setSearch(searchParams.get("search") || "");
    setCategory(searchParams.get("category") || "");
    setBrand(searchParams.get("brand") || "");
    setColor(searchParams.get("color") || "");
    setRating(searchParams.get("rating") || 0);
    setPriceMin(searchParams.get("price_min") || 0);
    setPriceMax(searchParams.get("price_max") || 200000);
    setSort(searchParams.get("sort") || "latest");

    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    fetchFiltered(); //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);
  return (
    <BuyerLayout>
      <div className="flex justify-between flex-1 gap-6 p-6 ">
        {/* ---------------- Left Filter Sidebar ---------------- */}
        <div className="w-1/4 bg-white  p-6 shadow-md rounded h-fit sticky top-4">
          <h2 className="text-xl font-semibold mb-4">Filters</h2>

          {/* Search */}
          <input
            type="text"
            placeholder="Search products..."
            className="w-full p-2 border rounded mb-3"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Category */}
          <select
            className="w-full p-2 border rounded mb-3"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Food">Food</option>
            <option value="Mobile">Mobile Phones</option>
            <option value="Game">Gaming </option>
            {/* <option value="Electronics">Electronics</option> */}
          </select>

          {/* Brand */}
          <input
            className="w-full p-2 border rounded mb-3"
            placeholder="Brand (Apple, Sony...)"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />

          {/* Color */}
          <input
            className="w-full p-2 border rounded mb-3"
            placeholder="Color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />

          {/* Rating */}
          <select
            className="w-full p-2 border rounded mb-3"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          >
            <option value="0">Any Rating</option>
            <option value="4">4★ & above</option>
            <option value="3">3★ & above</option>
            <option value="2">2★ & above</option>
          </select>

          {/* Price Range */}
          <div className="mb-3">
            <p className="font-medium mb-1">Price Range</p>
            <input
              type="number"
              className="w-full p-2 border rounded mb-2"
              placeholder="Min"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
            />
            <input
              type="number"
              className="w-full p-2 border rounded"
              placeholder="Max"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
            />
          </div>

          {/* Sort */}
          <select
            className="w-full p-2 border rounded mb-4"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="latest">Latest</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>

          {filterused && (
            <button
              className="mt-3 bg-red-500 text-white px-3 py-1 rounded"
              onClick={() => {
                setSearch("");
                setCategory("");
                setBrand("");
                setColor("");
                setRating(0);
                setPriceMin(0);
                setPriceMax("200000");
                setSort("latest");
              }}
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* ---------------- Products Grid ---------------- */}
        <div className=" h-fit w-fit flex-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading ?(
            Array.from({ length: 8 }).map((_, idx) => (
              <SkeletonCard key={idx} />
            )))
          :products.length === 0 ? (
            <p className="text-gray-500">No products found</p>
          ): products.map((p) => (
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
                    size={22}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(p.id);
                    }}
                    className={`cursor-pointer transition duration-200 hover:scale-125
        ${
          wishlist.includes(p.id)
            ? "text-pink-500 fill-pink-500"
            : "text-gray-400"
        }`}
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
                  Free Delivery on {formattedTomorrowDate}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </BuyerLayout>
  );
};

export default Buyerproductfilter;
