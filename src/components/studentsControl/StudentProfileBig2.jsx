import React, { useState } from "react";
import "./studentProfileBig2.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGraduationCap,
  faLocation,
  faPen,
  faPhone,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";

import { useSelector } from "react-redux";

import EditStudentProfile from "./EditStudentProfile";

const StudentProfileBig2 = ({ data, closeFunction }) => {
  const school = useSelector((state) => state.Home.school.payload);
  const course = useSelector((state) => state.Course.courseAll.payload.course);

  function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  }

  const [admin, setAdmin] = useState(data);

  const [edit, setEdit] = useState(false);

  if (edit) {
    document.body.classList.add("dshauda-hidden");
  } else if (!edit) {
    document.body.classList.remove("dshauda-hidden");
  }

  return (
    <div className="meTop26823">
      {admin && (
        <div className="profile8633 custom-scrollbar">
          {edit && (
            <EditStudentProfile
              data={admin}
              _id={admin._id}
              closeFunction={() => setEdit(!edit)}
            />
          )}

          <div className="profile-very-top">
            <div className="ourContent">
              <div className="buttons d-flex">
                <button
                  className="btn text-white"
                  onClick={() => setEdit(!edit)}
                >
                  <FontAwesomeIcon
                    style={{ marginRight: "5px" }}
                    icon={faPen}
                  />{" "}
                  Edit student
                </button>
                <button className="btn text-danger" onClick={closeFunction}>
                  {" "}
                  <FontAwesomeIcon
                    style={{ marginRight: "5px" }}
                    icon={faXmark}
                  />{" "}
                  Close
                </button>
              </div>

              <div className="content">
                <section className="myInfo">
                  <div className="upper d-flex">
                    <div className="image">
                      <img
                        src={`${
                          admin.photo1
                            ? admin.photo1.secure_url
                            : "https://cdn.pixabay.com/photo/2021/07/21/12/49/error-6482984_640.png"
                        }`}
                        alt=""
                      />
                    </div>
                    <div className="info ms-2">
                      <p className="h6 text-secondary w600"> {admin.name} </p>
                      <p className="h7 w500"> {admin.email} </p>
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
                        />{" "}
                        {
                          course.find((obj) => obj._id === admin.course.class)
                            .class
                        }{" "}
                        |{" "}
                        {
                          course
                            .find((obj) => obj._id === admin.course.class)
                            .groups.find(
                              (obj2) => obj2._id === admin.course.group
                            ).name
                        }
                      </p>
                      <p>
                        {" "}
                        <FontAwesomeIcon
                          icon={faLocation}
                          style={{ marginRight: "6px" }}
                        />{" "}
                        {admin.address}
                      </p>
                    </div>
                    <div className="right each">
                      <p>
                        {" "}
                        <FontAwesomeIcon
                          icon={faPhone}
                          style={{ marginRight: "6px" }}
                        />{" "}
                        {admin.phone}
                      </p>
                      <p style={{ marginBottom: "0px" }}>
                        {" "}
                        <FontAwesomeIcon
                          icon={faEnvelope}
                          style={{ marginRight: "6px" }}
                        />{" "}
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

                <p className="lastP">{`${admin.name} from ${admin.address} - Contact ${admin.phone} - Email ${admin.email}`}</p>
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
                <p> Class </p>
                <p className="likeInput">
                  {" "}
                  {
                    course.find((obj) => obj._id === admin.course.class).class
                  }{" "}
                </p>
              </div>

              <div className="each width2">
                <p> Group </p>
                <p className="likeInput">
                  {
                    course
                      .find((obj) => obj._id === admin.course.class)
                      .groups.find((obj2) => obj2._id === admin.course.group)
                      .name
                  }
                </p>
              </div>

              <div className="each width2">
                <p>Gender</p>
                <p className="likeInput"> {admin.gender} </p>
              </div>

              <div className="each width2">
                <p> DOB (y/m/d) BS </p>
                <p className="likeInput"> {formatDate(admin.dob)} </p>
              </div>

              <div className="each width2">
                <p> Email </p>
                <p className="likeInput"> {admin.email} </p>
              </div>

              <div className="each width2">
                <p> Phone </p>
                <p className="likeInput"> {admin.phone} </p>
              </div>

              {admin.bus && (
                <div className="each width2">
                  <p> Bus Pickup Point </p>
                  <p className="likeInput">
                    {" "}
                    {
                      school.busFee.find((obj) => obj._id === admin.bus._id)
                        .location
                    }{" "}
                  </p>
                </div>
              )}

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

              <hr className="width4" />

              <div className="each width2">
                <p> Father's Name </p>
                <p className="likeInput">{admin.fName} </p>
              </div>

              <div className="each width2">
                <p> Father's Profession </p>
                <p className="likeInput">{admin.fProfession} </p>
              </div>

              <div className="each width2">
                <p> Mother's Name </p>
                <p className="likeInput">{admin.mName} </p>
              </div>

              <div className="each width2">
                <p> Mother's Profession </p>
                <p className="likeInput">{admin.mProfession} </p>
              </div>

              <div className="each width2">
                <p> Parent's Contact No. </p>
                <p className="likeInput">{admin.phone2} </p>
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
                  {!admin.photo1 && (
                    <img
                      src="https://cdn.pixabay.com/photo/2021/07/21/12/49/error-6482984_640.png"
                      alt=""
                    />
                  )}

                  {admin.photo1 && <img src={admin.photo1.secure_url} alt="" />}
                </div>
              </div>

              <div className="each width1">
                <div
                  className="selectImage"
                  style={{ minHeight: "0", paddingBottom: "25px" }}
                >
                  <p className="h6 w500 mb-2"> National ID </p>
                  {!admin.photo2 && (
                    <img
                      src="https://cdn.pixabay.com/photo/2021/07/21/12/49/error-6482984_640.png"
                      alt=""
                    />
                  )}

                  {admin.photo2 && <img src={admin.photo2.secure_url} alt="" />}
                </div>
              </div>

              <div className="each width1">
                <div
                  className="selectImage"
                  style={{ minHeight: "0", paddingBottom: "25px" }}
                >
                  <p className="h6 w500 mb-2"> Previous Class Certificate </p>
                  {!admin.photo3 && (
                    <img
                      src="https://cdn.pixabay.com/photo/2021/07/21/12/49/error-6482984_640.png"
                      alt=""
                    />
                  )}

                  {admin.photo3 && <img src={admin.photo3.secure_url} alt="" />}
                </div>
              </div>

              <div className="each width1">
                <div
                  className="selectImage"
                  style={{ minHeight: "0", paddingBottom: "25px" }}
                >
                  <p className="h6 w500 mb-2"> Character Certificate </p>
                  {!admin.photo4 && (
                    <img
                      src="https://cdn.pixabay.com/photo/2021/07/21/12/49/error-6482984_640.png"
                      alt=""
                    />
                  )}

                  {admin.photo4 && <img src={admin.photo4.secure_url} alt="" />}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentProfileBig2;
