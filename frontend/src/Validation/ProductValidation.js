import * as Yup from "yup";

export const ProductSchema = Yup.object({
   name: Yup.string()
    .min(3, "Minimum 3 characters")
    .required("Product name is required"),

  description: Yup.string()
    .min(45, "Description too short")
    .required("Description required"),

  price: Yup.number()
    .typeError("Price must be a number")
    .positive("Price must be positive")
    .required("Price required"),

  stock: Yup.number()
    .typeError("Stock must be a number")
    .min(0, "Stock cannot be negative")
    .required("Stock required"),

  category: Yup.string().required("Category required"),

  image: Yup.mixed().test(
    "required",
    "At least 1 image is required",
    (value) => {
      if (!value) return false;
      if (Array.isArray(value) && value.length === 0) return false;
      return true;
    }
  )

});