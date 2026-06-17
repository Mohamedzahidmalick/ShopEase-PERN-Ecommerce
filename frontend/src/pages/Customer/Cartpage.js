import React, { useEffect, useState } from "react";
import BuyerLayout from "../../components/BuyerLayout";
import api from "../../services/Api";
import { toast } from "react-toastify";
import { Bookmark, BookmarkCheck, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../Context/CartContext";

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [Deleteconfirmation, setDeleteconfirmation] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const { refreshCart } = useCart();

  const toggleSave = async (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.cart_id === id
          ? { ...item, is_saved_for_later: !item.is_saved_for_later }
          : item
      )
    );

    try {
      await api.put(`/cart/save/${id}`);
      toast.success("Updated successfully");
    } catch {
      toast.error("Failed to update");
      loadCart();
    }
  };

  const saved = cart.filter((item) => item.is_saved_for_later);
  const activeCart = cart.filter((item) => !item.is_saved_for_later);

  const HandledeleteClick = (cart_id) => {
    setDeleteId(cart_id);
    setDeleteconfirmation(true);
  };

  const navigate = useNavigate();

  const checkout = async () => {
    try {
      const res = await api.post("/cart/checkout", {
        payment_method: "UPI", // or Card / COD
      });
      refreshCart();
      toast.success("Order Placed!");
      navigate("/buyer/order-success?order=" + res.data.order_id);
      //loadCart();
    } catch (err) {
      toast.error(err.response?.data?.message || "Checkout failed");
    }
  };

  const loadCart = async () => {
    try {
      const res = await api.get("/cart");
      setCart(res.data || []);
    } catch (err) {
      toast.error("Error loading cart");
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const removeItem = async (cart_id) => {
    try {
      await api.delete(`/cart/${cart_id}`);
      refreshCart();
      toast.success("Item removed");
      loadCart();
      setDeleteconfirmation(false);
      setDeleteId(null);
    } catch {
      toast.error("Failed to remove");
    }
  };

  const updateQty = async (cart_id, newQty) => {
    if (newQty < 1) return;

    try {
      await api.put(`/cart/update/${cart_id}`, { quantity: newQty });
      loadCart();
      refreshCart();
    } catch (err) {
      toast.error("Failed to update quantity");
    }
  };

  useEffect(() => {
    refreshCart(); //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <BuyerLayout>
      <Deletepopup
        open={Deleteconfirmation}
        onClose={() => setDeleteconfirmation(false)}
        onConfirm={removeItem}
        deleteId={deleteId}
        message="Are you sure you want to delete this product?"
      />
      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ---------------- LEFT SIDE — ITEMS ---------------- */}
        <div className="lg:col-span-2 space-y-5">
          <h2 className="text-2xl font-bold mb-4">Your Cart</h2>

          {cart.length === 0 ? (
            <div className="text-center p-10 bg-white rounded-lg shadow">
              <h3 className="text-xl font-semibold text-gray-700">
                Your cart is empty
              </h3>
              <p className="text-gray-500 mt-2">Start shopping to add items.</p>
              <button
                onClick={() => navigate("/buyer/dashboard")}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
              >
                Browse Products
              </button>
            </div>
          ) : (
            <>
              {/*  ACTIVE CART ITEMS */}
              {activeCart.map((item) => (
                <div
                  key={`${item.cart_id}-${item.product_id}`}
                  className="grid grid-cols-[100px_1fr_auto] gap-4 bg-white dark:bg-[#161b22] rounded-xl shadow p-4 hover:shadow-lg border border-gray-200 transition"
                >
                  {/* IMAGE */}
                  <img
                    src={item.image_url}
                    alt={item.name}
                    onError={(e) => (e.target.src = "/no-image.png")}
                    className="w-24 h-24 object-cover rounded-lg border"
                  />

                  {/* DETAILS */}
                  <div className="flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{item.name}</h3>
                      <p className="text-sm text-gray-600">
                        Sold by {item.seller_name || "Shopease"}
                      </p>
                      <p className="text-blue-600 font-bold text-lg">
                        ₹{item.price}
                      </p>
                    </div>

                    {/* QUANTITY */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() =>
                          updateQty(item.cart_id, item.quantity - 1)
                        }
                        className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        -
                      </button>

                      <span className="px-3 py-1 border rounded font-semibold">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          updateQty(item.cart_id, item.quantity + 1)
                        }
                        className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* RIGHT SIDE */}
                  <div className="flex flex-col justify-between items-end">
                    <button
                      onClick={() => toggleSave(item.cart_id)}
                      className="text-blue-600 flex items-center gap-1 text-sm"
                    >
                      {item.is_saved_for_later ? (
                        <>
                          <BookmarkCheck size={18} />
                          Move to Cart
                        </>
                      ) : (
                        <>
                          <Bookmark size={18} />
                          Save for later
                        </>
                      )}
                    </button>

                    <Trash2
                      onClick={() => HandledeleteClick(item.cart_id)}
                      className="text-red-500 cursor-pointer hover:scale-110"
                      size={20}
                    />

                    <div className="text-right">
                      <p className="text-sm text-gray-500">Subtotal</p>
                      <p className="font-bold text-green-600 text-lg">
                        ₹{item.price * item.quantity}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/*  SAVED FOR LATER SECTION */}
              {saved.length > 0 && (
                <div className="mt-10">
                  <h2 className="text-xl font-bold mb-4">Saved for Later</h2>

                  {saved.map((item) => (
                    <div
                      key={item.cart_id}
                      className="flex justify-between items-center bg-gray-50 p-4 rounded shadow"
                    >
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-gray-500">₹{item.price}</p>
                        <span className="inline-flex mt-1 px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full">
                          Saved for later
                        </span>
                      </div>

                      <button
                        onClick={() => toggleSave(item.cart_id)}
                        className="text-blue-600 text-sm flex items-center gap-1"
                      >
                        {item.is_saved_for_later ? (
                          <>
                            <BookmarkCheck size={16} />
                            Move to Cart
                          </>
                        ) : (
                          <>
                            <Bookmark size={16} />
                            Save for later
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}


            </>
          )}
        </div>

        {/* ---------------- RIGHT SIDE — SUMMARY ---------------- */}
        <div className="w-full max-w-sm bg-white shadow-xl rounded-xl p-5 sticky top-20">
          <h2 className="text-xl font-bold mb-4">Price Summary</h2>

          {activeCart.map((c) => (
            <p
              key={c.cart_id}
              className="flex justify-between text-gray-600 text-sm"
            >
              {c.name} x {c.quantity}
              <span>₹{c.price * c.quantity}</span>
            </p>
          ))}

          <hr className="my-4" />

          <p className="flex justify-between text-lg font-bold">
            Total
            <span className="text-green-600">
              ₹{activeCart.reduce((t, c) => t + c.price * c.quantity, 0)}
            </span>
          </p>

          <button
            onClick={checkout}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-lg font-semibold shadow-lg"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </BuyerLayout>
  );
};

const Deletepopup = ({ open, onClose, onConfirm, message, deleteId }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-[#1b1f24] p-6 rounded-lg shadow-xl w-80">
        <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
          {message}
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700 dark:text-white"
          >
            Cancel
          </button>

          <button
            onClick={() => onConfirm(deleteId)}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
