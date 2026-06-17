import React, { useEffect, useState } from "react";
import Sellersidebar from "./Seller/Sellersidebar";
import Sellernavbar from "./Seller/Sellernavbar";
import Footer from "../pages/Footer";
import SellerblockedEffect from "./SellerblockedEffect";

const SellerLayout = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [user, setuser] = useState(null);

  useEffect(() => {
    const fetchuser = JSON.parse(localStorage.getItem("user"));
    setuser(fetchuser);
    console.log("USER status:", fetchuser?.seller_status);
  }, []);

  // Apply theme to <html>
  useEffect(() => {
    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  return (
    <div className="flex">
      <Sellersidebar theme={theme} setTheme={setTheme} />

      <div className="ml-64 w-full min-h-screen bg-gray-50 dark:bg-[#0d1117] text-black dark:text-gray-200 transition flex flex-col">
        <Sellernavbar />
        {user?.seller_status !== "approved" && (
          <div className="bg-red-100 text-red-600 text-center py-2">
            Limited access - Waiting for admin approval
          </div>
        )}
        {user?.seller_status !== "approved" ? (
          <SellerblockedEffect user={user} />
        ) : (
          <div className="p-6 flex-1">{children}</div>
        )}

        <Footer />
      </div>
    </div>
  );
};

export default SellerLayout;
