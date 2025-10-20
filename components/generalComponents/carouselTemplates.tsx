import Image from "next/image";
import React, { useEffect, useState } from "react";

const TemplateCarousel = ({ images = [], onSelect }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // detect small screens (Tailwind's "sm" is 640px)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 639px)");
    setIsMobile(mq.matches);
    const handler = (e) => setIsMobile(e.matches);
    if (mq.addEventListener) {
      mq.addEventListener("change", handler);
    } else {
      // Safari fallback
      mq.addListener(handler);
    }
    return () => {
      if (mq.removeEventListener) {
        mq.removeEventListener("change", handler);
      } else {
        mq.removeListener(handler);
      }
    };
  }, []);

  const handlePrev = () => {
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
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

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="flex h-full flex-col items-center space-y-4 w-full">
      {/* Carousel */}
      <div className="flex justify-center items-center space-x-4 w-full">
        {/* Prev button (hidden on mobile) */}
        <button
          onClick={handlePrev}
          className="hidden sm:block p-2 rounded-full bg-gray-200 hover:bg-gray-300"
          aria-label="Previous template"
        >
          ◀
        </button>

        {/* Images */}
        <div className="flex items-center h-full justify-center w-full sm:w-auto space-x-4 overflow-hidden">
          {images.map((img, index) => {
            // Determine which items to show:
            const isPrev =
              index === (currentIndex - 1 + images.length) % images.length;
            const isCurrent = index === currentIndex;
            const isNext = index === (currentIndex + 1) % images.length;

            // On mobile only render the current image
            if (isMobile && !isCurrent) return null;

            // On desktop render prev, current, next only
            if (!isMobile && !isPrev && !isCurrent && !isNext) return null;

            // sizes: keep desktop sizes as before, use a slightly smaller current image on mobile
            const imgWidth = isCurrent ? (isMobile ? 220 : 256) : 160;
            const imgHeight = isCurrent ? (isMobile ? 280 : 320) : 200;

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

        {/* Next button (hidden on mobile) */}
        <button
          onClick={handleNext}
          className="hidden sm:block p-2 rounded-full bg-gray-200 hover:bg-gray-300"
          aria-label="Next template"
        >
          ▶
        </button>
      </div>

      {/* Mobile buttons (only show on mobile) */}
      <div className="flex sm:hidden space-x-6">
        <button
          onClick={handlePrev}
          className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
          aria-label="Previous template"
        >
          ◀
        </button>
        <button
          onClick={handleNext}
          className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
          aria-label="Next template"
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
