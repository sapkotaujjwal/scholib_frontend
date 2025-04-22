import React, { useEffect, useRef, useState } from "react";
import "./userComponent.scss";
import {
  faArrowRightFromBracket,
  faScrewdriverWrench,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

import {
  GET_USER,
  GET_USER_FAIL,
  ERROR_REMOVE,
  LOGOUT_ME_SUCCESS,
} from "../../redux/UserSlice";
import {
  useHistory,
  useRouteMatch,
} from "react-router-dom/cjs/react-router-dom.min";

import userImg from "../../images/user.png";
import {
  GET_STUDENTDATA,
  GET_STUDENTDATA_FAIL,
  GET_STUDENTDATA_SUCCESS,
} from "../../redux/StudentDataSlice";

const UserComponent = ({ closeUserComponent }) => {
  const course = useSelector((state) => state.Course.courseAll.payload.course);
  const dispatch = useDispatch();

  const school = useSelector((state) => state.Home.school.payload);

  const schoolCode = school.schoolCode;

  const loading = useSelector((state) => state.User.loading);
  const user = useSelector((state) => state.User.user.payload);
  const error = useSelector((state) => state.User.error.payload);

  function logOutUser() {
    dispatch(GET_USER());
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/mutual/logout/${school.schoolCode}`,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        if (response.data.success) {
          dispatch(LOGOUT_ME_SUCCESS());
          closeUserComponent();
          history.push(`/school/${schoolCode}/updates`);
        } else {
          dispatch(GET_USER_FAIL(response.data.data));
        }
      })
      .catch((error) => {
        const data = {
          message: error.message,
          status: "Cannot communicate with the server",
        };
        dispatch(GET_USER_FAIL(data));
      });
  }

  function removeError() {
    dispatch(ERROR_REMOVE());
  }

  const history = useHistory();

  function openDashboard() {
    let key = "student";
    if (user.role) {
      key = "staff";
    }

    if (studentRouteMatch || staffRouteMatch) {
      history.push(`/school/${school.schoolCode}/${key}/`);
      closeUserComponent();
      return;
    }

    history.push(`/school/${school.schoolCode}/${key}/`);
    closeUserComponent();
  }

  // to check if the route matches (student or staff) or not

  const studentRouteMatch = useRouteMatch(
    `/school/${schoolCode}/student/:path*`
  );

  const staffRouteMatch = useRouteMatch(`/school/${schoolCode}/staff/:path*`);

  const studentData = useSelector(
    (state) => state.StudentData.studentData.payload
  );

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!studentData && !user.role) {
      dispatch(GET_STUDENTDATA());
      axios
        .get(`${process.env.REACT_APP_API_URL}/student/${schoolCode}/info`, {
          withCredentials: true,
        })
        .then((response) => {
          setLoaded(true);
          if (response.data.success) {
            dispatch(GET_STUDENTDATA_SUCCESS(response.data.data));
          } else {
            dispatch(GET_STUDENTDATA_FAIL(response.data.data));
          }
        })
        .catch((error) => {
          setLoaded(true);
          const data = {
            message: error.message,
            status: "Cannot communicate with the server",
          };

          if (error.response) {
            dispatch(GET_STUDENTDATA_FAIL(error.response.data));
            return;
          }
          dispatch(GET_STUDENTDATA_FAIL(data));
        });
    } else {
      setLoaded(true);
    }
  }, []);

  const componentRef = useRef(null);

  const handleClickOutside = (event) => {
    const headerParent = document.getElementById("headerParent");
    const isChildOfHeaderParent =
      headerParent && headerParent.contains(event.target);

    if (isChildOfHeaderParent) {
      return;
    } 

    if (componentRef.current && !componentRef.current.contains(event.target)) {
      closeUserComponent();
    }
  };

  useEffect(() => {
    // Add event listener when the component is mounted
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up event listener when the component is unmounted
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="tomato32552 applyBootstrap" ref={componentRef}>
      {loading && (
        <div
          className="spinner-container flex1"
          style={{ width: "100%", height: "80vh" }}
        >
          <div
            className="spinner-border text-primary my-4 loading452"
            role="status"
          >
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="errorContainer flex1" style={{ background: "#fff" }}>
          <p className="h6 text-danger text-center w500">
            {" "}
            {(error && error.status) || "Network Failed"}
          </p>
          <p className="h6 text-secondary text-center w500 pt-2">
            {" "}
            {(error && error.message) || "We are unable to verify your token"}
          </p>

          <div className="butssf text-center mt-2">
            <button
              className="btn btn-secondary"
              style={{ width: "180px" }}
              onClick={removeError}
            >
              {" "}
              Remove Error{" "}
            </button>
          </div>
        </div>
      )}

      {user && loaded && (
        <div className="maindbsn">
          <div className="top">
            <div className="image">
              {/* <img src={user.pPhoto.secure_url} style={{objectFit: 'cover'}} alt="" /> */}

              {user.title && (
                <img
                  src={user.pPhoto ? user.pPhoto.secure_url : userImg}
                  style={{ objectFit: "cover" }}
                  alt=""
                />
              )}

              {!user.title && (
                <img
                  src={user.photo1 ? user.photo1.secure_url : userImg}
                  style={{ objectFit: "cover" }}
                  alt=""
                />
              )}
            </div>

            <div className="user">
              <p
                className="h6 w600 text-center"
                style={{ color: "#01BDD7", marginBottom: "4px" }}
              >
                {" "}
                {user.name}
              </p>

              <p className="h7 w600 mb-1 text-center">
                {" "}
                {user.role ? "Staff" : "Student"}{" "}
              </p>

              <p className="h7 w400 text-center text-secondary">
                {" "}
                {school.name}{" "}
              </p>

              {!user.role && studentData && (
                <div
                  className="parent-buttons flex3"
                  style={{ justifyContent: "space-evenly" }}
                >
                  <div className="likeButton flex1">
                    <p>
                      {course.find(
                        (obj) => obj._id === studentData.course.class
                      ).class.length > 3
                        ? course.find(
                            (obj) => obj._id === studentData.course.class
                          ).class
                        : `Class : ${
                            course.find(
                              (obj) => obj._id === studentData.course.class
                            ).class
                          }`}

                      {course.find(
                        (obj) => obj._id === studentData.course.class
                      ).class.length > 3
                        ? ""
                        : course.find(
                            (obj) => obj._id === studentData.course.class
                          ).class}
                    </p>
                  </div>

                  <div className="likeButton flex1">
                    <p>
                      {" "}
                      Group :{" "}
                      {
                        course
                          .find((obj) => obj._id === studentData.course.class)
                          .groups.find(
                            (obj2) => obj2._id === studentData.course.group
                          ).name
                      }{" "}
                    </p>
                  </div>
                  <div className="likeButton flex1">
                    <p>
                      {" "}
                      Section :{" "}
                      {
                        course
                          .find((obj) => obj._id === studentData.course.class)
                          .groups.find(
                            (obj2) => obj2._id === studentData.course.group
                          )
                          .sections.find(
                            (sec) => sec._id === studentData.course.section
                          ).name
                      }
                    </p>
                  </div>
                </div>
              )}

              {user.role && (
                <p className="h6 text-center text-secondary">
                  {" "}
                  Role :{" "}
                  <span className="text-dark" style={{ fontSize: "15px" }}>
                    {" "}
                    {user.role}{" "}
                  </span>
                </p>
              )}
            </div>

            <hr />
          </div>

          <div className="bottom">
            <div className="each mt-2">
              <p className="w500"> School Code </p>
              <div className="data-div">
                {" "}
                <p style={{ wordBreak: "break-all" }}> {user.schoolCode} </p>
              </div>{" "}
            </div>

            <div className="each mt-2">
              <p className="w500"> User Id </p>
              <div className="data-div">
                {" "}
                <p style={{ wordBreak: "break-all" }}> {user.loginId} </p>
              </div>{" "}
            </div>

            <div className="each mt-2 ">
              <p className="w500"> Email </p>
              <div className="data-div">
                {" "}
                <p style={{ wordBreak: "break-all" }}> {user.email} </p>
              </div>{" "}
            </div>

            <hr style={{ width: "100%" }} />
            <div className="text-center">
              <button className="btn buttonLogOut" onClick={logOutUser}>
                <FontAwesomeIcon
                  className="mx-2"
                  icon={faArrowRightFromBracket}
                />
                Log Out{" "}
              </button>

              <button
                className="btn mt-2 btn-primary"
                onClick={openDashboard}
                style={{ border: "0px" }}
              >
                <FontAwesomeIcon className="mx-2" icon={faScrewdriverWrench} />
                Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserComponent;
