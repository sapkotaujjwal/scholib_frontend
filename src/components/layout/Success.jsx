import React from "react";
import "./success.scss";

import img from "../../images/success.svg";
import AnimatedBlurhashImage from "./blurHash";

const Success = ({ closeSuccess, data }) => {
  function closeThisSuccess() {
    closeSuccess();
  }

  const blurhashString = "LDI=x?-p009YyXRjbxxu4TM{yZ%3";

  return (
    <div className="qetusbkdaa234 flex1">
      <div className="main">
        <div className="container">
          <h6 className="h5 text-success text-center mb-3 w600">
            {data.status || "Successful !!"}
          </h6>

          <div className="img">
            {/* <AnimatedBlurhashImage imageUrl={img} blurhash={'LDI=x?-p009YyXRjbxxu4TM{yZxv'} width ={300} height={300} /> */}

            <img src={img} alt="" />
          </div>

          <p className="text-center mt-3 text-secondary h6 f2">
            {data.message}
          </p>

          <p className="h7 mt-4"> Proceed to your activity.. </p>
          <button
            type="button"
            class="btn btn-outline-secondary"
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
