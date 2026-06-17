import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import AdminUsersTable from "../../components/Admin/AdminUsersTable";
import api from "../../services/Api";
import Pagination from "../../components/Common components/Pagination";
import Loader from "../../components/Loader";

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    const start = Date.now();
    try {
      const res = await api.get(
        `/admin/users?page=${page}&search=${search}&role=${role}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          },
        },
      );
      const elapsed = Date.now() - start;
      const delay = Math.max(500 - elapsed, 0); // Ensure at least 500ms loading time
      setTimeout(() => {
        setUsers(res.data.users);
        setTotalPages(res.data.totalPages);
        setLoading(false);
      }, delay);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(); // eslint-disable-next-line
  }, [page, search, role]);

  const refresh = () => fetchUsers();

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Users</h1>

      {/* FILTER */}

      <div className="flex gap-3 mb-4 items-center">
        <input
          placeholder="Search user"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          className="border px-3 py-2 rounded w-60"
        />

        <select
          value={role}
          onChange={(e) => {
            setPage(1);
            setRole(e.target.value);
          }}
          className="border px-3 py-2 rounded"
        >
          <option value="">All roles</option>
          <option value="buyer">buyer</option>
          <option value="seller">seller</option>
          <option value="both">both</option>
        </select>
      </div>
      {loading ? (
        <Loader />
      ) : (
        <AdminUsersTable users={users} refreshUsers={refresh} />
      )}

      {/* PAGINATION */}

      <Pagination page={page} totalPages={totalPages} setPage={setPage} />
    </AdminLayout>
  );
};

export default AdminUsersPage;
