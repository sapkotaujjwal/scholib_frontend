import React, { useEffect } from "react";
import "./dashboard.scss";
import MetaData from "../layout/MetaData";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faGraduationCap,
  faLocation,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";

import placeholderImage from "../../images/placeholder.png";

const Dashboard = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const user = useSelector((state) => state.User.user.payload);

  return (
    <div className="staffDashboard2366">
      <MetaData
        title={`${user && user.role ? "Staff" : "Student"} || Dashboard`}
      />
      <div className="inside-staff">
        {/* <div className="top flex3">
          <div className="each px-4 mx-2" style={{backgroundColor: '#F4F2FC'}}> <p className="h7 w500">Working Days </p>  <p className="h5 mt-2"> 260 </p> </div>
          <div className="each px-4 mx-2" style={{backgroundColor: '#F0F4FC'}}> <p className="h7 w500">Present Days </p>  <p className="h5 mt-2"> 240 </p> </div>
          <div className="each px-4 mx-2" style={{backgroundColor: '#F9E0E0'}}> <p className="h7 w500">Absent Days </p>  <p className="h5 mt-2"> 20 </p> </div>
        </div>

        <section className="absent">
          <p className="h5 w600 text-center mb-4">
            
            Absent Days
          </p>

          <div className="abs-container">
            <div className="each left flex1">
              <Table />
            </div>
            <div className="each right">
              <div className="color d-inline-block mx-3">
                <FontAwesomeIcon icon={faCircle} style={{ color: "#00BDD6" }} />
                <p className="h7 text-secondary"> Absent </p>
              </div>
              <div className="color d-inline-block mx-3">
                <FontAwesomeIcon icon={faCircle} style={{ color: "#8353E2" }} />
                <p className="h7 text-secondary"> Present </p>
              </div>

              <div className="circle"></div>

              <p className="h6 text-center my-4 present-text">
                
                100% (present)
              </p>
            </div>
          </div>
        </section> */}

        <section className="myInfo" style={{ marginTop: "30px" }}>
          <div className="upper d-flex">
            <div className="image">
              <img
                src={user.pPhoto ? user.pPhoto.secure_url : placeholderImage}
                alt=""
              />
            </div>
            <div className="info ms-2">
              <p className="h6 text-secondary w600"> {user.name} </p>
              <p className="h7"> {user.title} </p>
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
                {user.qualification}{" "}
              </p>
              <p>
                {" "}
                <FontAwesomeIcon
                  icon={faLocation}
                  style={{ marginRight: "6px" }}
                />{" "}
                {user.address}{" "}
              </p>
            </div>
            <div className="right each">
              <p>
                {" "}
                <FontAwesomeIcon
                  icon={faPhone}
                  style={{ marginRight: "6px" }}
                />{" "}
                {user.phone}{" "}
              </p>
              <p>
                {" "}
                <FontAwesomeIcon
                  icon={faEnvelope}
                  style={{ marginRight: "6px" }}
                />{" "}
                {user.email}{" "}
              </p>
            </div>
          </div>
        </section>

        <section className="about-box">
          <p className="h5 w600"> About </p>

          <p className="lastP">{user.about}</p>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
