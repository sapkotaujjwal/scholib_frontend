import React, { useState, useEffect } from "react";
import "./updates.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import Create from "./Create";
import { useSelector, useDispatch } from "react-redux";

import {
  GET_UPDATE,
  GET_UPDATE_FAIL,
  GET_UPDATE_SUCCESS,
} from "../../redux/UpdateSlice";

import axios from "axios";
import Update from "./Update";
import BigImage from "../test/BigImage";
import { REMOVE_BIGIMAGE } from "../../redux/BigImageSlice";
import MetaData from "../layout/MetaData";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

const Updates = () => {
  const school = useSelector((state) => state.Home.school.payload);
  const schoolCode = school.schoolCode;
  const dispatch = useDispatch();

  const user = useSelector((state) => state.User.user.payload);
  const updates = useSelector((state) => state.Update.update.payload);
  const error = useSelector((state) => state.Update.error.payload);
  const loading = useSelector((state) => state.Update.loading);
  const [newUpdate, setnewUpdate] = useState(false);

  const bigImage = useSelector((state) => state.BigImage.bigImage);

  useEffect(() => {
    dispatch(GET_UPDATE());
    axios
      .get(`${process.env.REACT_APP_API_URL}/basic/${schoolCode}/updates`, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.success) {
          dispatch(GET_UPDATE_SUCCESS(response.data.data));
        } else {
          dispatch(GET_UPDATE_FAIL(response.data.data));
        }
      })
      .catch((error) => {
        const data = {
          message: error.message,
          status: "Cannot communicate with the server",
        };
        dispatch(GET_UPDATE_FAIL(data));
      });
  }, [dispatch, schoolCode, newUpdate]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [newUpdate]);

  if (newUpdate || bigImage) {
    document.body.classList.add("dshauda-hidden322");
  } else {
    document.body.classList.remove("dshauda-hidden322");
  }

  function handleCreatePost() {
    setnewUpdate(true);
  }

  function close8373() {
    setnewUpdate(false);
  }

  // for big Image

  function bigImageClose() {
    dispatch(REMOVE_BIGIMAGE());
  }

  return (
    <>
      {newUpdate && <Create closeFunction={close8373} />}
      {bigImage && <BigImage closeFunction={bigImageClose} />}

      {
        <div className="dgshdtwg6737">
          <div className="main">
            <MetaData title={`${school.sName} || ${"Updates"}`} />


            {false && <div className="top">
              <div className="content pb-3">
                <h3 className="h2 f2 w600"> Updates </h3>
                <h1 className="h5"> {school.name} </h1>
                <p className="h7 text-secondary">
                As the academic year progresses, we're thrilled to share some exciting developments happening around our school! From innovative new programs to inspiring student achievements, there's plenty to celebrate. Stay tuned for updates on upcoming events, academic achievements, and initiatives aimed at fostering a vibrant learning community. Together, let's make this school year one to remember!
                </p>

                <Link to={`/school/${school.schoolCode}/admission`}> <button className="btn btn-primary"> Get Admission </button></Link>
              </div>
            </div>}

            {user && user.role && (
              <div className="admin">
                <button onClick={handleCreatePost}>
                  <FontAwesomeIcon icon={faPen} />{" "}
                  &nbsp;&nbsp;&nbsp;&nbsp;Create a Post
                </button>
              </div>
            )}

            <div className="updates">
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

              {updates && updates.length < 1 ? (
                <>
                <hr />
                <p className="text-secondary text-center p-2 pt-3 h5">
                  {" "}
                  No Updates available{" "}
                </p>
                <hr />
                </>
              ) : (
                ""
              )}

              {updates &&
                updates.map((update,index) => {
                  return <Update update={update} key={index} />;
                })}

              {error && (
                <p className="h6 text-danger mt-4 errorElement shake">
                  {error.status}
                  <span className="w600 ms-2">{error.message}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      }
    </>
  );
};

export default Updates;
