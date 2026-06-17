import React, { useState, useEffect } from "react";
import api from "../../../services/Api";
import { toast } from "react-toastify";
import { Mail, KeyRound, Loader2, CheckCircle } from "lucide-react";

import { Formik, Form, Field, ErrorMessage } from "formik";

import {
  NewEmailSchema,
  OtpSchema,
} from "../../../Validation/EmailupdateValidation";

const BuyerUpdateEmail = () => {
  const [step, setStep] = useState(1);
  const [newEmail, setNewEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [showReLoginModal, setShowReLoginModal] = useState(false);

  // -------- TIMER --------
  useEffect(() => {
    if (timer > 0) {
      const t = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [timer]);

  // -------- STEP UI --------
  const StepUI = ({ step }) => {
    const renderCircle = (num) => {
      // COMPLETED → tick
      const totalsteps = 3;
      if (step > num || step === totalsteps) {
        return (
          <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center">
            ✓
          </div>
        );
      }

      // CURRENT STEP → blue number
      if (step === num) {
        return (
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
            {num}
          </div>
        );
      }

      // FUTURE STEP → gray
      return (
        <div className="w-8 h-8 rounded-full bg-gray-300 text-white flex items-center justify-center">
          {num}
        </div>
      );
    };
    return (
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col items-center w-full">
          {renderCircle(1)}
          <span className="text-sm mt-1">Email</span>
        </div>

        <div className="flex-1 h-[2px] bg-gray-300 mx-2" />

        <div className="flex flex-col items-center w-full">
          {renderCircle(2)}
          <span className="text-sm mt-1">OTP</span>
        </div>

        <div className="flex-1 h-[2px] bg-gray-300 mx-2" />

        <div className="flex flex-col items-center w-full">
          {renderCircle(3)}
          <span className={`text-sm mt-1 ${step >= 3 ? "text-green-600" : ""}`}>
            Done
          </span>
        </div>
      </div>
    );
  };

  // ---------- SEND OTP ----------

  const sendOtp = async (values) => {
    try {
      setLoading(true);

      await api.post(
        "/buyer/email/send-otp",
        { new_email: values.newEmail },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("buyer_token")}`,
          },
        },
      );

      setNewEmail(values.newEmail);

      toast.success("OTP sent");

      setStep(2);

      setTimer(30);
    } catch {
      toast.error("Failed");
    } finally {
      setLoading(false);
    }
  };

  // ---------- VERIFY ----------

  const verifyOtp = async (values) => {
    try {
      setLoading(true);

      await api.post(
        "/buyer/email/verify-otp",
        {
          new_email: newEmail,
          otp: values.otp,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("buyer_token")}`,
          },
        },
      );

      toast.success("Email updated successfully");

      // ✅ save email for login prefill
      localStorage.setItem("last_email", newEmail);

      // ✅ go success step
      setStep(3);

      // ✅ show modal
      setShowReLoginModal(true);
    } catch {
      toast.error("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (showReLoginModal) {
      const logoutTimer = setTimeout(() => {
        localStorage.clear();
        window.location.href = "/";
      }, 5000);

      return () => clearTimeout(logoutTimer);
    }
  }, [showReLoginModal]);

  return (
    <div className="space-y-5">
      <StepUI step={step} />

      {/* -------- STEP 1 -------- */}
      {step === 1 && (
        <Formik
          initialValues={{ newEmail: "" }}
          validationSchema={NewEmailSchema}
          onSubmit={sendOtp}
        >
          <Form className="space-y-5">
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={18} />

              <Field
                name="newEmail"
                type="email"
                placeholder="Enter New Email"
                className="w-full border p-3 pl-10 rounded"
              />
            </div>

            <ErrorMessage
              name="newEmail"
              component="div"
              className="text-red-500 text-sm"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded flex justify-center"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Send OTP"}
            </button>
          </Form>
        </Formik>
      )}

      {/* -------- STEP 2 -------- */}
      {step === 2 && (
        <Formik
          initialValues={{ otp: "" }}
          validationSchema={OtpSchema}
          onSubmit={verifyOtp}
        >
          <Form className="space-y-5">
            <div className="relative">
              <KeyRound
                className="absolute left-3 top-3 text-gray-400"
                size={18}
              />

              <Field
                name="otp"
                placeholder="Enter OTP"
                className="w-full border p-3 pl-10 rounded"
              />
            </div>

            <ErrorMessage
              name="otp"
              component="div"
              className="text-red-500 text-sm"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded flex justify-center"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Verify OTP"}
            </button>

            {/* RESEND */}
            <div className="text-sm text-center">
              {timer > 0 ? (
                `Resend in ${timer}s`
              ) : (
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-blue-600"
                >
                  Resend OTP
                </button>
              )}
            </div>
          </Form>
        </Formik>
      )}

      {/* -------- STEP 3 -------- */}
      {step === 3 && (
        <div className="text-center text-green-600 flex flex-col items-center gap-2">
          <CheckCircle size={40} />
          Email updated successfully
        </div>
      )}
      {showReLoginModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl text-center w-80 animate-scaleIn">
            <h2 className="text-lg font-semibold mb-2">Re-login Required</h2>

            <p className="text-gray-600 mb-4">
              Your email has been updated successfully.
              <br />
              You will be logged out for security reasons.
            </p>

            <button
              onClick={() => {
                localStorage.clear(); //  logout
                window.location.href = "/";
              }}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Login Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerUpdateEmail;
