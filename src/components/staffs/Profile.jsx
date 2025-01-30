import React, { useEffect, useState } from "react";
import "./profile.scss";
import MetaData from "../layout/MetaData";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGraduationCap,
  faLocation,
  faPen,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import userImg from "../../images/user.png";

import CreateNewStaff from "../test/CreateNewStaff";

const Profile = () => {
  const user = useSelector((state) => state.User.user.payload);

  const [admin, setAdmin] = useState(user ? user : null);

  useEffect(() => {
    if (user) {
      setAdmin(user);
    }
  }, [user]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  const [edit, setEdit] = useState(false);
  const [leaveSchool, setLeaveSchool] = useState(false);

  if (edit || leaveSchool) {
    document.body.classList.add("dshauda-hidden");
  } else if (!edit && !leaveSchool) {
    document.body.classList.remove("dshauda-hidden");
  }

  return (
    <>
      {admin && (
        <div className="profile2638">
          <MetaData
            title={`${user && user.role ? "Staff" : "Student"} || Profile`}
          />

          {edit && (
            <CreateNewStaff
              data={{ ...admin }}
              closeFunction={() => setEdit(!edit)}
              title={"Update Your Profile"}
              selfUpdate={true}
            />
          )}

          <div className="profile-very-top">
            <div className="ourContent">
              <div className="cover">
                <img
                  src="https://cdn.pixabay.com/photo/2016/11/01/18/38/background-1789175_1280.png"
                  alt=""
                />
              </div>

              <div className="buttons d-flex">
                <button
                  className="btn text-success"
                  onClick={() => setEdit(!edit)}
                >
                  <FontAwesomeIcon
                    style={{ marginRight: "5px" }}
                    icon={faPen}
                  />{" "}
                  Edit Profile
                </button>
              </div>

              <div className="content">
                <section className="myInfo">
                  <div className="upper d-flex">
                    <div className="image">
                      {/* <img src={admin.pPhoto.secure_url} alt="" /> */}

                      <img
                        src={user.pPhoto ? user.pPhoto.secure_url : userImg}
                        alt=""
                      />
                    </div>
                    <div className="info ms-2">
                      <p className="h6 text-secondary w600"> {admin.name} </p>
                      <p className="h7"> {admin.title} </p>
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
                        {admin.qualification}
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
                      <p>
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
                <hr />

                <p className="lastP" style={{ minWidth: "40vw" }}>
                  {admin.about}
                </p>
              </section>
            </div>
            <div className="each select flex1">
              <div className="alone">
                <p className="h6"> School Code : </p>
                <p className="h6 wbg"> {admin.schoolCode} </p>
              </div>

              <div className="alone">
                <p className="h6"> Login Id : </p>
                <p className="h6 wbg"> {admin.loginId} </p>
              </div>
            </div>
          </div>

          <div className="inputForms2829">
            <div className="form-content6">
              <div className="each width2">
                <p> Full Name </p>
                <p className="likeInput"> {admin.name} </p>
              </div>

              <div className="each width2">
                <p> Title </p>
                <p className="likeInput"> {admin.title} </p>
              </div>

              <div className="each width2">
                <p> Email </p>
                <p className="likeInput"> {admin.email} </p>
              </div>

              <div className="each width2">
                <p> Phone </p>
                <p className="likeInput"> {admin.phone} </p>
              </div>

              <div className="each width4">
                <p> Address </p>
                <p className="likeInput">{admin.address} </p>
              </div>

              <div className="each width2">
                <p>Gender</p>
                <p className="likeInput"> {admin.gender} </p>
              </div>

              <div className="each width2">
                <p> DOB (y/m/d) BS </p>
                <p className="likeInput"> {admin.dob} </p>
              </div>

              <div className="each width4">
                <p> Qualification </p>
                <p className="likeInput"> {admin.qualification} </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
