import React, { useState } from "react";
import api from "../../../services/Api";
import { toast } from "react-toastify";
import { Eye, EyeOff, Lock } from "lucide-react";
import "../../../../src/App.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { PasswordSchema } from "../../../Validation/PasswordValidation";
const SellerChangePassword = () => {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const passwordStrength = (password) => {
    if (!password) return "weak";

    const lengthRule = password.length >= 12;
    const uppercaseRule = /[A-Z]/.test(password);
    const lowercaseRule = /[a-z]/.test(password);
    const numberRule = /[0-9]/.test(password);
    const specialCharRule = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const passed = [
      lengthRule,
      uppercaseRule,
      lowercaseRule,
      numberRule,
      specialCharRule,
    ].filter(Boolean).length;

    if (passed <= 2) return "Weak";
    if (passed === 3 || passed === 4) return "Medium";
    return "Strong";
  };

  return (
    <Formik
      initialValues={{
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }}
      validationSchema={PasswordSchema}
      onSubmit={async (values, { resetForm ,setSubmitting}) => {
        if (values.currentPassword === values.newPassword) {
          return toast.error("New password cannot be same as old password");
        }

        try {
          await api.put(
            "/seller/change-password",
            {
              old_password: values.currentPassword,
              new_password: values.newPassword,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("seller_token")}`,
              },
            },
          );

          toast.success("Password updated successfully!");
          resetForm();
        } catch (err) {
          toast.error(
            err.response?.data?.message || "Failed to update password",
          );
        }finally{
          setSubmitting(false);
        }
      }}
    >
      {({ values,isSubmitting }) => (
        <Form className="space-y-5">
          {/* OLD PASSWORD */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={18} />

            <Field
              type={showOld ? "text" : "password"}
              name="currentPassword"
              placeholder="Old Password"
              className="w-full border p-3 pl-10 rounded"
            />

            <ErrorMessage
              name="currentPassword"
              component="div"
              className="text-red-500 text-sm"
            />

            <span
              onClick={() => setShowOld(!showOld)}
              className="absolute right-3 top-3 cursor-pointer"
            >
              {showOld ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>

          {/* NEW PASSWORD */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={18} />

            <Field
              type={showNew ? "text" : "password"}
              name="newPassword"
              placeholder="New Password"
              className="w-full border p-3 pl-10 rounded"
            />

            <ErrorMessage
              name="newPassword"
              component="div"
              className="text-red-500 text-sm"
            />

            <span
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-3 cursor-pointer"
            >
              {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>

          {/* PASSWORD STRENGTH */}
          {values.newPassword && (
            <p
              className={`text-sm font-semibold ${
                passwordStrength(values.newPassword) === "Weak"
                  ? "text-red-500"
                  : passwordStrength(values.newPassword) === "Medium"
                    ? "text-yellow-500"
                    : "text-green-500"
              }`}
            >
              {passwordStrength(values.newPassword)} password
            </p>
          )}

          {/* CONFIRM PASSWORD */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={18} />

            <Field
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              className="w-full border p-3 pl-10 rounded"
            />

            <ErrorMessage
              name="confirmPassword"
              component="div"
              className="text-red-500 text-sm"
            />

            <span
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-3 cursor-pointer"
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>

          <button
  type="submit"
  disabled={isSubmitting}
  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 disabled:opacity-70"
>
  {isSubmitting ? (
    <>
      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
    </>
  ) : (
    "Update Password"
  )}
</button>
        </Form>
      )}
    </Formik>
  );
};

export default SellerChangePassword;
