import { Formik, Form, Field, ErrorMessage } from "formik";
import { AdminLoginSchema } from "../../Validation/AdminValidation";
import api from "../../services/Api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";

const AdminLogin = () => {

  const navigate = useNavigate();

  const { login } = useContext(AuthContext); //  correct login


  const handleSubmit = async (values) => {

    try {

      const res = await api.post(
        "/admin/login",
        values
      );

      if (res.data.user.role !== "admin") {
        toast.error("Not admin credentials");
        return;
      }


      if (res.data.user.role === "admin") {

        //localStorage.removeItem("user");
        localStorage.removeItem("buyer_token");
        localStorage.removeItem("seller_token");

        localStorage.setItem(
          "admin_token",
          res.data.token
        );

        localStorage.setItem(
          "user",
          JSON.stringify(res.data.user)
        );

        localStorage.setItem(
          "role",
          "admin"
        );

        login(res.data.user); //  AuthContext login

      }


      toast.success("Admin login success");

      navigate("/admin/dashboard");


    } catch (err) {

      console.error(
        "AdminLogin error",
        err.response?.data || err.message
      );

      const message =
        err.response?.data?.message ||
        "Login failed";

      toast.error(message);

    }

  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-[#0d1117]">

      <div className="bg-white dark:bg-[#161b22] p-8 rounded shadow w-96">

        <h2 className="text-2xl font-bold mb-5 text-center">
          Admin Login
        </h2>

        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={AdminLoginSchema}
          onSubmit={handleSubmit}
        >
          <Form className="space-y-4">

            {/* Email */}

            <div>
              <label>Email</label>

              <Field
                name="email"
                type="email"
                className="w-full border p-2 rounded"
              />

              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Password */}

            <div>
              <label>Password</label>

              <Field
                name="password"
                type="password"
                className="w-full border p-2 rounded"
              />

              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Button */}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-2 rounded"
            >
              Login
            </button>

          </Form>
        </Formik>

      </div>

    </div>
  );
};

export default AdminLogin;