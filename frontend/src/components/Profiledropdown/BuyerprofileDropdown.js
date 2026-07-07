import React, { useContext,useState,useRef,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { AuthContext } from "../../Context/AuthContext";


const ProfileDropdown = () => {
  const { user, logout } = useContext(AuthContext);

  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const popupRef = useRef();

  useEffect(() => {
      function handleClickOutside (event){
        if (popupRef.current && !popupRef.current.contains(event.target)) {
          setOpen(false);
        }
      }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    }, []);       

  const Logout = () => {
    //localStorage.removeItem("buyer_token");
    //localStorage.removeItem("seller_token");
    logout();
    navigate("/");
  };

  const menuItems = ({ isActive }) =>
  `
  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
  ${
    isActive
      ? "bg-gradient-to-r from-[#00E7FF33] to-[#00E7FF11] text-[#00E7FF] shadow-[0_0_15px_#00E7FF66]"
      : "text-[#C8D0E0] hover:bg-[#13183C] hover:text-[#00E7FF]"
  }
`;
  return (
    <div ref={popupRef} className="relative">

      {/* Profile Area */}
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 cursor-pointer"
      >

        <img
          src={user?.image ? `${process.env.REACT_APP_API_URL}${user.image}` : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
          alt="profile"
          className="w-10 h-10 rounded-full object-cover border border-[#00E7FF]"
        />

        <div className="flex items-center gap-2">
  <div className="leading-tight">
    <p className="text-sm font-semibold">{user?.name}</p>
    <p className="text-xs text-gray-300">{user?.email}</p>
  </div>
  <ChevronDown
    size={18}
    className={`transition ${open ? "rotate-180" : ""}`}
  />
</div>

      </div>


      {/* Dropdown */}
        {open && (
        <div className="absolute right-0 mt-3 w-56 z-50 bg-[#0A0D2E] border border-[#13183C] text-[#C8D0E0] rounded-xl shadow-xl overflow-hidden">

          <button
            onClick={() => navigate("/buyer/profile")}
            className={`w-full text-left px-4 py-3 hover:bg-[#13183C] ${menuItems({ isActive: false })}`}
          >
            Profile
          </button>

          <button
            onClick={() => navigate("/buyer/notifications")}
            className={`w-full text-left px-4 py-3 hover:bg-[#13183C] ${menuItems({ isActive: false })}`}
          >
            Notifications
          </button>

          <button
            onClick={Logout}
            className="w-full text-left px-4 py-3 hover:text-red-400"
          >
            Logout
          </button>

        </div>
      )}

    </div>
  );
};

export default ProfileDropdown;