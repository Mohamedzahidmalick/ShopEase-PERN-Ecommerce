import React, { useEffect, useState } from "react";
import api from "../../services/Api";
import { toast } from "react-toastify";
import AdminLayout from "../AdminLayout";
import Confirmpopup from "../../Confirmpopup";

const AdminSellerRequests = () => {
  const [sellers, setSellers] = useState([]);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [status, setStatus] = useState("pending");

  // FIXED STATE
  const [loadingAction, setLoadingAction] = useState(null);

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setOpen(true);
  };

  const fetchSellers = async () => {
    try {
      const res = await api.get(`/admin/sellers?status=${status}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
      });
      setSellers(res.data);
    } catch (err) {
      console.error("Error", err.response?.data || err.message);
      toast.error("Failed to load sellers");
    }
  };

  useEffect(() => {
    fetchSellers(); // eslint-disable-next-line
  }, [status]);

  //  APPROVE
  const approveSeller = async (id) => {
    try {
      await api.put(
        `/admin/approve-seller/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          },
        },
      );
      toast.success("Seller approved");
      fetchSellers();
    } catch (err) {
      console.error("Failed to approve seller", err);
      toast.error("Failed");
    }
  };

  //  REJECT
  const rejectSeller = async () => {
    try {
      setLoadingAction(`reject-${deleteId}`);

      await new Promise((res) => setTimeout(res, 500)); // UX delay

      await api.put(
        `/admin/reject-seller/${deleteId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          },
        },
      );

      toast.success("Seller is marked as rejected");

      setOpen(false);
      setDeleteId(null);
      fetchSellers();
    } catch (err) {
      console.error("Failed to reject seller", err);
      toast.error("Failed to update status");
    } finally {
      setLoadingAction(null);
    }
  };

  //  RESTORE
  const restoreSeller = async (id) => {
    setLoadingAction(`restore-${id}`);

      await new Promise((res) => setTimeout(res, 500)); // UX delay
    try {
      
      await api.put(
        `/admin/restore-seller/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          },
        },
      );
      toast.success("Seller restored to pending");
      //console.log("Seller restored:", `restore-${id}`);
      //console.log("Current loadingAction:", loadingAction);
      fetchSellers();
    } catch (err) {
      console.error("Failed to restore seller", err);
      toast.error("Failed to restore seller");
    }finally{
      setLoadingAction(null);
    }
  };

  return (
    <AdminLayout>
      <Confirmpopup
        open={open}
        onCancel={() => {
          setOpen(false);
          setLoadingAction(null); // reset if cancel
        }}
        onConfirm={rejectSeller}
        message="Reject Seller?"
      />

      <div className="p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Seller Requests</h2>

        {/* FILTER BUTTONS */}
        <div className="flex gap-3 mb-4">
          <button
            onClick={() => setStatus("pending")}
            className={`px-4 py-2 rounded ${
              status === "pending" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            Pending
          </button>

          <button
            onClick={() => setStatus("approved")}
            className={`px-4 py-2 rounded ${
              status === "approved" ? "bg-green-500 text-white" : "bg-gray-200"
            }`}
          >
            Approved
          </button>

          <button
            onClick={() => setStatus("rejected")}
            className={`px-4 py-2 rounded ${
              status === "rejected" ? "bg-red-500 text-white" : "bg-gray-200"
            }`}
          >
            Rejected
          </button>
        </div>

        {/* TABLE */}
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {sellers.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center p-6 text-gray-500">
                  No sellers found
                </td>
              </tr>
            ) : (
              sellers.map((s) => (
                <tr key={s.id} className="text-center border-t">
                  <td className="p-3">
                    {s.first_name} {s.last_name}
                  </td>

                  <td className="p-3">{s.email}</td>

                  <td className="p-3 flex gap-2 justify-center">
                    {/* PENDING */}
                    {status === "pending" && (
                      <>
                        {/* APPROVE */}
                        <button
                          onClick={async () => {
                            setLoadingAction(`approve-${s.id}`);

                            await new Promise((res) => setTimeout(res, 500));

                            await approveSeller(s.id);

                            setLoadingAction(null);
                          }}
                          disabled={
                            loadingAction && loadingAction === `approve-${s.id}`
                          }
                          className="bg-green-500 text-white px-3 py-1 rounded disabled:opacity-50"
                        >
                          {loadingAction === `approve-${s.id}`
                            ? "Approving..."
                            : "Approve"}
                        </button>

                        {/* REJECT */}
                        <button
                          onClick={() => {
                            setLoadingAction(`reject-${s.id}`);
                            handleDeleteClick(s.id);
                          }}
                          disabled={loadingAction === `reject-${s.id}`}
                          className="bg-red-500 text-white px-3 py-1 rounded disabled:opacity-50"
                        >
                          {loadingAction === `reject-${s.id}`
                            ? "Rejecting..."
                            : "Reject"}
                        </button>
                      </>
                    )}

                    {/* APPROVED */}
                    {status === "approved" && (
                      <>
                        <button
                          onClick={() => {
                            setLoadingAction(`reject-${s.id}`);
                            handleDeleteClick(s.id);
                          }}
                          disabled={
                            loadingAction && loadingAction === `reject-${s.id}`
                          }
                          className="bg-red-500 text-white px-3 py-1 rounded disabled:opacity-50"
                        >
                          {loadingAction === `reject-${s.id}`
                            ? "Rejecting..."
                            : "Reject"}
                        </button>

                        <button
                          onClick={async () => {
                            setLoadingAction(`restore-${s.id}`);
                            await new Promise((res) => setTimeout(res, 500));
                            await restoreSeller(s.id);
                            setLoadingAction(null);
                          }}
                          disabled={
                            loadingAction && loadingAction === `restore-${s.id}`
                          }
                          className="bg-yellow-500 text-white px-3 py-1 rounded disabled:opacity-50"
                        >
                          {loadingAction === `restore-${s.id}`
                            ? "Restoring..."
                            : "Pending"}
                        </button>
                      </>
                    )}

                    {/* REJECTED */}
                    {status === "rejected" && (
                      <button
                        onClick={async () => {
                          setLoadingAction(`restore-${s.id}`);
                          await new Promise((res) => setTimeout(res, 500));
                          await restoreSeller(s.id);
                          setLoadingAction(null);
                        }}
                        disabled={loadingAction && loadingAction === `restore-${s.id}`}
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                      >
                        {loadingAction === `restore-${s.id}`
                          ? "Restoring..."
                          : "Restore"}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default AdminSellerRequests;
