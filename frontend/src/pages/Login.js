import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginUser } from "../services/Authservices";
import { AuthContext } from "../Context/AuthContext";
import { useFormik } from "formik";
import * as Yup from "yup";
import Images from "../assets/Login.png";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const savedEmail = localStorage.getItem("last_email");

  //  Validation Schema
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Minimum 6 characters")
      .required("Password is required"),
  });

  //  Formik Setup
  const formik = useFormik({
    initialValues: {
      email: savedEmail ?? "",
      password: "",
    },
    enableReinitialize: true, //  IMPORTANT
    validationSchema,

    onSubmit: async (values) => {
      setLoading(true);
      try {
        const result = await loginUser(values);

        toast.success("Login successful");

        const role = result.role;
        const token = result.token;
        const user = result.user;

        //  update context
        login(user);

        //  Role-based navigation (same as your old code)
        if (role === "seller") {
          localStorage.setItem("seller_token", token);
          localStorage.setItem("role", "seller");
          localStorage.removeItem("last_email"); //  ADD THIS
          navigate("/seller/dashboard");
        } else if (role === "buyer") {
          localStorage.setItem("buyer_token", token);
          localStorage.setItem("role", "buyer");
          localStorage.removeItem("last_email"); //  ADD THIS
          navigate("/buyer/dashboard");
        } else if (role === "admin") {
          localStorage.setItem("admin_token", token);
          localStorage.setItem("role", "admin");
          localStorage.removeItem("last_email"); //  ADD THIS
          navigate("/dashboard");
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Login failed");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-300 to-purple-200">
      <div className="flex w-[900px] bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* LEFT SIDE IMAGE */}
        <div className="w-1/2 bg-gray-100 flex items-center justify-center p-6">
          <img src={Images} alt="login" className="w-full object-contain" />
        </div>

        {/* RIGHT SIDE FORM */}
        <div className="w-1/2 flex items-center justify-center p-10">
          <div className="w-full max-w-sm">
            <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

            <form onSubmit={formik.handleSubmit} className="space-y-4">
              {/* EMAIL */}
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formik.values.email}
                  onChange={(e) =>
                    formik.setFieldValue("email", e.target.value.trim())
                  }
                  className="w-full p-3 border rounded-lg"
                />

                {formik.errors.email && (
                  <p className="text-red-500 text-sm">{formik.errors.email}</p>
                )}
              </div>

              {/* PASSWORD */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
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

              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition flex items-center justify-center"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "LOGIN"
                )}
              </button>
            </form>

            {/* LINK */}
            <p className="text-sm mt-4 text-center">
              Don't have an account?{" "}
              <Link to="/signup" className="text-purple-600 cursor-pointer">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
