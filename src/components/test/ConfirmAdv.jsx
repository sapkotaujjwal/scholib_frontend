import React from "react";
import "./confirmAdv.scss";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useDispatch, useSelector } from "react-redux";
import {
  ACCEPT_CONFIRM_GLOBAL,
  DECLINE_CONFIRM_GLOBAL,
} from "../../redux/ConfirmGlobalSlice";

const ConfirmAdv = () => {
  const confirmGlobal = useSelector((state) => state.ConfirmGlobal.data);
  const dispatch = useDispatch();

  return (
    <div className="confirmforall123 flex1">
      <div className="insideConfirm4673">

        <p className="h5 w600 text-center"> Confirm </p>
        <p className="text-center w400 text-secondary px-2" style={{fontSize:'13px'}}> {confirmGlobal.message || 'Do you really want to proceed ?'} </p>

        <p className="h1 text-center text-danger" style={{fontSize: '100px'}}> <FontAwesomeIcon icon={faCircleExclamation} /> </p>

        <p className="h7 text-center w300 text-danger" style={{margin: '0px'}}> Make sure this action is irreversible </p>


        <div className="buttons flex2">
          <button
            className="btn btn-secondary mx-1"
            onClick={() => dispatch(DECLINE_CONFIRM_GLOBAL())}
          >
            {" "}
            Cancel{" "}
          </button>
          <button
            className="btn btn-danger mx-1"
            onClick={() => dispatch(ACCEPT_CONFIRM_GLOBAL())}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmAdv;
