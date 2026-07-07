import React, { useEffect, useState } from "react";
import SellerLayout from "../../components/SellerLayout";
import api from "../../services/Api";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { ProductSchema } from "../../Validation/ProductValidation";
const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [existingImages, setExistingImages] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    image: "",
  });

  const [initialForm, setInitialForm] = useState({});

  // ------------ Load PRODUCT DETAILS ------------
  useEffect(() => {
    loadProduct();
    loadCategories();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // in which it wants u to include all functions in dependency array
  //but in our logic just we will running our code only once ,
  //So, in this adding a dependency will breaks the logic so we use Eslint's rule exhaustive-deps ,

  const loadCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch {
      toast.error("Failed to load categories");
    }
  };

  const loadProduct = async () => {
    try {
      const res = await api.get(`/products/details/${id}`);
      const p = res.data;

      const productData = {
        name: String(p.name),
        description: String(p.description),
        price: String(p.price),
        stock: String(p.stock),
        category: String(p.category),
        image: p.images?.length? true : "",
      };

      setForm({ ...productData ,image:true});
      setInitialForm(productData);
      setExistingImages(p.images || []);
    } catch {
      toast.error("Failed to load product");
    }
  };

  // ------------ REMOVE EXISTING IMAGE (DB IMAGE) ------------
  const removeExistingImage = (index, setFieldValue) => {
    const img = existingImages[index];

    const cleanPath = img.image_url.replace(
  process.env.REACT_APP_API_URL || "http://localhost:3000",
  ""
);

    const updated = existingImages.filter((_, i) => i !== index);

    setDeletedImages((prev) => [...prev, cleanPath]);

    setExistingImages(updated);

    const total = updated.length + newImages.length;

    setFieldValue("image", total > 0 ? total : "");
  };

  // ------------ REMOVE NEWLY ADDED IMAGE ------------

  const removeNewImage = (index, setFieldValue) => {
    const updated = newImages.filter((_, i) => i !== index);

    setNewImages(updated);

    const total = existingImages.length + updated.length;

    setFieldValue("image", total > 0 ? total : "");
  };

  // ------------ UPDATE PRODUCT ------------
  const handleUpdate = async (values) => {
    const isFormSame =
      String(values.name) === String(initialForm.name) &&
      String(values.description) === String(initialForm.description) &&
      String(values.price) === String(initialForm.price) &&
      String(values.stock) === String(initialForm.stock) &&
      String(values.category) === String(initialForm.category);

    const isImagesSame = newImages.length === 0 && deletedImages.length === 0;

    if (isFormSame && isImagesSame) {
      toast.error("No changes done");
      return;
    }

    const fd = new FormData();

    Object.entries(values).forEach(([k, v]) => fd.append(k, v));

    newImages.forEach((img) => fd.append("images", img.file));

    fd.append("deleted_images", JSON.stringify(deletedImages));

    try {
      await api.put(`/products/update/${id}`, fd, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("seller_token")}`,
        },
      });

      toast.success("Product Updated Successfully!");
      navigate("/seller/products");
    } catch (err) {
      toast.error("Update failed");
    }
  };

  return (
    <SellerLayout>
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Edit Product</h2>

        {/* FORM */}
        <Formik
          initialValues={form}
          validationSchema={ProductSchema}
          enableReinitialize
          validateOnBlur={false}
          validateOnChange={true}
          onSubmit={(values, { setFieldError }) => {
            if (existingImages.length === 0 && newImages.length === 0) {
              setFieldError("image", "At least one image is required");
              return;
            }

            handleUpdate(values);
          }}
        >
          {({ setFieldValue }) => (
            <Form className="mt-4 space-y-4">
              <Field name="name" className="w-full p-2 border rounded" />

              <ErrorMessage
                name="name"
                component="div"
                className="text-red-500 text-sm"
              />

              <Field
                as="textarea"
                name="description"
                className="w-full p-2 border rounded"
              />

              <ErrorMessage
                name="description"
                component="div"
                className="text-red-500 text-sm"
              />

              <Field
                type="number"
                name="price"
                className="w-full p-2 border rounded"
              />

              <ErrorMessage
                name="price"
                component="div"
                className="text-red-500 text-sm"
              />

              <Field
                type="number"
                name="stock"
                className="w-full p-2 border rounded"
              />

              <ErrorMessage
                name="stock"
                component="div"
                className="text-red-500 text-sm"
              />

              <Field
                as="select"
                name="category"
                className="w-full p-2 border rounded"
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
                id="productImages"
                type="file"
                multiple
                className="hidden"
                onChange={(e) => {
                  const files = Array.from(e.target.files);

                  if (
                    existingImages.length + newImages.length + files.length >
                    5
                  ) {
                    toast.error("Maximum 5 images allowed");
                    return;
                  }
                  const formatted = files.map((file) => ({
                    file: file,
                    image_url: URL.createObjectURL(file),
                  }));

                  setNewImages((prev) => [...prev, ...formatted]);

                  const total =
                    existingImages.length + newImages.length + formatted.length;

                  setFieldValue("image", total > 0 ? true : "");
                }}
              />
              <label
                htmlFor="productImages"
                className="border px-4 py-2 rounded cursor-pointer bg-gray-100"
              >
                Choose Images
              </label>

              <p className="text-sm text-gray-500">
                {existingImages.length + newImages.length}/5 images selected
              </p>

              {/* IMAGE PREVIEW */}
              <div className="flex gap-4 flex-wrap mb-4">
                {/* Existing Images */}
                {existingImages.map((img, index) => (
                  <div key={index} className="relative">
                    <img
                      src={img.image_url}
                      alt=""
                      className="w-28 h-28 object-cover rounded-md border"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(index, setFieldValue)}
                      className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex justify-center rounded-full font-semibold"
                    >
                      ✕
                    </button>
                  </div>
                ))}

                {/* New Images */}
                {newImages.map((img, index) => (
                  <div key={index} className="relative">
                    <img
                      src={img.image_url}
                      alt=""
                      className="w-28 h-28 object-cover rounded-md border"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(index, setFieldValue)}
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
                  UpdateProduct
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </SellerLayout>
  );
};

export default EditProduct;
