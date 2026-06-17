import React, { useEffect, useState } from "react";
import Adminsidebar from "./Admin/Adminsidebar";
import Adminnavbar from "./Admin/Adminnavbar";
import Footer from "../pages/Footer";

const AdminLayout = ({ children }) => {

  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

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

      {/* SIDEBAR */}
      <Adminsidebar theme={theme} setTheme={setTheme} />

      {/* RIGHT SIDE */}
      <div className="ml-64 w-full bg-gray-50 dark:bg-[#0d1117] text-black dark:text-gray-200 flex flex-col min-h-screen">

        {/* NAVBAR */}
        <Adminnavbar />

        {/* CONTENT */}
        <div className="p-6 flex-grow">

          {children}

        </div>

        {/* FOOTER */}
        <Footer />

      </div>

    </div>

  );

};

export default AdminLayout;