import React from "react";
import "./loading.scss";
import { useSelector } from "react-redux";

const Loading = () => {

  const scholib = useSelector((state)=> state.Scholib.scholib.payload);

  return (
    <div className="gdausus22 flex1">
      <div className="container width flex1">
        {scholib && <div className="img">
          <img src={scholib.logo.secure_url} alt="Scholib_logo" />
        </div>}

        <div className="main">
          <p className="h5 f2 w500" style={{ textAlign: "center" }}>
            {" "}
            Loading...
          </p>
          <span className="loader d-block"></span>
        </div>

        <p className="text-center" style={{ margin: "60px 0" }}>
          {" "}
          Your request is being processed.. Please! wait a sec...{" "}
        </p>
      </div>
    </div>
  );
};

export default Loading;



