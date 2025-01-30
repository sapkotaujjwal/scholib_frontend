import React, { useState } from "react";
import "./staffProfile.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGraduationCap,
  faLocation,
  faPen,
  faPhone,
  faSignOut,
} from "@fortawesome/free-solid-svg-icons";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";

const StaffProfile = ({ closeFunction }) => {
  //now taking the inputs for school-admin

  const [admin, setAdmin] = useState({
    name: "Ujjwal Sapkota",
    title: "Head Teacher",
    email: "bisiness.ujjwal@gmail.com",
    phone: "9805627835",
    address: "Buddhashanti 2 Budhabare Jhapa",
    qualification: "BIT Computer Science",
    about:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ab, doloremque odit, eligendi molestias cum hic, nisi quas tempora maxime at placeat libero. Quo quos, modi ducimus distinctio iure ad veniam eius ratione odio totam",
    dob: "2062/01/03",
    gender: "Male",
    role: "Administrator",
  });

  return (
    <div className="staffProfile2638 flex1">
      <div className="allProfile custom-scrollbar">
        <div className="profile-very-top">
          <div className="ourContent">
            <div className="cover">
              <img
                src="https://cdn.pixabay.com/photo/2016/11/01/18/38/background-1789175_1280.png"
                alt=""
              />
            </div>

            <div className="buttons d-flex">
              <button className="btn text-success">
                <FontAwesomeIcon style={{ marginRight: "5px" }} icon={faPen} />{" "}
                Edit Profile
              </button>
              <button className="btn text-danger">
                {" "}
                <FontAwesomeIcon
                  style={{ marginRight: "5px" }}
                  icon={faSignOut}
                />{" "}
                Leave School
              </button>
            </div>

            <div className="content">
              <section className="myInfo">
                <div className="upper d-flex">
                  <div className="image">
                    <img
                      src="https://cdn.pixabay.com/photo/2016/03/12/21/05/boy-1252771_1280.jpg"
                      alt=""
                    />
                  </div>
                  <div className="info ms-2">
                    <p className="h6 text-secondary w600"> Ujjwal Sapkota </p>
                    <p className="h7"> Creator </p>
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
                      B.Tech Computer Science{" "}
                    </p>
                    <p>
                      {" "}
                      <FontAwesomeIcon
                        icon={faLocation}
                        style={{ marginRight: "6px" }}
                      />{" "}
                      Shivasatakshi 7 Bangadada Jhapa{" "}
                    </p>
                  </div>
                  <div className="right each">
                    <p>
                      {" "}
                      <FontAwesomeIcon
                        icon={faPhone}
                        style={{ marginRight: "6px" }}
                      />{" "}
                      9806066253{" "}
                    </p>
                    <p>
                      {" "}
                      <FontAwesomeIcon
                        icon={faEnvelope}
                        style={{ marginRight: "6px" }}
                      />{" "}
                      bisiness.ujjwal@gmail.com{" "}
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
                Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                Ducimus, ipsam earum? Beatae labore id, perspiciatis officia
                mollitia quasi adipisci tempora aperiam excepturi officiis
                architecto tenetur facere vel vero molestiae consequuntur
                corrupti, ipsum ea repudiandae ex a quos, exercitationem
                necessitatibus. Dignissimos sapiente ipsam non. Placeat non
                exercitationem pariatur fuga quis doloremque.
              </p>
            </section>
          </div>
          <div className="each select flex1">
            <div className="alone">
              <p className="h6"> School Code : </p>
              <p className="h6 wbg"> 536560 </p>
            </div>

            <div className="alone">
              <p className="h6"> Login Id : </p>
              <p className="h6 wbg"> 8193 </p>
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
    </div>
  );
};

export default StaffProfile;
