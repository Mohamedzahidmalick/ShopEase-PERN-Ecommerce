const Loader = () => {
  return (
    <div className="flex justify-center items-center py-10">
      <div className="dot-spinner">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="dot-spinner__dot"></div>
        ))}
      </div>
    </div>
  );
};

export default Loader;