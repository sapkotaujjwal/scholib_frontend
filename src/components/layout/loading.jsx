import React from "react";
import { useSelector } from "react-redux";

const Loading = () => {
  const scholib = useSelector((state) => state.Scholib.scholib.payload);

  return (
    <div className="flex justify-center items-center h-[100%] bg-gray-100 fixed top-0 left-0 w-[100vw] z-[99999] p-2">
      <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg flex flex-col items-center">
        {scholib && (
          <div className="mb-4">
            <img
              src={scholib.logo.secure_url}
              alt="Scholib Logo"
              className="w-24 h-24 object-contain"
            />
          </div>
        )}
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-700">Loading...</p>
          <div className="loader mt-4 w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
        <p className="text-gray-500 text-sm mt-6 text-center">Your request is being processed...
          <br /> Please wait a moment.</p>
      </div>
    </div>
  );
};

export default Loading;
