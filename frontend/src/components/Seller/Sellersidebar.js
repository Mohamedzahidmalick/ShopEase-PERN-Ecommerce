import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Package,
  BarChart,
  ShoppingBag,
  User,
  Ticket,
  Settings,
  Users,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Seller_logout.css";
import Confirmpopup from "../../Confirmpopup";
import { toast } from "react-toastify";

const Sellersidebar = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const [logoutConfirm, setlogoutConfirm] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const menuClasses = ({ isActive }) =>
    `
      flex items-center gap-3 px-4 py-3 rounded-lg transition-all
      ${
        isActive
          ? "bg-[#0FE3F0]/20 text-[#00E7FF] shadow-[0_0_10px_#00E7FF66]"
          : "text-[#C8D0E0] hover:bg-[#1C224A] hover:text-[#00E7FF]"
      }`;

  const logout = () => {
    localStorage.removeItem("seller_token");
    //localStorage.removeItem("buyer_token");

    toast.success("Logged out successfully");

    navigate("/");
  };

  return (
    <>
      <Confirmpopup
        open={logoutConfirm}
        onCancel={() => setlogoutConfirm(false)}
        onConfirm={logout}
        message="Are you sure you want to logout?"
      />
      <div className="w-64 h-screen bg-[#0A0D2E] border-r border-[#13183C] fixed flex flex-col">
        <div className="h-16 px-6 flex items-center justify-between border-b border-[#13183C]">
          <h1 className="text-2xl font-bold text-[#00E7FF]">Seller</h1>
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="p-2 bg-[#13183C] rounded-lg hover:bg-[#1C224A]"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <NavLink to="/seller/dashboard" className={menuClasses}>
            <LayoutDashboard size={20} /> Dashboard
          </NavLink>

          <NavLink to="/seller/products" className={menuClasses}>
            <Package size={20} /> Products
          </NavLink>

          <NavLink to="/seller/orders" className={menuClasses}>
            <ShoppingBag size={20} /> Orders
          </NavLink>

          <NavLink to="#" className={`cursor-not-allowed ${menuClasses({isActive: false})}`}>{/*to="/seller/analytics"*/}
            <BarChart size={20} /> Analytics
          </NavLink>


          <NavLink to="#" className={`cursor-not-allowed ${menuClasses({isActive: false})}`}>{/*to="/seller/customer"*/}
            <User size={20} /> Customer
          </NavLink>

          <NavLink to="/seller/settings" className={menuClasses}>
            <Settings size={20} /> Settings
          </NavLink>

          <NavLink to="#" className={`cursor-not-allowed ${menuClasses({isActive: false})}`}>{/*to="/seller/billing"*/ }
            <Ticket size={20} /> Billing
          </NavLink>

          <NavLink to="#" className={`cursor-not-allowed ${menuClasses({isActive: false})}`}>{/*to="/seller/employee"*/}
            <Users size={20} /> Employee
          </NavLink>

          
        </nav>

        <div className="p-4 border-t border-[#13183C]">
          <button onClick={() => setlogoutConfirm(true)} className=" Btn">
            <svg
              viewBox="0 0 512 512"
              style={{ width: "45px", height: "20px", marginTop: "0px" }}
            >
              <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
            </svg>

            <span className="text">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sellersidebar;
