import React from "react";

const DevelopmentPage = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-300">
      <div className="text-center">

        <h1 className="text-6xl font-bold text-blue-600">🚧</h1>

        <h2 className="text-2xl font-semibold mt-4">
          Feature Still in Development
        </h2>

        <p className="text-gray-500 mt-2">
          This page will be available soon.
        </p>

        <button
          onClick={() => window.history.back()}
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg"
        >
          Go Back
        </button>

      </div>
    </div>
  );
};

export default DevelopmentPage;