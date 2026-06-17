import React from "react";
import SellerLayout from "../../components/SellerLayout";
import { useEffect, useState } from "react";
import api from "../../services/Api";

const Sellerdashboard = () => {
  const [stats,setStats] = useState({
 total_sales:0,
 pending_orders:0,
 total_products:0
});

useEffect(()=>{

const loadStats = async()=>{

 try{
  const res = await api.get("/products/seller-dashboardpage");
  setStats(res.data);
 }
 catch(err){
  console.log(err);
 }

};

loadStats();

},[]);

const compactNumber = (num) => {
  const formatter = new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 1
  });

  return formatter.format(num);
};
  return (
    <SellerLayout>
      <div className="p-6 card-glow rounded-lg bg-white dark:bg-[#161b22]">
        <h1 className="text-3xl font-bold">Seller Dashboard</h1>
        <p className="text-gray-600 mt-2">Overview of your sales, products & revenue.</p>

        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="bg-white p-4 rounded shadow dark:bg-[#161b22]">
            <h2 className="font-semibold card-label">Total Sales</h2>
            <p className="card-number"><h2>₹{compactNumber(stats.total_sales)}</h2></p>
          </div>

          <div className="bg-white p-4 rounded shadow dark:bg-[#161b22]">
            <h2 className="font-semibold card-label">Pending Orders</h2>
            <p className="card-number"><h2>{compactNumber(stats.pending_orders)}</h2></p>
          </div>

          <div className="bg-white p-4 rounded shadow dark:bg-[#161b22]">
            <h2 className="font-semibold card-label">Total Products</h2>
            <p className="card-number"><h2>{compactNumber(stats.total_products)}</h2></p>
          </div>

          <div className="bg-white p-4 rounded shadow dark:bg-[#161b22]">
            <h2 className="font-semibold card-label">Completed Orders</h2>
            <p className="card-number"><h2>{compactNumber(stats.completed_orders)}</h2></p>
          </div>
        </div>
      </div>
    </SellerLayout>
  );
};

export default Sellerdashboard;
