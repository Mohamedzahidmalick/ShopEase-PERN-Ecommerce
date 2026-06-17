import React, { useState, useEffect } from "react";
import SellerLayout from "../../components/SellerLayout";
import api from "../../services/Api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { ProductSchema } from "../../Validation/ProductValidation";

const AddProduct = () => {
  const navigate = useNavigate();
  const seller_id = 1;

  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    seller_id,
    image: "",
  });

  // Fetch categories
  useEffect(() => {
    api
      .get("/categories")
      .then((res) => setCategories(res.data))
      .catch(() => toast.error("Failed to load categories"));
  }, []);

  // Remove selected image
  const removeImage = (index, setFieldValue) => {
    const updated = [...images];
    updated.splice(index, 1);
    setImages(updated);
    setFieldValue("image", updated.length ? updated : "");
  };

  // Submit product
  const submitProduct = async (values) => {
    //e.preventDefault();

    const formData = new FormData();

    Object.entries(values).forEach(([key, val]) => {
      formData.append(key, val);
    });

    // Send multiple images properly
    images.forEach((img) => {
      formData.append("images", img.file);
    });

    try {
      await api.post("/products/add", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("seller_token")}`,
        },
      });

      toast.success("Product Added!");

      // Reset form
      setForm({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "",
        seller_id,
      });

      setImages([]);

      navigate("/seller/products");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding product");
    }
  };

  return (
    <SellerLayout>
      <div className="max-w-2xl mx-auto bg-white dark:bg-[#161b22] p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-6">Add Product</h2>

        <Formik
          initialValues={form}
          validationSchema={ProductSchema}
          enableReinitialize
          onSubmit={(values, { setFieldError }) => {
            if (images.length === 0) {
              setFieldError("image", "At least one image is required");
              return;
            }

            submitProduct(values);
          }}
        >
          {({ setFieldValue }) => (
            <Form className="space-y-4">
              {/* Product Name */}
              <Field
                name="name"
                placeholder="Product Name"
                className="w-full p-2 border rounded"
              />

              <ErrorMessage
                name="name"
                component="div"
                className="text-red-500 text-sm"
              />

              {/* Description */}
              <Field
                as="textarea"
                name="description"
                placeholder="Description"
                className="w-full p-2 border rounded"
              />

              <ErrorMessage
                name="description"
                component="div"
                className="text-red-500 text-sm"
              />

              {/* Price */}
              <Field
                type="number"
                name="price"
                placeholder="Price"
                className="w-full p-2 border rounded"
              />

              <ErrorMessage
                name="price"
                component="div"
                className="text-red-500 text-sm"
              />

              {/* Stock */}
              <Field
                type="number"
                name="stock"
                placeholder="Stock"
                className="w-full p-2 border rounded"
              />

              <ErrorMessage
                name="stock"
                component="div"
                className="text-red-500 text-sm"
              />

              {/* Category */}
              <Field
                as="select"
                name="category"
                className="w-full p-2 border rounded bg-gray-50 dark:bg-[#0d1117]"
              >
                <option value="">Select Category</option>

                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </Field>
              <br />

              <ErrorMessage
                name="category"
                component="div"
                className="text-red-500 text-sm"
              />
              <br />

              <input
                type="file"
                //name="image"
                multiple
                onChange={(event) => {
                  const files = Array.from(event.currentTarget.files);
                  if (files.length + images.length > 5) {
                    toast.error("Maximum 5 images allowed");
                    return;
                  }
                  const newImages = files.map((file) => ({
                    file,
                    preview: URL.createObjectURL(file),
                  }));
                  setImages((prev) => [...prev, ...newImages]);
                  setFieldValue("image", files);
                }}
                id="productImages"
                className="hidden"
              />
              <label
                htmlFor="productImages"
                className="border px-4 py-2 rounded cursor-pointer bg-gray-100"
              >
                Choose Images
              </label>

              <p className="text-sm text-gray-500">
                {images.length}/5 images selected
              </p>

              {/* Image Preview */}
              <div className="flex gap-4 flex-wrap">
                {images.map((img, index) => (
                  <div key={index} className="relative">
                    <img
                      src={img.preview}
                      alt="preview"
                      className="w-28 h-28 object-cover rounded-md border"
                    />

                    <button
                      type="button"
                      onClick={() => removeImage(index, setFieldValue)}
                      className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex justify-center rounded-full font-semibold"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <ErrorMessage
                name="image"
                component="div"
                className="text-red-500 text-sm"
              />

              <div className="grid grid-cols-2 gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="bg-gray-500 text-white py-2 rounded"
                >
                  Back
                </button>

                <button
                  type="submit"
                  className="bg-blue-600 text-white py-2 rounded"
                >
                  Add Product
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </SellerLayout>
  );
};

export default AddProduct;
