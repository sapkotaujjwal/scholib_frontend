import React from "react";
import "./success.scss";

import img from "../../images/success.svg";

const Success = ({ closeSuccess, data }) => {
  function closeThisSuccess() {
    closeSuccess();
  }


  return (
    <div className="qetusbkdaa234 flex1">
      <div className="main">
        <div className="container">
          <h6 className="h5 text-success text-center mb-3 w600">
            {data.status || "Successful !!"}
          </h6>

          <div className="img">

            <img src={img} alt="" />
          </div>

          <p className="text-center mt-3 text-secondary h6 f2">
            {data.message}
          </p>

          <p className="h7 mt-4"> Proceed to your activity.. </p>
          <button
            type="button"
            class="bg-gray-300 px-5 py-2 rounded-md text-md hover:bg-gray-400"
            onClick={closeThisSuccess}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Success;
