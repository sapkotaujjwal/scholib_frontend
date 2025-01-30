import React, { useEffect, useState } from "react";
import "./profile.scss";
import MetaData from "../layout/MetaData";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGraduationCap,
  faLocation,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import userImg from "../../images/user.png";

const Profile = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  }

  const user = useSelector((state) => state.User.user.payload);
  const school = useSelector((state) => state.Home.school.payload);
  const course = useSelector((state) => state.Course.course.payload.course);

  const studentData = useSelector(
    (state) => state.StudentData.studentData.payload
  );

  return (
    <div className="profile2638">
      <MetaData
        title={`${user && user.role ? "Staff" : "Student"} || Profile`}
      />

      <div className="profile-very-top">
        <div className="ourContent">
          <div className="cover">
            <img
              src="https://cdn.pixabay.com/photo/2016/11/01/18/38/background-1789175_1280.png"
              alt=""
            />
          </div>

          <div className="content">
            <section className="myInfo">
              <div className="upper d-flex">
                <div className="image">
                  <img
                    src={user.photo1 ? user.photo1.secure_url : userImg}
                    alt=""
                  />
                </div>
                <div className="info ms-2">
                  <p className="h6 text-secondary w600"> {user.name} </p>
                  <p className="h7"> Student </p>
                </div>
              </div>

              <hr style={{ marginTop: "30px" }} />

              <div className="below flex4">
                <div className="left each">
                  <p>
                    {" "}
                    <FontAwesomeIcon
                      icon={faGraduationCap}
                      style={{ marginRight: "6px" }}
                    />
                    {
                      course.find((obj) => obj._id === studentData.course.class)
                        .class
                    }{" "}
                    ||{" "}
                    {
                      course
                        .find((obj) => obj._id === studentData.course.class)
                        .groups.find(
                          (obj2) => obj2._id === studentData.course.group
                        ).name
                    }
                  </p>
                  <p>
                    {" "}
                    <FontAwesomeIcon
                      icon={faLocation}
                      style={{ marginRight: "6px" }}
                    />
                    {user.address}
                  </p>
                </div>
                <div className="right each">
                  <p>
                    {" "}
                    <FontAwesomeIcon
                      icon={faPhone}
                      style={{ marginRight: "6px" }}
                    />
                    {user.phone}
                  </p>
                  <p>
                    {" "}
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      style={{ marginRight: "6px" }}
                    />
                    {user.email}
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

            <p className="lastP">
              Name : {user.name} || From : {user.address} || Email : {user.email}{" "}
              || Contact : {user.phone} || Login Id : {user.loginId}
            </p>
          </section>
        </div>
        <div className="each select flex1">
          <div className="alone">
            <p className="h6"> School Code : </p>
            <p className="h6 wbg"> {user.schoolCode} </p>
          </div>

          <div className="alone">
            <p className="h6"> Login Id : </p>
            <p className="h6 wbg"> {user.loginId} </p>
          </div>
        </div>
      </div>

      <div className="inputForms2829">
        <div className="form-content6">
          <div className="each width2">
            <p> Full Name </p>
            <p className="likeInput"> {user.name} </p>
          </div>

          <div className="each width2">
            <p> Class </p>
            <p className="likeInput">
              {course.find((obj) => obj._id === studentData.course.class).class}
            </p>
          </div>

          <div className="each width2">
            <p> Group </p>
            <p className="likeInput">
              {
                course
                  .find((obj) => obj._id === studentData.course.class)
                  .groups.find((obj2) => obj2._id === studentData.course.group)
                  .name
              }
            </p>
          </div>

          <div className="each width2">
            <p> Section </p>
            <p className="likeInput">
              {
                course
                  .find((obj) => obj._id === studentData.course.class)
                  .groups.find((obj2) => obj2._id === studentData.course.group)
                  .sections.find(
                    (sec) => sec._id === studentData.course.section
                  ).name
              }
            </p>
          </div>

          <div className="each width2">
            <p>Gender</p>
            <p className="likeInput"> {user.gender} </p>
          </div>

          <div className="each width2">
            <p> DOB (y/m/d) BS </p>
            <p className="likeInput"> {formatDate(user.dob)} </p>
          </div>

          <div className="each width2">
            <p> Email </p>
            <p className="likeInput"> {user.email} </p>
          </div>

          <div className="each width2">
            <p> Phone </p>
            <p className="likeInput"> {user.phone} </p>
          </div>

          {user.bus && (
            <div className="each width2">
              <p> Bus Pickup Point </p>
              <p className="likeInput">
                {" "}
                {
                  school.busFee.find((obj) => obj._id === user.bus._id).location
                }{" "}
              </p>
            </div>
          )}

          <div className="each width4">
            <p> Address </p>
            <p className="likeInput">{user.address} </p>
          </div>

          {user.psName && (
            <div className="each width2">
              <p> Previous School Name </p>
              <p className="likeInput"> {user.psName} </p>
            </div>
          )}

          {user.psAddress && (
            <div className="each width2">
              <p> Previous School Address </p>
              <p className="likeInput"> {user.psAddress} </p>
            </div>
          )}

          <hr className="width4" />

          <div className="each width2">
            <p> Father's Name </p>
            <p className="likeInput">{user.fName} </p>
          </div>

          <div className="each width2">
            <p> Father's Profession </p>
            <p className="likeInput">{user.fProfession} </p>
          </div>

          <div className="each width2">
            <p> Mother's Name </p>
            <p className="likeInput">{user.mName} </p>
          </div>

          <div className="each width2">
            <p> Mother's Profession </p>
            <p className="likeInput">{user.mProfession} </p>
          </div>

          <div className="each width2">
            <p> Parent's Contact No. </p>
            <p className="likeInput">{user.phone2} </p>
          </div>

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
              {!user.photo1 && (
                <img
                  src="https://cdn.pixabay.com/photo/2021/07/21/12/49/error-6482984_640.png"
                  alt=""
                />
              )}

              {user.photo1 && <img src={user.photo1.secure_url} alt="" />}
            </div>
          </div>

          <div className="each width1">
            <div
              className="selectImage"
              style={{ minHeight: "0", paddingBottom: "25px" }}
            >
              <p className="h6 w500 mb-2"> National ID </p>
              {!user.photo2 && (
                <img
                  src="https://cdn.pixabay.com/photo/2021/07/21/12/49/error-6482984_640.png"
                  alt=""
                />
              )}

              {user.photo2 && <img src={user.photo2.secure_url} alt="" />}
            </div>
          </div>

          <div className="each width1">
            <div
              className="selectImage"
              style={{ minHeight: "0", paddingBottom: "25px" }}
            >
              <p className="h6 w500 mb-2"> Previous Class Certificate </p>
              {!user.photo3 && (
                <img
                  src="https://cdn.pixabay.com/photo/2021/07/21/12/49/error-6482984_640.png"
                  alt=""
                />
              )}

              {user.photo3 && <img src={user.photo3.secure_url} alt="" />}
            </div>
          </div>

          <div className="each width1">
            <div
              className="selectImage"
              style={{ minHeight: "0", paddingBottom: "25px" }}
            >
              <p className="h6 w500 mb-2"> Character Certificate </p>
              {!user.photo4 && (
                <img
                  src="https://cdn.pixabay.com/photo/2021/07/21/12/49/error-6482984_640.png"
                  alt=""
                />
              )}

              {user.photo4 && <img src={user.photo4.secure_url} alt="" />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
