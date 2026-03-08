import React from "react";
import logo from "../../images/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation, faXmark } from "@fortawesome/free-solid-svg-icons";

const Error = ({ status, message, errorRemove }) => {
  return (
    <div className="error flex flex-col items-center justify-center min-h-[100%] bg-gray-100 p-2 w-[100vw] z-[999] fixed top-0 left-0">
      <div className="bg-white shadow-lg rounded-lg p-6 text-center w-full max-w-md">
        <img src='https://res.cloudinary.com/dodvbotgd/image/upload/v1772985830/logo_abstract_h4obh9.png' className="mx-auto mb-4 w-24" alt="Scholib" />
        <p className="text-xl font-semibold text-gray-800 mb-4">
          {status || "Something Went Wrong"}
        </p>
        <FontAwesomeIcon icon={faTriangleExclamation} className="text-red-500 text-5xl mb-4" />
        <p className="text-gray-600 px-4 mb-4 leading-relaxed">
          {message || "Server failed to respond.. Maybe Network error !!"}
        </p>
        <p className="text-lg font-medium text-gray-700 mb-4">An Error Occurred!</p>
        <button
          onClick={errorRemove}
          disabled={!errorRemove}
          className={`w-full py-2 text-white rounded-md flex items-center justify-center mx-auto transition-all ${
            errorRemove ? "bg-gray-500 hover:bg-gray-600" : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {errorRemove ? "Dismiss" : "Cannot be Dismissed"}
        </button>
      </div>
    </div>
  );
};

export default Error;
