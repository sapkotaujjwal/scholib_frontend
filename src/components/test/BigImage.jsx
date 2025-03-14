import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";

const BigImage = ({ closeFunction }) => {
  const array = useSelector((state) => state.BigImage.data);
  const index = useSelector((state) => state.BigImage.index);
  const [image, setImage] = useState(index);

  const nextImage = () => {
    setImage((prevImage) => (prevImage + 1) % array.length);
  };

  const previousImage = () => {
    setImage((prevImage) => (prevImage - 1 + array.length) % array.length);
  };

  // Swipe feature
  let startX;
  let deltaX;

  const handleTouchStart = (event) => {
    startX = event.touches[0].clientX;
  };

  const handleTouchMove = (event) => {
    deltaX = event.touches[0].clientX - startX;
  };

  const handleTouchEnd = () => {
    if (Math.abs(deltaX) > 100) {
      deltaX > 0 ? previousImage() : nextImage();
    }
    startX = null;
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100/90 backdrop-blur-lg z-[9999] sm:p-1 md:p-4">
      {/* Close Button */}
      <button
        className="absolute top-4 right-4 p-3 border rounded-md bg-white text-gray-700 hover:text-red-500 hover:border-red-500 transition z-50"
        onClick={closeFunction}
      >
        <FontAwesomeIcon icon={faXmark} size="md" />
      </button>

      {/* Image Container */}
      <div
        className="relative flex items-center justify-center w-full h-full"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
        className="w-full h-full object-contain"
          src={array[image]}
          alt="Displayed"
          // className="w-auto max-h-screen max-w-screen"
        />
        
        {/* Navigation Buttons */}
        <button
          className="absolute left-0 top-1/2 transform -translate-y-1/2 p-3 rounded-full shadow-md hover:shadow-lg transition z-50"
          onClick={previousImage}
        >
          <FontAwesomeIcon icon={faCaretLeft} size="lg" />
        </button>
        <button
          className="absolute right-0 top-1/2 transform -translate-y-1/2 p-3 rounded-full shadow-md hover:shadow-lg transition z-50"
          onClick={nextImage}
        >
          <FontAwesomeIcon icon={faCaretLeft} size="lg" className="rotate-180" />
        </button>
      </div>
    </div>
  );
};

export default BigImage;
