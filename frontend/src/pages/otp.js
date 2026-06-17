import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/Api";

const OtpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Email passed from Signup Page
  const email = location.state?.email;

  const [otp, setOtp] = useState("");

  const [Resendloading, setResendloading] = useState(false);
  const [loading, setloading] = useState(false);


  // Resend OTP Timer (30 seconds)
  const [resendTimer, setResendTimer] = useState(30);

  // OTP Expiry Time (5 minutes = 300 seconds)
  const [otpTimer, setOtpTimer] = useState(300);

  // Start countdown timers on mount
  useEffect(() => {
    const resendInterval = setInterval(() => {
      setResendTimer((t) => (t > 0 ? t - 1 : 0));
    }, 1000);

    const otpInterval = setInterval(() => {
      setOtpTimer((t) => (t > 0 ? t - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(resendInterval);
      clearInterval(otpInterval);
    };
  }, []);

  // Timer formatter (MM:SS)
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // RESEND OTP
  const handleResendOTP = async () => {
    if (resendTimer > 0) return; // prevent resend before timer ends

    try {
      setResendloading(true);

      await api.post("/auth/send-otp", { email });
      toast.success("New OTP sent successfully");

      // reset resend timer to 30 sec
      setResendTimer(30);

      // reset OTP expiry
      setOtpTimer(300);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setResendloading(false);
    }
  };

  // VERIFY OTP

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!otp) {
      toast.error("OTP is required");
      return;
    }

    if (otpTimer === 0) {
      toast.error("OTP expired! Please resend a new one.");
      return;
    }

    try {
      setloading(true);

      await api.post("/auth/verify-otp", { email, otp });

      toast.success("OTP Verified Successfully!");

      navigate("/"); // Redirects to LOGIN
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    } finally {
      setloading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-xl font-bold text-center">Verify OTP</h2>

        <p className="text-sm mt-2 text-gray-700">
          OTP sent to <strong>{email}</strong>
        </p>

        {/* OTP EXPIRY TIMER */}
        <p className="text-center text-sm text-red-600 mt-1">
          OTP expires in: <b>{formatTime(otpTimer)}</b>
        </p>

        <form onSubmit={handleVerify} className="mt-4 space-y-3">
          <input
            type="text"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="border p-2 w-full rounded text-center tracking-widest"
            placeholder="Enter OTP"
          />

          <button
            type="submit"
            disabled={loading || otpTimer === 0}
            className="w-full bg-blue-600 text-white p-2 rounded disabled:bg-blue-300"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        {/* RESEND OTP BUTTON + TIMER */}
        <button
          onClick={handleResendOTP}
          disabled={resendTimer > 0}
          className="w-full mt-3 bg-gray-700 text-white p-2 rounded disabled:bg-gray-400"
        >
          {resendTimer > 0
            ? `Resend OTP in ${resendTimer}s`
            : "Resend OTP"}
        </button>

        {/* BACK TO SIGNUP */}
        <button
          onClick={() => navigate("/signup")}
          className="w-full mt-3 text-blue-600 underline text-sm"
        >
          Back to Signup
        </button>
      </div>
    </div>
  );
};

export default OtpPage;
