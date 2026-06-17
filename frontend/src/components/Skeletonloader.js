const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 animate-pulse">
      <div className="h-40 bg-gray-300 rounded mb-4"></div>
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
    </div>
  );
};

export default SkeletonCard;