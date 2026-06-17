import React from "react";
import BuyerSidebar from "./Buyer/Buyersidebar";
import BuyerNavbar from "./Buyer/Buyernavbar";
import Footer from "../pages/Footer";

const BuyerLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen ">
      <BuyerSidebar />

      <div className="ml-64 w-full min-h-screen bg-gray-50 dark:bg-[#0d1117] transition flex flex-col">
        <BuyerNavbar />
        <div className="p-4 flex-1">{children}</div>
        <Footer />
      </div>
      
    </div>
  );
};

export default BuyerLayout;
