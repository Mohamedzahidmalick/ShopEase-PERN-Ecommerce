import React, { useEffect, useState } from "react";
import api from "../../services/Api";
import { toast } from "react-toastify";
import { Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ActionMenu from "../../Common_Actions_menu";

const AdminUsersTable = ({ users = [], refreshUsers }) => {
  const navigate = useNavigate();
  const [loadingId, setLoadingId] = useState(null);
  const [LocalUsers, setLocalUsers] = useState(users);

  useEffect(() => {
    setLocalUsers(users);
  }, [users]);

  //console.log(users);

  // DELETE USER
  const deleteUser = async (id) => {
    try {
      await api.delete(`/admin/users/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
      });

      toast.success("User deleted");
      refreshUsers(); // from parent
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  // BLOCK / UNBLOCK USER
  const handleBlock = async (userId) => {
    setLoadingId(userId);

    //  instant UI update
    setLocalUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, is_blocked: !u.is_blocked } : u,
      ),
    );

    try {
      const res = await api.put(`/admin/block/${userId}`);
      toast.success(res.data.message);
    } catch (err) {
      toast.error("Error updating user");

      // ❌ rollback if failed
      setLocalUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, is_blocked: !u.is_blocked } : u,
        ),
      );
    } finally {
      setLoadingId(null);
    }
  };
  return (
    <div className="bg-white dark:bg-[#161b22] shadow rounded-lg p-4 mt-4">
      <table className="w-full table-auto">
        {/* HEADER */}
        <thead>
          <tr className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-center">Created At</th>
            <th className="p-3 text-center">Role</th>
            <th className="p-3 text-center">Status</th>
            <th className="p-3 text-center">Block</th>
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>

        {/* BODY */}
        <tbody>
          {LocalUsers.map((u) => (
            <tr key={u.id} className="border-b hover:bg-gray-50 transition">
              <td className="p-3">{u.name}</td>
              <td className="p-3">{u.email}</td>
              <td className="p-3 text-center">
                {new Date(u.created_at).toLocaleDateString()}
              </td>

              {/* ROLE */}
              <td className="p-3 text-center">
                <span
                  className={`px-2 py-1  text-sm font-bold ${
                    u.role === "seller"
                      ? " text-blue-700"
                      : u.role === "buyer"
                        ? " text-green-700"
                        : " text-purple-700"
                  }`}
                >
                  {u.role}
                </span>
              </td>

              {/* STATUS */}
              <td className="p-3 text-center">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    u.is_blocked
                      ? "bg-red-100 text-red-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {u.is_blocked ? "Blocked" : "Active"}
                </span>
              </td>

              {/* BLOCK BUTTON */}
              <td className="p-3 text-center">
                <button
                  onClick={() => handleBlock(u.id)}
                  disabled={loadingId === u.id}
                  className={`px-4 py-1 rounded-md text-white font-semibold transition ${
                    u.is_blocked
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-red-500 hover:bg-red-600"
                  }`}
                >
                  {loadingId === u.id
                    ? "Updating..."
                    : u.is_blocked
                      ? "Unblock"
                      : "Block"}
                </button>
              </td>

              {/* ACTIONS */}
              <td className="p-3 text-center">
                <ActionMenu>
                  <button
                    onClick={() => navigate(`/admin/users/${u.id}`)}
                    className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 w-full text-left"
                  >
                    <Eye size={16} /> View
                  </button>

                  <button
                    onClick={() => deleteUser(u.id)}
                    className="flex items-center gap-2 px-4 py-2 text-red-500 hover:text-red-700 w-full text-left"
                  >
                    <Trash2 size={16} /> Remove
                  </button>
                </ActionMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsersTable;
