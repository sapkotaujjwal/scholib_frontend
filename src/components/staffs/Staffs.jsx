import React, { useEffect, useState } from "react";
import "./staffs.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLocationDot,
  faPhone,
  faPlus,
  faUserTie,
} from "@fortawesome/free-solid-svg-icons";
import CreateNewStaff from "../test/CreateNewStaff";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import StaffProfileBig from "./admin/StaffProfileBig";

import userImg from "../../images/user.png";
import { SET_STAFFS } from "../../redux/OtherInfoSlice";

const Staffs = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const dispatch = useDispatch();

  const school = useSelector((state) => state.Home.school.payload);
  const user = useSelector((state) => state.User.user.payload);
  const schoolCode = school.schoolCode;

  const [newStaff, setNewStaff] = useState(false);

  function handleAddNewStaff() {
    setNewStaff(!newStaff);
  }

  const [bigStaff, setBigStaff] = useState(null);

  if (newStaff || bigStaff) {
    document.body.classList.add("dshauda-hidden");
  } else if (!newStaff && !bigStaff) {
    document.body.classList.remove("dshauda-hidden");
  }

  const staffs = useSelector((state) => state.Other.staffsDetails);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (staffs) {
      setLoading(false);
      return;
    }

    axios
      .get(`${process.env.REACT_APP_API_URL}/staff/${schoolCode}/staffs`, {
        withCredentials: true,
      })
      .then((response) => {
        setLoading(false);

        if (response.data.success) {
          dispatch(SET_STAFFS(response.data.data));
        } else {
          setError(response.data);
        }
      })
      .catch((error) => {
        setLoading(false);
        const data = {
          message: error.message,
          status: "Cannot communicate with the server",
        };
        setError(data);
      });
  }, [schoolCode]);

  return (
    <div className="staffs3267">
      {newStaff && <CreateNewStaff closeFunction={handleAddNewStaff} />}

      {bigStaff && (
        <StaffProfileBig
          id={bigStaff}
          closeFunction={() => {
            setBigStaff(null);
          }}
        />
      )}

      {staffs && (
        <div className="sInside27">
          <div className="veryTop">
            <p className="h4 text-center" style={{ color: "#133189" }}>
              {" "}
              Staffs{" "}
            </p>
            <p className="h6 text-center"> {school.name} </p>
          </div>

          <div className="top2stafs d-flex">
            <p className="h5 w600"> STAFFS </p>
            <div className="number flex1"> {staffs.length} </div>
          </div>

          {user &&
            (user.role === "Administrator" || user.role === "Coordinator") && (
              <div className="onlyAdmin " style={{ marginTop: "20px" }}>
                <button
                  style={{ minWidth: "300px" }}
                  onClick={() => handleAddNewStaff()}
                >
                  {" "}
                  <FontAwesomeIcon
                    icon={faPlus}
                    style={{ marginRight: "5px" }}
                  />{" "}
                  Add New Staff{" "}
                </button>
              </div>
            )}

          <div className="ourStaffsAll">
            <div
              className="profile-container flex1"
              style={{ justifyContent: "flex-start" }}
            >
              {loading && (
                <div
                  className="spinner-container flex1"
                  style={{ width: "100%", height: "80px" }}
                >
                  <div
                    className="spinner-border text-primary my-4 loading452"
                    role="status"
                  >
                    <span className="sr-only">Loading...</span>
                  </div>{" "}
                </div>
              )}

              {!loading && !error && staffs && staffs.length < 1 ? (
                <p className="text-secondary text-center p-2 pt-3 h5">
                  No Staffs available
                </p>
              ) : (
                ""
              )}

              {!loading && error && (
                <p className="text-secondary text-center p-2 pt-3 h5">
                  {error.status} <br />
                  {error.message}
                </p>
              )}

              {staffs &&
                staffs.length >= 1 &&
                staffs.map((ind) => {
                  return (
                    <div
                      className="user-profile-8237"
                      key={ind._id}
                      onClick={(e) => {
                        setBigStaff(ind._id);
                      }}
                    >
                      <div className="top d-flex">
                        <div className="left">
                          {ind.pPhoto && (
                            <img src={ind.pPhoto.secure_url} alt="" />
                          )}

                          {!ind.pPhoto && <img src={userImg} alt="" />}
                        </div>
                        <div className="right">
                          <p className="h6">{ind.name}</p>
                          <p className="h7 text-secondary">{ind.title}</p>
                        </div>
                      </div>

                      <div className="bottom">
                        <div className="each d-flex">
                          <FontAwesomeIcon icon={faUserTie} />
                          <p className="h6" style={{ marginLeft: "12px" }}>
                            {ind.role}
                          </p>
                        </div>

                        <div className="each d-flex">
                          <FontAwesomeIcon icon={faPhone} />
                          <p className="h6" style={{ marginLeft: "12px" }}>
                            {ind.phone}
                          </p>
                        </div>

                        <div className="each d-flex">
                          <FontAwesomeIcon icon={faEnvelope} />
                          <p className="h6" style={{ marginLeft: "12px" }}>
                            {ind.email}
                          </p>
                        </div>

                        <div className="each d-flex">
                          <FontAwesomeIcon icon={faLocationDot} />
                          <p className="h6" style={{ marginLeft: "12px" }}>
                            {ind.address}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Staffs;
