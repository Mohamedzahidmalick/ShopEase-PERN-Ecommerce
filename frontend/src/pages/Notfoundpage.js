import { useNavigate } from "react-router-dom";

const NotFound = () => {
    const role = localStorage.getItem("role");

const goHome = () => {

  if (role === "admin") navigate("/admin/dashboard");

  else if (role === "seller") navigate("/seller/dashboard");

  else if (role === "buyer") navigate("/buyer/dashboard");

  else navigate("/");

};

  const navigate = useNavigate();

  return (

    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#0A0D2E] to-[#020617] text-white">

      {/* 404 text */}

      <h1 className="text-8xl font-bold text-[#00E7FF]">
        404
      </h1>

      <h2 className="text-3xl mt-4 font-semibold">
        Oops! Page not found
      </h2>

      <p className="text-gray-400 mt-2 text-center max-w-md">
        The page you are looking for does not exist or has been moved.
      </p>


      {/* Button */}

      <button
        onClick={goHome}
        className="mt-6 px-6 py-3 bg-[#00E7FF] text-black font-semibold rounded-lg hover:scale-105 transition"
      >
        Go back to Home
      </button>

    </div>

  );

};

export default NotFound;