import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ChevronDown} from "lucide-react";

const AdminNavbar = () => {
  const { user, logout } = useContext(AuthContext);

  const [open, setOpen] = useState(false);
  const ref = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("admin_token");
    navigate("/admin/login");
  };

  const menuItems = () =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
     text-[#C8D0E0] hover:bg-[#13183C] hover:text-[#00E7FF]`;

  return (
    <div className="h-16 bg-[#0A0D2E] text-white flex items-center justify-between px-6 border-b border-[#13183C]">

      {/* LEFT */}
      <h1 className="text-xl font-bold text-[#00E7FF]">
        Admin Panel
      </h1>

      {/* RIGHT PROFILE */}
      <div ref={ref} className="relative">

        {/* PROFILE HEADER */}
        <div
          onClick={() => setOpen(!open)}
          className="flex items-center gap-3 cursor-pointer text-[#00E7FF]"
        >
          <img
            src={
              user?.image
                ? `${process.env.REACT_APP_API_URL}${user.image}`
                : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            }
            className="w-10 h-10 rounded-full object-cover border border-[#00E7FF]"
            alt=""
          />

          <div className="leading-tight">
            <p className="text-sm font-semibold">{user?.name}</p>
            <p className="text-xs text-gray-300">{user?.email}</p>
          </div>

          <ChevronDown
            size={18}
            className={`transition ${open ? "rotate-180" : ""}`}
          />
        </div>

        {/* DROPDOWN */}
        {open && (
          <div className="absolute right-0 mt-3 w-56 z-50 bg-[#0A0D2E] border border-[#13183C] text-[#C8D0E0] rounded-xl shadow-xl overflow-hidden">

            <button
              onClick={() => navigate("/admin/profile")}
              className={` w-full text-left px-4 py-3 hover:bg-[#13183C] ${menuItems()}`}
            >
              Profile
            </button>

            <button
              onClick={() => navigate("/admin/dashboard")}
              className={` w-full text-left px-4 py-3 hover:bg-[#13183C] ${menuItems()}`}
            >
              Dashboard
            </button>

            <button
              onClick={() => navigate("/admin/users")}
              className={` w-full text-left px-4 py-3 hover:bg-[#13183C] ${menuItems()}`}
            >
              Manage Users
            </button>

            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 hover:text-red-400"
            >
              Logout
            </button>

          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNavbar;