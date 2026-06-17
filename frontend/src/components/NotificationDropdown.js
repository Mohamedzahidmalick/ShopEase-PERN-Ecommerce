import React, { useState,useRef,useEffect } from "react";
import { useNavigate } from "react-router-dom";


const NotificationDropdown = ({ notifications }) => {
    
    const navigate = useNavigate();
  const [open, setOpen] = useState(false);
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

  return (
    <div ref={popupRef} className="relative">

      <button
        onClick={() => setOpen(!open)}
        className="relative text-xl"
      >
        <button className="button ">
          <svg viewBox="0 0 448 512" className="bell ">
            <path d="M224 0c-17.7 0-32 14.3-32 32V49.9C119.5 61.4 64 124.2 64 200v33.4c0 45.4-15.5 89.5-43.8 124.9L5.3 377c-5.8 7.2-6.9 17.1-2.9 25.4S14.8 416 24 416H424c9.2 0 17.6-5.3 21.6-13.6s2.9-18.2-2.9-25.4l-14.9-18.6C399.5 322.9 384 278.8 384 233.4V200c0-75.8-55.5-138.6-128-150.1V32c0-17.7-14.3-32-32-32zm0 96h8c57.4 0 104 46.6 104 104v33.4c0 47.9 13.9 94.6 39.7 134.6H72.3C98.1 328 112 281.3 112 233.4V200c0-57.4 46.6-104 104-104h8zm64 352H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7s18.7-28.3 18.7-45.3z"></path>
          </svg>
        </button>

        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
            {notifications.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-80 bg-[#0A0D2E] shadow-lg rounded-lg p-4">

          <div className="flex justify-between mb-3">
            <h4 className="font-semibold">Notifications</h4>
            <button onClick={() => navigate("/seller/notifications")} className=" text-sm">
              View All
            </button>
          </div>

          {notifications.length === 0 ? (
            <p className="text-white text-center">
              You're all up-to-date
            </p>
          ) : (
            notifications.map((n, i) => (
              <div key={i} className="border-b py-2">
                {n.message}
              </div>
            ))
          )}

        </div>
      )}

    </div>
  );
};

export default NotificationDropdown;