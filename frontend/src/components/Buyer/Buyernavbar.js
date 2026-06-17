import React, { useEffect, useState } from "react";
import { ShoppingCart, UserCircle, Search } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../../Context/CartContext";
import BuyerProfileDropdown from "../Profiledropdown/BuyerprofileDropdown";

const BuyerNavbar = () => {
  const { cartCount, refreshCart } = useCart();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    refreshCart(); //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      navigate(
        `/buyer/products?search=${encodeURIComponent(searchTerm.trim())}`,
      );
    }
  };

  return (
    <div
      className="w-full h-16 
                    bg-[#0A0D2E] 
                    border-b border-[#13183C]
                    flex items-center justify-between px-6"
    >
      <h1 className="text-2xl font-bold text-[#00E7FF] tracking-wide">
        ShopEase
      </h1>

      {/* Search Box */}
      <div
        className="flex items-center gap-3 
                      bg-[#13183C] 
                      px-4 py-2 rounded-lg"
      >
        <Search size={20} className="text-[#C8D0E0]" />
        <input
          type="text"
          placeholder="Search for products..."
          className="bg-transparent outline-none text-white dark:text-gray-200 w-72"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleSearch}
        />
      </div>

      {/* Icons */}
      <div className="flex items-center gap-6 text-[#00E7FF]">
        <NavLink to="/buyer/cart" className="relative">
          <ShoppingCart size={24} />

          {cartCount > 0 && (
            <span
              className="absolute -top-2 -right-2
              bg-red-500 text-white text-xs
              w-5 h-5 rounded-full flex items-center justify-center"
            >
              {cartCount}
            </span>
          )}
        </NavLink>

        <BuyerProfileDropdown user={UserCircle} />
      </div>
    </div>
  );
};

export default BuyerNavbar;
