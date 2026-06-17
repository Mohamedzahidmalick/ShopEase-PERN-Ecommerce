import React, { useState } from "react";
import SellerLayout from "../../SellerLayout";
import ChangePassword from "./Seller_change_password";
import UpdateEmail from "./Seller_update_email";

const SellerSettings = () => {
  const [tab, setTab] = useState("password");

  return (
    <SellerLayout>
      <div className="max-w-xl mx-auto bg-white dark:bg-[#161b22] p-6 rounded-xl shadow">

        <h2 className="text-2xl font-bold mb-4">Settings</h2>

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
        {tab === "password" && <ChangePassword />}
        {tab === "email" && <UpdateEmail />}
      </div>
    </SellerLayout>
  );
};

export default SellerSettings;