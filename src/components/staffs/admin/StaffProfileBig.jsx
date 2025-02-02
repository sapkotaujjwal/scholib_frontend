import React, { useEffect, useState } from "react";
import "./staffProfileBig.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faGraduationCap,
  faLocation,
  faPen,
  faPhone,
  faSignOut,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { SET_ALERT_GLOBAL } from "../../../redux/AlertGlobalSlice";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  REMOVE_CONFIRM_GLOBAL,
  SET_CONFIRM_GLOBAL,
} from "../../../redux/ConfirmGlobalSlice";
import CreateNewStaff from "../../test/CreateNewStaff";

const StaffProfileBig = ({ id, closeFunction, removed = false }) => {
  const school = useSelector((state) => state.Home.school.payload);
  const user = useSelector((state) => state.User.user.payload);
  const schoolCode = school.schoolCode;

  const dispatch = useDispatch();

  const [admin, setAdmin] = useState(null);

  const [edit, setEdit] = useState(false);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/staff/${schoolCode}/staff/${id}`, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.success) {
          setAdmin(response.data.data);
        } else {
          dispatch(SET_ALERT_GLOBAL(response.data));
          closeFunction();
        }
      })
      .catch((error) => {
        const data = {
          message: error.message,
          status: "Cannot communicate with the server",
        };

        if (error.response) {
          dispatch(SET_ALERT_GLOBAL(error.response.data));
          closeFunction();
          return;
        }
        dispatch(SET_ALERT_GLOBAL(data));
        closeFunction();
      });
  }, [id]);

  const confirmGlobalStatusState = useSelector(
    (state) => state.ConfirmGlobal.status
  );

  useEffect(() => {
    if (confirmGlobalStatusState === "accepted") {
      removeStaff(admin._id);
      dispatch(REMOVE_CONFIRM_GLOBAL());
    } else if (confirmGlobalStatusState === "declined") {
      dispatch(REMOVE_CONFIRM_GLOBAL());
    }
  }, [confirmGlobalStatusState]);

  async function removeStaff(data) {

    if(!removed){
      axios
      .delete(
        `${process.env.REACT_APP_API_URL}/admin/${schoolCode}/staff/${data}`,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        if (response.data.success) {
          dispatch(SET_ALERT_GLOBAL(response.data));
          closeFunction();
        } else {
          dispatch(SET_ALERT_GLOBAL(response.data));
        }
      })
      .catch((error) => {
        const data = {
          message: error.message,
          status: "Cannot communicate with the server",
        };

        if (error.response) {
          dispatch(SET_ALERT_GLOBAL(error.response.data));
          closeFunction();
          return;
        }
        dispatch(SET_ALERT_GLOBAL(data));
        closeFunction();
      });
    }

    if(removed){
      axios
      .get(
        `${process.env.REACT_APP_API_URL}/admin/${schoolCode}/staff/${data}/addAgain`,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        if (response.data.success) {
          dispatch(SET_ALERT_GLOBAL(response.data));
          closeFunction();
        } else {
          dispatch(SET_ALERT_GLOBAL(response.data));
        }
      })
      .catch((error) => {
        const data = {
          message: error.message,
          status: "Cannot communicate with the server",
        };

        if (error.response) {
          dispatch(SET_ALERT_GLOBAL(error.response.data));
          closeFunction();
          return;
        }
        dispatch(SET_ALERT_GLOBAL(data));
        closeFunction();
      });
    }
  }

  return (
    <div className="meTop268113">
      {admin && (
        <div className="profile8633 custom-scrollbar">
          {edit && (
            <CreateNewStaff
              data={admin}
              _id={id}
              roleChange={user.role === "Administrator" ? true : false}
              closeFunction={() => closeFunction()}
              title={`Edit Staff's Profile`}
              email={false}
            />
          )}

          <div className="profile-very-top">
            <div className="ourContent">
              <div className="buttons d-flex">
                {!removed && (
                  <button
                    className="btn text-white"
                    onClick={() => setEdit(!edit)}
                  >
                    <FontAwesomeIcon
                      style={{ marginRight: "5px" }}
                      icon={faPen}
                    />
                    Edit staff
                  </button>
                )}

                <button
                  className="btn text-danger bg-white"
                  onClick={closeFunction}
                >
                  <FontAwesomeIcon
                    style={{ marginRight: "5px" }}
                    icon={faXmark}
                  />
                  Close
                </button>
              </div>

              <div className="content">
                <section className="myInfo">
                  {user && user.role === "Administrator" && (
                    <div className="remove-wrapper-div">
                      <button
                        className="btn text-danger very-right"
                        onClick={() =>
                          dispatch(
                            SET_CONFIRM_GLOBAL({
                              message: `${
                                removed
                                  ? "Are you sure you want to add this staff ?"
                                  : "Are you sure you want to remove this staff ?"
                              }`,
                            })
                          )
                        }
                      >
                        <FontAwesomeIcon
                          style={{ marginRight: "5px" }}
                          icon={removed ? faCircleCheck : faSignOut}
                        />

                        {`${removed ? "Add Staff" : "Remove Staff"}`}
                      </button>
                    </div>
                  )}

                  <div className="upper d-flex">
                    <div className="image">
                      <img
                        src={`${
                          admin.pPhoto
                            ? admin.pPhoto.secure_url
                            : "https://cdn.pixabay.com/photo/2021/07/21/12/49/error-6482984_640.png"
                        }`}
                        alt=""
                      />
                    </div>
                    <div className="info ms-2">
                      <p className="h6 text-secondary w600"> {admin.name} </p>
                      <p className="h7 w500">
                        {" "}
                        {admin.title} ( {admin.role} ){" "}
                      </p>
                    </div>
                  </div>

                  <hr style={{ marginTop: "30px" }} />

                  <div className="below flex4">
                    <div className="left each">
                      <p>
                        <FontAwesomeIcon
                          icon={faGraduationCap}
                          style={{ marginRight: "6px" }}
                        />
                        {admin.qualification}
                      </p>
                      <p>
                        <FontAwesomeIcon
                          icon={faLocation}
                          style={{ marginRight: "6px" }}
                        />
                        {admin.address}
                      </p>
                    </div>
                    <div className="right each">
                      <p>
                        <FontAwesomeIcon
                          icon={faPhone}
                          style={{ marginRight: "6px" }}
                        />
                        {admin.phone}
                      </p>
                      <p style={{ marginBottom: "0px" }}>
                        <FontAwesomeIcon
                          icon={faEnvelope}
                          style={{ marginRight: "6px" }}
                        />
                        {admin.email}
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>

          <div className="about-parent d-flex">
            <div className="each">
              <section className="about-box">
                <p className="h5 w600"> About </p>

                <p className="lastP">{admin.about}</p>
              </section>
            </div>
          </div>

          <div className="inputForms2829">
            <div className="form-content6">
              <div className="each width2">
                <p> Full Name </p>
                <p className="likeInput"> {admin.name} </p>
              </div>

              <div className="each width2">
                <p>Gender</p>
                <p className="likeInput"> {admin.gender} </p>
              </div>

              <div className="each width2">
                <p> DOB (y/m/d) BS </p>
                <p className="likeInput"> {admin.dob.substring(0, 10)} </p>
              </div>

              <div className="each width2">
                <p> Email </p>
                <p className="likeInput"> {admin.email} </p>
              </div>

              <div className="each width2">
                <p> Phone </p>
                <p className="likeInput"> {admin.phone} </p>
              </div>

              <div className="each width2">
                <p> Qualification </p>
                <p className="likeInput"> {admin.qualification} </p>
              </div>

              <div className="each width4">
                <p> Address </p>
                <p className="likeInput">{admin.address} </p>
              </div>

              {admin.psName && (
                <div className="each width2">
                  <p> Previous School Name </p>
                  <p className="likeInput"> {admin.psName} </p>
                </div>
              )}

              {admin.psAddress && (
                <div className="each width2">
                  <p> Previous School Address </p>
                  <p className="likeInput"> {admin.psAddress} </p>
                </div>
              )}

              {/* final images are actually here */}

              <div className="each width4">
                <hr style={{ color: "grey" }} />
              </div>

              <div className="each width1">
                <div
                  className="selectImage"
                  style={{ minHeight: "0", paddingBottom: "25px" }}
                >
                  <p className="h6 w500 mb-2"> Profile Picture </p>
                  {!admin.pPhoto && (
                    <img
                      src="https://cdn.pixabay.com/photo/2021/07/21/12/49/error-6482984_640.png"
                      alt=""
                    />
                  )}

                  {admin.pPhoto && <img src={admin.pPhoto.secure_url} alt="" />}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffProfileBig;
