import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import AdminProductTable from "../../components/Admin/AdminProductTable";
import api from "../../services/Api";
import Pagination from "../../components/Common components/Pagination";
import Loader from "../../components/Loader";

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalpages, setTotalpages] = useState(1);
  const [search, setSearch] = useState("");
  const [seller, setSeller] = useState("");
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(false);

  // ---------------- FETCH PRODUCTS ----------------

  const fetchProducts = async () => {
    setLoading(true);
    const start = Date.now();
    try {
      const res = await api.get(
        `/admin/products?page=${page}&search=${search}&seller=${seller}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          },
        },
      );
      const elapsed = Date.now() - start;
      const delay = Math.max(500 - elapsed,0); // Ensure at least 500ms loading time
      setTimeout(() => {  
        console.log(res.data.products);
 setProducts(res.data.products);
      setTotalpages(res.data.totalPages);
      setLoading(false);
      }, delay);

      
     
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  // ---------------- FETCH SELLERS ----------------

  const fetchSellers = async () => {
    try {
      const res = await api.get("/admin/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
      });

      const onlySellers = res.data.filter(
        (u) => u.role === "seller" || u.role === "both",
      );

      setSellers(onlySellers);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProducts(); //eslint-disable-next-line
  }, [page, search, seller]);

  useEffect(() => {
    fetchSellers();
  }, []);

  // ---------------- REFRESH ----------------

  const refresh = () => {
    fetchProducts();
  };

  return (
    <AdminLayout>
      <div className="w-full">
        <h1 className="text-2xl font-bold mb-4">Products (Admin)</h1>

        <div className="flex gap-3 mb-4">
          <input
            type="text"
            placeholder="Search product"
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            className="border px-3 py-2 rounded"
          />

          <select
            value={seller}
            onChange={(e) => {
              setPage(1);
              setSeller(e.target.value);
            }}
            className="border px-3 py-2 rounded"
          >
            <option value="">All Sellers</option>

            {sellers.map((s) => (
              <option key={s.id} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div className="bg-white dark:bg:[#161b22] p-4 rounded shadow">
          {loading?(
            <Loader/>
          ):(
          <AdminProductTable products={products} refresh={refresh} />
          )}
          {/* PAGINATION */}

         <Pagination page={page} totalPages={totalpages} setPage={setPage}/>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProductsPage;
