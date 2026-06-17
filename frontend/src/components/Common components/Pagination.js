import React from "react";

const Pagination = ({ page, totalPages, setPage }) => {
  return (
    <div className="flex items-center justify-center gap-3 mt-6">

      <button
        disabled={page <= 1}
        onClick={() => setPage(p => p - 1)}
        className={`px-4 py-2 rounded-lg border shadow-sm ${
          page <= 1
            ? "opacity-30 cursor-not-allowed"
            : "hover:bg-gray-200 dark:hover:bg-gray-700"
        }`}
      >
        Prev
      </button>

      <span className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow">
        {page}
      </span>

      <button
        disabled={page >= totalPages}
        onClick={() => setPage(p => p + 1)}
        className={`px-4 py-2 rounded-lg border shadow-sm ${
          page >= totalPages
            ? "opacity-30 cursor-not-allowed"
            : "hover:bg-gray-200 dark:hover:bg-gray-700"
        }`}
      >
        Next
      </button>

    </div>
  );
};

export default Pagination;