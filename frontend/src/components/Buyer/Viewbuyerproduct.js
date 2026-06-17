import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BuyerLayout from "../BuyerLayout";
import api from "../../services/Api";
import { toast } from "react-toastify";
import { useCart } from "../../Context/CartContext";

const ViewBuyerProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const { increaseCart } = useCart();

  // gloabl - space -

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

  const fetchProduct = async () => {
    try {
      const res = await api.get(`/products/${id}`);
      console.log("API response:",res.data);
      setProduct(res.data.product || res.data);
    } catch (error) {
      console.error("Error loading product:", error);
      toast.error("Failed to load product");
      setProduct({});
    }
  };

  useEffect(() => {
    fetchProduct(); //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (product?.images?.length > 0) {
      setSelectedImage(product.images[0].image_url);
    }
  }, [product]);
  useEffect(() => {
    if (product) {
      console.log("Product data:", product);
    }
  }, [product]);

  if (!product)
    return (
      <BuyerLayout>
        <div className="p-10 text-center text-xl">Loading...</div>
      </BuyerLayout>
    );

  return (
    <BuyerLayout>
      <div className="p-6">
        {/* MAIN PRODUCT CONTAINER */}{" "}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white dark:bg-[#161b22] p-8 rounded-2xl shadow-xl">
          {/* LEFT — PRODUCT IMAGE */}
          <div className="flex gap-4">
            {/* THUMBNAILS */}
            <div className="flex flex-col gap-3 product-content ">
              {product.images?.map((img, index) => (
                <img
                  key={index}
                  src={img.image_url}
                  alt="thumb"
                  onClick={() => setSelectedImage(img.image_url)}
                  className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 transition-all
      ${
        selectedImage === img.image_url
          ? "border-violet-100 shadow-lg shadow-red-500 "
          : "border-gray-200"
      }`}
                />
              ))}
            </div>

            {/* MAIN IMAGE */}
            <div className="flex-1 flex justify-center">
              <div className="card card-glow  w-full max-w-md overflow-hidden rounded-xl shadow-lg">
                <img
                  src={
                    selectedImage ||
                    product.images?.[0]?.image_url ||
                    product.image_url
                  }
                  alt={product.name}
                  className="w-full h-96 object-contain transition duration-300 "
                />
              </div>
            </div>
          </div>
          {/* RIGHT — PRODUCT DETAILS */}{" "}
          <div className="product-content">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {product.name}
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Category: <span className="font-medium">{product.category}</span>
            </p>

            {/* PRICE */}
            <p className="text-4xl mt-4 font-bold text-indigo-600">
              ₹{product.price}
            </p>

            {/* STOCK */}
            <p
              className={`mt-2 font-medium ${
                product.stock > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {product.stock > 0 ? "In Stock" : "Out of Stock"}
            </p>

            {/* DESCRIPTION */}
            <p className="mt-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              {product.description}
            </p>

            {/* ACTION BUTTONS */}
            <div className="mt-8 flex gap-4">
              <button
                onClick={(e) => addToCart(product.id)}
                disabled={product.stock === 0}
                className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 hover:-translate-y-1 transition"
              >
                Add to Cart
              </button>

              <button className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 hover:-translate-y-1 transition">
                Buy Now
              </button>
            </div>
          </div>
        </div>
        {/* RELATED PRODUCTS SECTION */}
        <div className="mt-14">
          <h2 className="text-2xl font-bold mb-4">You may also like</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Array(4)
              .fill(null)
              .map((_, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-[#161b22] rounded-xl shadow hover:shadow-xl overflow-hidden cursor-pointer transition hover:-translate-y-2"
                >
                  <div className="h-36 bg-gray-200 dark:bg-gray-800"></div>

                  <div className="p-4">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </BuyerLayout>
  );
};

export default ViewBuyerProduct;
