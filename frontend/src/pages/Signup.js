import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { registeruser, sendOTP } from "../services/Authservices";
import Images from "../assets/IMG.jpg";
import { Eye, EyeOff } from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  //  Validation Schema (converted from your old logic)
  const validationSchema = Yup.object({
    first_name: Yup.string()
      .min(2, "Too short")
      .max(50, "Too long")
      .required("First name is required"),

    last_name: Yup.string()
      .min(2, "Too short")
      .max(50, "Too long")
      .required("Last name is required"),

    email: Yup.string().email("Invalid email").required("Email is required"),

    phone_no: Yup.string()
      .matches(/^[6-9][0-9]{9}$/, "Invalid phone number")
      .required("Phone number is required"),

    password: Yup.string()
      .min(6, "Minimum 6 characters")
      .required("Password is required"),

    role: Yup.string().required("Role is required"),
  });

  //  Formik setup (keeping your backend logic)
  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone_no: "",
      password: "",
      role: "",
    },
    validationSchema,

    onSubmit: async (values) => {
      setLoading(true);
      try {
        await registeruser(values);
        await sendOTP({ email: values.email });

        toast.success("Signup successful, OTP sent");
        navigate("/otp", { state: { email: values.email } });
      } catch (err) {
        toast.error(err.response?.data?.message || "Signup failed");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-300 to-purple-200">
      <div className="flex w-[900px] bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* LEFT SIDE IMAGE */}
        <div className="w-1/2  bg-gray-100 flex items-center justify-center p-6">
          <img
            src={Images}
            alt="signup"
            className="w-full object-contain mix-blend-multiply"
          />
        </div>

        {/* RIGHT SIDE FORM */}
        <div className="w-1/2 flex items-center justify-center p-10">
          <div className="w-full max-w-sm">
            <h2 className="text-2xl font-bold mb-6 text-center">Signup</h2>

            <form onSubmit={formik.handleSubmit} className="space-y-3">
              {/* FIRST NAME */}
              <input
                type="text"
                name="first_name"
                placeholder="First Name"
                value={formik.values.first_name}
                onChange={formik.handleChange}
                className="w-full p-3 border rounded-lg"
              />
              {formik.errors.first_name && (
                <p className="text-red-500 text-sm">
                  {formik.errors.first_name}
                </p>
              )}

              {/* LAST NAME */}
              <input
                type="text"
                name="last_name"
                placeholder="Last Name"
                value={formik.values.last_name}
                onChange={formik.handleChange}
                className="w-full p-3 border rounded-lg"
              />
              {formik.errors.last_name && (
                <p className="text-red-500 text-sm">
                  {formik.errors.last_name}
                </p>
              )}

              {/* EMAIL */}
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formik.values.email}
                onChange={(e) => {
                  formik.handleChange(e);
                  formik.setFieldValue("email", e.target.value.toLowerCase());
                }}
                className="w-full p-3 border rounded-lg"
              />
              {formik.errors.email && (
                <p className="text-red-500 text-sm">{formik.errors.email}</p>
              )}

              {/* PHONE */}
              <input
                type="text"
                name="phone_no"
                placeholder="Phone Number"
                value={formik.values.phone_no}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                  formik.setFieldValue("phone_no", value);
                }}
                className="w-full p-3 border rounded-lg"
              />
              {formik.errors.phone_no && (
                <p className="text-red-500 text-sm">{formik.errors.phone_no}</p>
              )}

              {/* PASSWORD */}

              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  className="w-full p-3 border rounded-lg"
                />
                <span
                  className="absolute right-3 top-3 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
                {formik.errors.password && (
                  <p className="text-red-500 text-sm">
                    {formik.errors.password}
                  </p>
                )}
              </div>

              {/* ROLE */}
              <select
                name="role"
                value={formik.values.role}
                onChange={formik.handleChange}
                className="w-full p-3 border rounded-lg"
              >
                <option value="">Select Role</option>
                <option value="seller">Seller</option>
                <option value="buyer">Buyer</option>
                <option value="both">Both</option>
              </select>
              {formik.errors.role && (
                <p className="text-red-500 text-sm">{formik.errors.role}</p>
              )}

              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "SIGN UP"
                )}
              </button>
            </form>

            {/* LINK */}
            <p className="text-sm mt-4 text-center">
              Already have an account?{" "}
              <Link to="/" className="text-purple-600 cursor-pointer">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
