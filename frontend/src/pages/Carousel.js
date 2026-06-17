
import React, { useState, useEffect } from "react";
import banner1 from "../assets/motog-54.png";
import banner2 from "../assets/iphone12.webp";
import banner3 from "../assets/SamsungS25.png";

// Use images from src/assets/ by importing them (bundled by the React build).
const images = [banner1, banner2, banner3];

const Carousel = () => {

  const [index, setIndex] = useState(0);

  useEffect(() => {

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);

  }, []);

  const prevSlide = () => {
    setIndex(index === 0 ? images.length - 1 : index - 1);
  };

  const nextSlide = () => {
    setIndex((index + 1) % images.length);
  };

  return (
    <div className="relative w-full h-[350px] overflow-hidden">

      <img
        src={images[index]}
        alt={`slide-${index}`}
        className="w-full h-full object-cover"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = "https://via.placeholder.com/1200x400?text=Image+Not+Found";
        }}
      />

      {/* left */}
      <button
        onClick={prevSlide}
        className="absolute left-5 top-1/2 bg-black/40 text-white px-3 py-1"
      >
        ❮
      </button>

      {/* right */}
      <button
        onClick={nextSlide}
        className="absolute right-5 top-1/2 bg-black/40 text-white px-3 py-1"
      >
        ❯
      </button>

    </div>
  );
};

export default Carousel;