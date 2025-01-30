import React, { useEffect } from "react";
import "./AlertAdv.scss";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { REMOVE_ALERT_GLOBAL } from "../../redux/AlertGlobalSlice";
import { useDispatch, useSelector } from "react-redux";

const AlertAdv = ({ closeFunction }) => {
  const alertGlobal = useSelector((state) => state.AlertGlobal.data);

  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      handleCloseClick();
    }, 4500);

    return () => clearTimeout(timer);
  }, []);

  function handleCloseClick() {
    dispatch(REMOVE_ALERT_GLOBAL());
  }

  return (
    <div className="alertforall123">
      <div className="insideAlert4673 flex1">
        <div className="content">
          <p className="h6 w500 mb-1"> {alertGlobal.status} </p>
          <p className="h7 w500 p2"> {alertGlobal.message} </p>
        </div>

        <div className="line">
          <div className="line2"></div>
        </div>

        <div className="close flex1">
          <FontAwesomeIcon icon={faXmark} onClick={() => handleCloseClick()} />
        </div>
      </div>
    </div>
  );
};

export default AlertAdv;
