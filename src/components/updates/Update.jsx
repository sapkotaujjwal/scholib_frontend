import React, { useState } from "react";
import "./update.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faPen,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import MetaData from "../layout/MetaData";
import { useDispatch, useSelector } from "react-redux";
import Albums01 from "./Albums2";
import axios from "axios";
import Alert2 from "../layout/Alert2";
import userImg from '../../images/user.png'

import Create from "./Create";
import { SET_ALERT_GLOBAL } from "../../redux/AlertGlobalSlice";

const Update = ({ update }) => {
  const school = useSelector((state) => state.Home.school.payload);
  const user = useSelector((state) => state.User.user.payload);

  const [visible , setVisible] = useState(true);

  const dispatch = useDispatch();

  // convert time to 12 hr format
  function convertTo12HourClock(timeString) {
    // Split the time string into hours, minutes, and seconds
    var [hours, minutes, seconds] = timeString.split(":").map(Number);

    // Determine AM or PM
    var period = hours >= 12 ? "PM" : "AM";

    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be converted to 12

    // Format the time
    var formattedTime =
      hours +
      ":" +
      (minutes < 10 ? "0" : "") +
      minutes +
      ":" +
      (seconds < 10 ? "0" : "") +
      seconds +
      " " +
      period;

    return formattedTime;
  }

  const [allImages, setAllImages] = useState(false);
  const [allText, setAllText] = useState(false);

  function showAllImages() {
    setAllImages(true);
  }

  function showAllText() {
    setAllText(true);
  }

  function handleUpdateDeletion() {
    let id = update._id;
    setAlert2(false);

    axios
      .delete(
        `${process.env.REACT_APP_API_URL}/staff/${school.schoolCode}/update/${id}`,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        if (response.data.success) {
          setVisible(false);
          dispatch(SET_ALERT_GLOBAL({
            status: response.data.status,
            message: response.data.message
          }))
        } else {
          alert("Update Deletion failed");
        }
      })
      .catch((error) => {
        const data = {
          message: error.message,
          status: "Cannot communicate with the server",
        };

        console.log(error);

        if (error.response) {
          // alert(error.response.data.message);
          return;
        }
      });
  }

  function closeFunction() {
    handleUpdateDeletion();
  }

  const [alert2, setAlert2] = useState(false);

  if (alert2) {
    document.body.classList.add("overflow-hidden");
  } else {
    document.body.classList.remove("overflow-hidden");
  }

  function closeAlert2() {
    setAlert2(false);
  }

  const [edit, setEdit] = useState(false);

  if (edit) {
    document.body.classList.add("dshauda-hidden");
  } else {
    document.body.classList.remove("dshauda-hidden");
  }

  function handleEdit() {
    setEdit(!edit);
  }

  return (
     <>
      {alert2 && (
        <Alert2
          alert2True={closeFunction}
          alert2False={closeAlert2}
          text1={`Confirm Update Deletion`}
          text2={`Are you sure yo want to delete this update ?`}
        />
      )}

      {edit && (
        <Create
          data={update}
          id={update._id}
          closeFunction={() => setEdit(null)}
        />
      )}

      {!edit && visible && (
        <div className="vybs682782">
          <MetaData title={`${school.sName} || Updates `} />

          <div className="update">
            <div className="date">
              <p className="h7 text-secondary">
                {update.date.substring(0, 10)}{" "}
                <span className="w600 px-1">||</span>{" "}
                {convertTo12HourClock(update.time)}
              </p>
            </div>

            <div className="author flex1">
              {school.logo && <img
                src={school.logo.secure_url}
                alt="user"
              />}
              {!school.logo && <img
                src={userImg}
                alt="user"
              /> }
              <p className="h6 w500 text-secondary mx-3">
                {school.staffs.find((staff)=> staff._id === update.author._id).name}
                <FontAwesomeIcon
                  icon={faCircleCheck}
                  className="mx-1 text-primary"
                />
              </p>

              <p className="h7 text-secondary w400 author-title">
              {school.staffs.find((staff)=> staff._id === update.author._id).title}
              </p>
            </div>

            <div className="content">
              <div className="text">
                <p className="h6 f2 w400 text-dark">
                  {!allText ? update.title.substring(0, 500) : update.title}
                </p>

                {update.title.length > 500 && !allText && (
                  <div className="flex1 moreText">
                    <button onClick={showAllText}> Show All </button>
                  </div>
                )}
              </div>

              <div className="images">
                <Albums01 data={update.images} allImages={allImages} />

                {update.images.length > 4 && !allImages && (
                  <div className="moreText flex1" onClick={showAllImages}>
                    <button>
                      <span className="w500">+ {update.images.length - 4}</span>
                      More
                    </button>
                  </div>
                )}
              </div>
            </div>

            {user &&
              (user.role === "Administrator" ||
                user.role === "Coordinator" ||
                update.author._id === user._id) && (
                <div className="onlyAdmin flex1">
                  <div className="flex1" onClick={() => handleEdit(update._id)}>
                    <FontAwesomeIcon icon={faPen} className="text-success" />
                  </div>
                  <div className="flex1" onClick={() => setAlert2(true)}>
                    <FontAwesomeIcon
                      icon={faTrash}
                      // onClick={()=> alert("You are in editing mode !! HEHE")}
                      className="text-danger"
                    />
                  </div>
                </div>
              )}
          </div>
        </div>
      )}
    </>
  );
};

export default Update;
