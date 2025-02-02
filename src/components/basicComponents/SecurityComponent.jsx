import React, { useEffect, useRef } from "react";
import "./securityComponent.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHashtag, faLock } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { SET_ALERT_GLOBAL } from "../../redux/AlertGlobalSlice";
import userImg from ".././../images/user.png";
import { LOGOUT_USER_SUCCESS } from "../../redux/UserSlice";

const SecurityComponent = () => {
  const user = useSelector((state) => state.User.user.payload);
  const school = useSelector((state) => state.Home.school.payload);

  const newPasswordref = useRef(null);
  const newPasswordref2 = useRef(null);
  const oldPasswordref = useRef(null);

  const dispatch = useDispatch();
  const schoolCode = school.schoolCode;

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  function extractDeviceInfo(userAgentString) {
    const regex = /\((.*?)\)/; // Match content within parentheses
    const matches = userAgentString.match(regex);
    if (matches && matches.length >= 2) {
      return matches[1]; // Extracted device info
    } else {
      return "Device info not found";
    }
  }

  function logOutDevice(a) {


    axios
      .delete(
        `${process.env.REACT_APP_API_URL}/mutual/logout/${schoolCode}/${a}`,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        if (response.data.success) {
          dispatch(LOGOUT_USER_SUCCESS(a));
          dispatch(SET_ALERT_GLOBAL(response.data));
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
          return;
        }
        dispatch(SET_ALERT_GLOBAL(data));
      });

    // /logout/:schoolCode/:_id
  }

  function changePassword() {
    let p1 = oldPasswordref.current.value;
    let p2 = newPasswordref.current.value;
    let p3 = newPasswordref2.current.value;

    function setAllBlank() {
      oldPasswordref.current.value = "";
      newPasswordref.current.value = "";
      newPasswordref2.current.value = "";
    }

    if (p1.length < 8) {
      return alert("Old password is of atleast 8 characters");
    }

    if (p2.length < 8) {
      return alert("New password should be of atleast 8 characters");
    }

    if (p2 !== p3) {
      return alert("New password and confirm new password does not match");
    }

    axios
      .post(
        `${process.env.REACT_APP_API_URL}/mutual/security/${schoolCode}/change/password`,
        {
          oldPassword: p1,
          newPassword: p2,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        if (response.data.success) {
          dispatch(SET_ALERT_GLOBAL(response.data));
          setAllBlank();
        } else {
          dispatch(SET_ALERT_GLOBAL(response.data));
          setAllBlank();
        }
      })
      .catch((error) => {
        const data = {
          message: error.message,
          status: "Cannot communicate with the server",
        };

        if (error.response) {
          dispatch(SET_ALERT_GLOBAL(error.response.data));
          setAllBlank();
          return;
        }
        dispatch(SET_ALERT_GLOBAL(data));
        setAllBlank();
      });

    // /logout/:schoolCode/:_id
  }

  return (
    <>
      {user && (
        <div className="securityComponent2737 flex2">
          <div className="security-component-main">
            <div className="user">
              <div className="background"></div>
              <div className="image">
                {user.title && (
                  <img
                    src={user.pPhoto ? user.pPhoto.secure_url : userImg}
                    alt=""
                  />
                )}

                {!user.title && (
                  <img
                    src={user.photo1 ? user.photo1.secure_url : userImg}
                    alt=""
                  />
                )}
              </div>
              <p
                className="h5 w600 text-center f3"
                style={{ marginBottom: "4px", color: "grey" }}
              >
                {user.name}
              </p>
              <p className="h7 w400 text-center">
                {" "}
                {user.title ? "Staff" : "Student"}{" "}
              </p>

              <div className="likeButtons flex3">
                <div className="likeButton">
                  <div className="each">
                    <p className="h6"> School Code </p>
                    <div className="box"> {user.schoolCode} </div>
                  </div>
                </div>

                <div className="likeButton">
                  <div className="each">
                    <p className="h6"> Login ID </p>
                    <div className="box"> {user.loginId} </div>
                  </div>
                </div>
              </div>
            </div>

            <section className="security">
              <div className="securityMain flex2">
                <div className="right each m-auto">
                  <div className="left each flex1 pt-3">
                    <p className="h5 w500 udgssh">
                      <FontAwesomeIcon
                        icon={faLock}
                        style={{ marginRight: "13px" }}
                      />
                      Change Password :
                    </p>
                  </div>

                  <div className="likeButtons">
                    <div className="likeButton my-4">
                      <p className="h6"> Current Password </p>
                      <div className="box">
                        <input
                          type="password"
                          name=""
                          placeholder=""
                          ref={oldPasswordref}
                        />
                      </div>
                    </div>

                    <div className="likeButton my-4">
                      <p className="h6"> New Password </p>
                      <div className="box">
                        <input
                          type="password"
                          name=""
                          placeholder=""
                          ref={newPasswordref}
                        />
                      </div>
                    </div>

                    <div className="likeButton my-4">
                      <p className="h6"> Confirm New Password </p>
                      <div className="box">
                        <input
                          type="password"
                          name=""
                          placeholder=""
                          ref={newPasswordref2}
                        />
                      </div>

                      <div
                        className="pt-3 flex4"
                        style={{ minHeight: "50px", width: "100%" }}
                      >
                        <button
                          className="btn btn-secondary"
                          style={{
                            float: "right",
                            fontSize: "14px",
                            minWidth: "100px",
                            width: "48%",
                          }}
                        >
                          {" "}
                          Cancel{" "}
                        </button>
                        <button
                          onClick={() => changePassword()}
                          className="btn btn-primary"
                          style={{
                            float: "right",
                            fontSize: "14px",
                            minWidth: "100px",
                            width: "48%",
                          }}
                        >
                          {" "}
                          Update{" "}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="sessions flex2">
              <div className="each right m-auto">
                <div className="left each flex1 mt-3 mb-3">
                  <p className="h5 w500">
                    <FontAwesomeIcon
                      icon={faHashtag}
                      style={{ marginRight: "13px" }}
                    />
                  </p>

                  <p className="h5 w500">Login Sessions :</p>
                </div>

                <div className="boxes">
                  {user &&
                    user.tokens.length >= 1 &&
                    user.tokens.map((token) => {
                      return (
                        <div
                        key={token._id}
                          className="box flex1"
                          style={{ justifyContent: "flex-start" }}
                        >
                          <p className="h5 w600 device-name">
                            {extractDeviceInfo(token.device)}
                          </p>
                          {/* <p className="h6 w400 mb-1"> 11/09/2080 at 4 : 20 pm </p>
                  <p className="h7 w400"> California, USA </p> */}

                          <button
                            className="btn-secondary btn"
                            onClick={() => logOutDevice(token._id)}
                          >
                            {" "}
                            Log Out{" "}
                          </button>
                        </div>
                      );
                    })}
                </div>
              </div>
            </section>
          </div>
        </div>
      )}
    </>
  );
};

export default SecurityComponent;
