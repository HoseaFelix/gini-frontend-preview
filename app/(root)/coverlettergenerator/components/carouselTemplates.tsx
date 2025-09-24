import Image from "next/image";
import React, { useState } from "react";

const TemplateCarousel = ({ images = [], onSelect }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    const prevIndex = (currentIndex - 1 + images.length) % images.length
    setCurrentIndex(prevIndex);
    if (onSelect) onSelect(prevIndex);
  };

  const handleNext = () => {
     const nextIndex = (currentIndex + 1) % images.length;
    setCurrentIndex(nextIndex);
    if (onSelect) onSelect(nextIndex);

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
            const isPrev =
              index === (currentIndex - 1 + images.length) % images.length;
            const isCurrent = index === currentIndex;
            const isNext = index === (currentIndex + 1) % images.length;

            if (!isPrev && !isCurrent && !isNext) return null;

            // choose sizes for current vs side images
            const imgWidth = isCurrent ? 256 : 160; // px
            const imgHeight = isCurrent ? 320 : 200; // px

            return (
              <div
                key={index}
                className="relative flex-shrink-0"
                style={{ width: imgWidth, height: imgHeight }}
              >
                <Image
                  src={img}
                  alt={`template-${index}`}
                  width={imgWidth}
                  height={imgHeight}
                  onClick={() => handleSelect(index)}
                  className={`cursor-pointer object-contain rounded-xl transition-all duration-300 ${
                    isCurrent
                      ? "shadow-xl border-4 border-blue-500 z-10"
                      : "opacity-70 hover:opacity-100"
                  }`}
                />
              </div>
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
