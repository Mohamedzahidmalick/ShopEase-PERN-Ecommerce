import React, { useState } from "react";
import BuyerLayout from "../../../components/BuyerLayout";
import UpdateEmail from "./Buyer_update_email";
import BuyerChangePassword from "./Buyer_Change_password"

const BuyerSettings = () => {
  const [tab, setTab] = useState("password");

  return (
    <BuyerLayout>
      <div className="max-w-xl mx-auto bg-white dark:bg-[#161b22] p-6 rounded-xl shadow">

        <h2 className="text-2xl font-bold mb-4">Settings</h2>

        {/* Tabs */}
        <div className="flex gap-5 border-b mb-6">
          <button
            onClick={() => setTab("password")}
            className={`pb-2 px-3 text-lg transition-all ${
              tab === "password"
                ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
                : "text-gray-500 hover:text-blue-500"
            }`}
          >
            Change Password
          </button>

          <button
            onClick={() => setTab("email")}
            className={`pb-2 px-3 text-lg transition-all ${
              tab === "email"
                ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
                : "text-gray-500 hover:text-blue-500"
            }`}
          >
            Update Email
          </button>
        </div>

        {tab === "password" && <BuyerChangePassword />}
        {tab === "email" && <UpdateEmail />}
      </div>
    </BuyerLayout>
  );
};

export default BuyerSettings;