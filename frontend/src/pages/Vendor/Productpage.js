import React, { useEffect, useState } from "react";
import SellerLayout from "../../components/SellerLayout";
import ProductTable from "../../components/Seller/Producttable";
import api from "../../services/Api";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/Common components/Pagination";
import Loader from "../../components/Loader";

const ProductPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [Search, setSearch] = useState("");
  const [Category, setCategory] = useState("");
  const [page, setPage] = useState(1); //Pagination State
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    const start = Date.now();
    try {
      const res = await api.get(
        `/products?page=${page}&limit=${limit}&search=${Search}&category=${Category}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("seller_token")}`,
          },
        },
      );
      const elapsed = Date.now() - start;
      const delay = Math.max(500 - elapsed, 0); // Ensure at least 500ms loading time
      setTimeout(() => {
        setProducts(res.data.products);
        setTotalPages(res.data.totalPages);
        setLoading(false);
      }, delay);
    } catch (err) {
      console.error("Error fetching products:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(); //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, Search, Category]);

  return (
    <SellerLayout>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Products
          </h1>

          <button
            onClick={() => navigate("/seller/products/add")}
            className="btn-primary"
          >
            + Add Product
          </button>
        </div>

        {/* ---------------- Search + Filter Section ---------------- */}
        <div className="mt-5 bg-white dark:bg-[#161b22] shadow p-4 rounded-xl flex items-center gap-4">
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search products..."
            className="flex-1 p-3 bg-gray-100 dark:bg-[#0d1117] rounded-lg outline-none text-gray-900 dark:text-gray-200"
            value={Search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Category Filter */}
          <select
            className="p-3 border rounded-lg bg-gray-100 dark:bg-[#0d1117] text-black-900 dark:text-black-200"
            value={Category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Food">Food</option>
            <option value="Mobile">Mobile Phones</option>
            <option value="Game">Gaming </option>
          </select>

          {/* Search Button */}
          <button
            onClick={() => {
              setPage(1);
              fetchProducts();
            }}
            className="px-5 py-3 bg-black dark:bg-blue-600 text-white rounded-lg shadow"
          >
            Search
          </button>
        </div>

        {/* ---------------- Table Section ---------------- */}
        <div className="mt-6">
          {loading ? (
            <Loader />
          ) : (
            <ProductTable products={products} refresh={fetchProducts} />
          )}
        </div>

        {/* ---------------- Pagination ---------------- */}
        <Pagination page={page} totalPages={totalPages} setPage={setPage} />
      </div>
    </SellerLayout>
  );
};

export default ProductPage;
