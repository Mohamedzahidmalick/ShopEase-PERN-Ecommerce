import React, { useEffect, useState } from "react";
import SellerLayout from "../../components/SellerLayout";
import api from "../../services/Api";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Confirmpopup from "../../Confirmpopup";

const Viewproduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteConfirmation(true);
  };
  useEffect(() => {
    loadProduct(); //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const deleteProduct = async () => {
    try {
      await api.delete(`/products/delete/${product.id}`);
      toast.success("Product deleted");
      navigate("/seller/products");
    } catch (err) {
      toast.error("Delete failed");
    }
  };
  const loadProduct = async () => {
    try {
      const res = await api.get(`/products/details/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("seller_token")}`,
        },
      });

      // FILTER IMAGES HERE BEFORE SETTING STATE
      const cleanImages =
        res.data.images?.filter(
          (img) => img.image_url && img.image_url.trim() !== "",
        ) || [];

      setProduct({
        ...res.data,
        images: cleanImages,
      });
    } catch (err) {
      console.error("Error loading product", err);
    }
  };

  if (!product) return <p className="text-center mt-10">Loading...</p>;

  return (
    <SellerLayout>
      <>
        <Confirmpopup
          open={deleteConfirmation}
          onCancel={() => setDeleteConfirmation(false)}
          onConfirm={deleteProduct}
          deleteId={deleteId}
          message="Are you sure you want to delete this product?"
        />
        <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
          {/* IMAGE GALLERY */}
          <div className="flex flex-wrap gap-4 mb-6 justify-center">
            {product.images?.length > 0 ? (
              product.images.map((img, i) => (
                <img
                  key={i}
                  src={img.image_url + "?t=" + Date.now()} // prevent cache
                  alt={product.name}
                  className="w-32 h-32 object-cover rounded border"
                />
              ))
            ) : (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-32 h-32 object-cover rounded border"
              />
            )}
          </div>

          {/* PRODUCT DETAILS */}
          <h2 className="text-3xl font-bold mb-2">{product.name}</h2>

          <p className="text-gray-700 leading-relaxed mb-4">
            {product.description}
          </p>

          <div className="text-lg space-y-1">
            <p>
              <b>Category:</b> {product.category}
            </p>
            <p>
              <b>Price:</b> ₹{product.price}
            </p>
            <p>
              <b>Stock:</b> {product.stock}
            </p>
          </div>
          <div className=" gap-3 mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="bg-gray-500 text-white py-2 rounded"
                >
                  Back
                </button>
            <button
              onClick={() => navigate(`/seller/products/edit/${product.id}`)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Edit
            </button>

            <button
              onClick={() => handleDeleteClick(product.id)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      </>
    </SellerLayout>
  );
};

export default Viewproduct;
