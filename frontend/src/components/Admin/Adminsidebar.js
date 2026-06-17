import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingBag,
  Settings,
  List,
  UserCheck
} from "lucide-react";

import { NavLink } from "react-router-dom";

const AdminSidebar = () => {
  const menu = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all
    ${
      isActive
        ? "bg-[#0FE3F0]/20 text-[#00E7FF]"
        : "text-[#C8D0E0] hover:bg-[#1C224A]"
    }`;

  return (
    <div className="w-64 fixed h-full bg-[#0A0D2E] border-r border-[#13183C]">
      <div className="h-16 flex items-center px-6 border-b border-[#13183C]">
        <h1 className="text-2xl font-bold text-[#00E7FF]">Admin</h1>
      </div>

      <nav className="p-4 space-y-2">
        <NavLink to="/admin/dashboard" className={menu}>
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>

        <NavLink to="/admin/users" className={menu}>
          <Users size={20} />
          Users
        </NavLink>

        <NavLink to="/admin/products" className={menu}>
          <Package size={20} />
          Products
        </NavLink>

        <NavLink to="/admin/orders" className={menu}>
          <ShoppingBag size={20} />
          Orders
        </NavLink>

        <NavLink to="/admin/categories" className={menu}>
          <List size={20} />
          Categories
        </NavLink>

        <NavLink to="/admin/settings" className={menu}>
          <Settings size={20} />
          Settings
        </NavLink>

        <NavLink  to="/admin/seller-requests" className={menu}>
          <UserCheck /> <span className="max-w-[120px] truncate" title="Seller Approval Requests">
            Seller Approval Requests
          </span>
        </NavLink>
      </nav>
    </div>
  );
};

export default AdminSidebar;
