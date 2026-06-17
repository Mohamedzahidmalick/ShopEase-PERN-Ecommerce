import React from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const BuyerOrderSuccess = () => {
  const [params] = useSearchParams();
  const orderId = params.get("order");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">

      <div className="bg-white shadow-2xl rounded-2xl p-12 text-center max-w-lg w-full">

        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <CheckCircle size={70} className="text-green-600" />
        </div>

        {/* Heading */}
        <h1 className="text-4xl font-bold text-green-700">
          Order Placed Successfully!
        </h1>

        <p className="text-gray-600 mt-3">
          Thank you for shopping with us 🎉
        </p>

        {/* Order Info Box */}
        <div className="bg-gray-50 rounded-xl p-6 mt-8 shadow-inner">
          <p className="text-gray-500 text-sm">Order ID</p>
          <p className="text-3xl font-mono font-bold mt-1">
            #{orderId}
          </p>

          <div className="flex justify-center gap-4 mt-6">

            {/* Status */}
            <span className="px-4 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm font-semibold">
              Pending
            </span>

            {/* Payment */}
            <span className="px-4 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
              Paid
            </span>

          </div>
        </div>

        {/* Buttons */}
        <div className="mt-10 flex gap-4 justify-center">

          <Link
            to="/buyer/orders"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition"
          >
            View Orders
          </Link>

          <Link
            to="/buyer/dashboard"
            className="bg-gray-200 hover:bg-gray-300 px-6 py-3 rounded-lg transition"
          >
            Continue Shopping
          </Link>

        </div>

      </div>
    </div>
  );
};

export default BuyerOrderSuccess;
