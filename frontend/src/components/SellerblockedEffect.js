import React from "react";

const SellerblockedEffect = ({ user, children }) => {
  if (!user) return <div>Loading.....</div>;

  if (user.seller_status === "pending") {
    return (
      <div className="text-center p-10">
        <h2 className="text-yellow-500 text-xl font-semibold">
          Your account is under review
        </h2>
        <p>Please wait for admin approval</p>
      </div>
    );
  }

  if (user.seller_status === "rejected") {
    return (
      <div className="text-center p-10">
        <h2 className="text-red-500 text-xl font-semibold">
          Your account was rejected
        </h2>
        <p>Contact admin for support</p>
      </div>
    );
  }


  return children;
};

export default SellerblockedEffect;