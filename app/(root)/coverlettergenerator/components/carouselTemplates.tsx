import Image from "next/image";
import React, { useState } from "react";

const TemplateCarousel = ({ images = [], onSelect }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handleSelect = (index) => {
    setCurrentIndex(index);
    if (onSelect) onSelect(index);
  };

  return (
    <div className="flex h-full flex-col items-center space-y-4 w-full">
      {/* Carousel */}
      <div className="flex justify-center items-center space-x-4 w-full">
        {/* Prev button */}
        <button
          onClick={handlePrev}
          className="hidden sm:block p-2 rounded-full bg-gray-200 hover:bg-gray-300"
        >
          ◀
        </button>

        {/* Images */}
        <div className="flex items-center h-full justify-center w-full sm:w-auto space-x-4">
          {images.map((img, index) => {
            // Desktop view: only render prev, current, next
            const isPrev =
              index === (currentIndex - 1 + images.length) % images.length;
            const isCurrent = index === currentIndex;
            const isNext = index === (currentIndex + 1) % images.length;

            if (!isPrev && !isCurrent && !isNext) return null;

            return (
              <Image
                key={index}
                src={img}
                alt={`template-${index}`}
                onClick={() => handleSelect(index)}
                className={`
                  cursor-pointer object-contain rounded-xl transition-all duration-300 
                  ${isCurrent
                    ? "w-48 h-64 sm:w-64 sm:h-80 shadow-xl border-4 border-blue-500 z-10"
                    : "hidden sm:block w-32 h-48 opacity-70 hover:opacity-100"
                  }
                `}
              />
            );
          })}
        </div>

        {/* Next button */}
        <button
          onClick={handleNext}
          className="hidden sm:block p-2 rounded-full bg-gray-200 hover:bg-gray-300"
        >
          ▶
        </button>
      </div>

      {/* Mobile buttons */}
      <div className="flex sm:hidden space-x-6">
        <button
          onClick={handlePrev}
          className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
        >
          ◀
        </button>
        <button
          onClick={handleNext}
          className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
        >
          ▶
        </button>
      </div>

      {/* Index indicator */}
      <div className="flex space-x-2">
        {images.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex ? "bg-blue-500" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default TemplateCarousel;
