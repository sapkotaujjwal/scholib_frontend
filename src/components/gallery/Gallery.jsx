import React, { useRef } from "react";
import "./gallery.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuilding,
  faCalendarWeek,
  faCubesStacked,
  faFingerprint,
  faGlobe,
  faGraduationCap,
  faHandshakeAngle,
  faPen,
  faPeopleGroup,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";
import MetaData from "../layout/MetaData";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import UploadImages from "./UploadImages";

import {
  GET_GALLERY,
  GET_GALLERY_FAIL,
  GET_GALLERY_SUCCESS,
  DELETE_GALLERY_IMAGE,
} from "../../redux/GallerySlice";
import axios from "axios";
import BlurhashImage from "../basicComponents/BlurHash-Frontend";
import { REMOVE_BIGIMAGE, SET_BIGIMAGE } from "../../redux/BigImageSlice";
import BigImage from "../test/BigImage";
import { SET_ALERT_GLOBAL } from "../../redux/AlertGlobalSlice";

import {
  REMOVE_CONFIRM_GLOBAL,
  SET_CONFIRM_GLOBAL,
} from "../../redux/ConfirmGlobalSlice";

const Gallery = () => {
  const school = useSelector((state) => state.Home.school.payload);
  const dispatch = useDispatch();
  const galleryData = useSelector((state) => state.Gallery.gallery);

  const [deleting, setDeleting] = useState(null);
  const schoolCode = school.schoolCode;

  const [index, setIndex] = useState(0);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [index]);

  const [categories, setCategories] = useState("all");
  const [totalCount, setTotalCount] = useState(0);
  const scrollRef = useRef(null);

  //for upload images
  const [newUpdate, setnewUpdate] = useState(false);

  useEffect(() => {
    dispatch(GET_GALLERY());
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/basic/${schoolCode}/gallery?from=${index}&categories=${categories}`
      )
      .then((response) => {
        if (response.data.success) {
          dispatch(GET_GALLERY_SUCCESS(response.data.data));
          setTotalCount(response.data.totalCount);
        } else {
          dispatch(GET_GALLERY_FAIL(response.data.data));
        }
      })
      .catch((error) => {
        const data = {
          message: error.message,
          status: "Cannot communicate with the server",
        };
        dispatch(GET_GALLERY_FAIL(data));
      });
  }, [dispatch, schoolCode, index, categories, newUpdate]);

  const error = useSelector((state) => state.Gallery.error.payload);
  const loading = useSelector((state) => state.Gallery.loading);

  const user = useSelector((state) => state.User.user.payload);

  if (newUpdate) {
    document.body.classList.add("overflow-hidden");
  } else {
    document.body.classList.remove("overflow-hidden");
  }

  function handleCreatePost() {
    setnewUpdate(true);
  }

  function close8373() {
    setnewUpdate(false);
  }

  //for big image

  let object;
  let images_array;

  function loadBigImage(data) {
    if (galleryData && galleryData.length >= 1) {
      images_array = galleryData.map((obj) => obj.image.secure_url);
      object = {
        index: data,
        data: images_array,
      };
      dispatch(SET_BIGIMAGE(object));
    }
  }

  const bigImage = useSelector((state) => state.BigImage.bigImage);

  if (bigImage) {
    document.body.classList.add("dshauda-hidden");
  } else {
    document.body.classList.remove("dshauda-hidden");
  }

  function bigImageClose() {
    dispatch(REMOVE_BIGIMAGE());
  }

  const confirmGlobalStatusState = useSelector(
    (state) => state.ConfirmGlobal.status
  );
  const [confirmGlobalStatus, setconfirmGlobalStatus] = useState(
    confirmGlobalStatusState
  );
  const [deleteImgID, setDeleteImgId] = useState(null);

  useEffect(() => {
    setconfirmGlobalStatus(confirmGlobalStatusState);
  }, [confirmGlobalStatusState]);

  useEffect(() => {
    if (confirmGlobalStatus !== null) {
      handleDeleteImage(deleteImgID);
    }
  }, [confirmGlobalStatus]);

  async function handleDeleteImage(id) {
    setDeleteImgId(id);

    dispatch(
      SET_CONFIRM_GLOBAL({
        message: "Do you really want to delete this image",
      })
    );

    // Create a Promise that resolves when confirmGlobalStatus is not null or declined
    const confirmPromise = new Promise((resolve) => {
      setDeleting(galleryData.findIndex((obj) => obj._id === deleteImgID));

      const intervalId = setInterval(() => {
        if (confirmGlobalStatus !== null) {
          clearInterval(intervalId);
          resolve();
        }
      }, 50); // Check every 100 milliseconds
    });

    // Wait for the confirmPromise to resolve
    await confirmPromise;

    if (confirmGlobalStatus === null || confirmGlobalStatus === "declined") {
      setDeleting(null);
      return dispatch(REMOVE_CONFIRM_GLOBAL());
    }

    dispatch(REMOVE_CONFIRM_GLOBAL());

    axios
      .delete(
        `${process.env.REACT_APP_API_URL}/admin/${schoolCode}/gallery/${id}`,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        if (response.data.success) {
          dispatch(DELETE_GALLERY_IMAGE(id));
          setDeleting(null);
          dispatch(
            SET_ALERT_GLOBAL({
              status: response.data.status,
              message: response.data.message,
            })
          );
        } else {
          setDeleting(null);
          dispatch(
            SET_ALERT_GLOBAL({
              status: response.data.status,
              message: response.data.message,
            })
          );
        }
      })
      .catch((error) => {
        const data = {
          message: error.message,
          status: "Cannot communicate with the server",
        };
        setDeleting(null);

        if (error.response) {
          return dispatch(
            SET_ALERT_GLOBAL({
              status: error.response.data.status,
              message: error.response.data.message,
            })
          );
        }

        dispatch(SET_ALERT_GLOBAL(data));
      });
  }

  return (
    <>
      {newUpdate && <UploadImages closeFunction={close8373} />}
      {bigImage && <BigImage closeFunction={bigImageClose} />}

      <div className="ewdnd68wx">
        <MetaData title={`${school.sName} || Gallery `} />
        <div className="main2365dvysgallery8772">
          <div className="top my-3 mt-5">
            <p
              className="h4 w600 text-center"
              ref={scrollRef}
              style={{ color: "#01BCD6" }}
            >
              {" "}
              Select a Category{" "}
            </p>

            <div className="categories-parent custom-scrollbar">
              <div className="categories mt-4">
                <div
                  className={`img flex1 ${
                    categories === "all" ? "active" : ""
                  }`}
                  onClick={() => {
                    setCategories("all");
                    setIndex(0);
                  }}
                >
                  <div className="icon flex1">
                    <FontAwesomeIcon icon={faGlobe} />{" "}
                  </div>
                  <p className=""> All </p>
                </div>

                <div
                  className={`img flex1 ${
                    categories === "team" ? "active" : ""
                  }`}
                  onClick={() => {
                    setCategories("team");
                    setIndex(0);
                  }}
                >
                  <div className="icon flex1">
                    <FontAwesomeIcon icon={faPeopleGroup} />{" "}
                  </div>
                  <p className=""> Team </p>
                </div>

                <div
                  className={`img flex1 ${
                    categories === "infrastructure" ? "active" : ""
                  }`}
                  onClick={() => {
                    setCategories("infrastructure");
                    setIndex(0);
                  }}
                >
                  <div className="icon flex1">
                    <FontAwesomeIcon icon={faBuilding} />{" "}
                  </div>
                  <p className=""> Infrastructure </p>
                </div>

                <div
                  className={`img flex1 ${
                    categories === "events" ? "active" : ""
                  }`}
                  onClick={() => {
                    setCategories("events");
                    setIndex(0);
                  }}
                >
                  <div className="icon flex1">
                    <FontAwesomeIcon icon={faCalendarWeek} />{" "}
                  </div>
                  <p className=""> Events </p>
                </div>

                <div
                  className={`img flex1 ${
                    categories === "students" ? "active" : ""
                  }`}
                  onClick={() => {
                    setCategories("students");
                    setIndex(0);
                  }}
                >
                  <div className="icon flex1">
                    <FontAwesomeIcon icon={faGraduationCap} />{" "}
                  </div>
                  <p className=""> Students </p>
                </div>

                <div
                  className={`img flex1 ${
                    categories === "services" ? "active" : ""
                  }`}
                  onClick={() => {
                    setCategories("services");
                    setIndex(0);
                  }}
                >
                  <div className="icon flex1">
                    <FontAwesomeIcon icon={faHandshakeAngle} />{" "}
                  </div>
                  <p className=""> Services </p>
                </div>

                <div
                  className={`img flex1 ${
                    categories === "general" ? "active" : ""
                  }`}
                  onClick={() => {
                    setCategories("general");
                    setIndex(0);
                  }}
                >
                  <div className="icon flex1">
                    <FontAwesomeIcon icon={faFingerprint} />{" "}
                  </div>
                  <p className=""> General </p>
                </div>

                <div
                  className={`img flex1 ${
                    categories === "others" ? "active" : ""
                  }`}
                  onClick={() => {
                    setCategories("others");
                    setIndex(0);
                  }}
                >
                  <div className="icon flex1">
                    <FontAwesomeIcon icon={faCubesStacked} />{" "}
                  </div>
                  <p className=""> Others </p>
                </div>
              </div>
            </div>

            {user && user.role && (
              <div className="admin">
                <button onClick={handleCreatePost}>
                  <FontAwesomeIcon icon={faPen} />{" "}
                  &nbsp;&nbsp;&nbsp;&nbsp;Upload an Image
                </button>
              </div>
            )}
          </div>

          <div>
            <section className="gallery">
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

              {error && (
                <p className="h6 text-danger mt-4 errorElement shake">
                  {error.status}
                  <span className="w600 ms-2">{error.message}</span>
                </p>
              )}

              {galleryData && galleryData.length < 1 && (
                <>
                  <p className="h6 text-center py-3 px-3">
                    {" "}
                    No Images Available{" "}
                  </p>
                </>
              )}

              {!loading && !error && galleryData && (
                <ul className="images">
                  {galleryData &&
                    galleryData.length >= 1 &&
                    galleryData.map((data, index) => {
                      return (
                        <div
                          className="img"
                          onClick={() => loadBigImage(index)}
                          key={index}
                        >
                          {deleting === index && (
                            <div className="deleting flex1">
                              <p className="h6 text-secondary"> Deleting... </p>
                            </div>
                          )}

                          {user &&
                            (user.role === "Administrator" ||
                              user.role === "Coordinator" ||
                              user.role === "Moderator") && (
                              <div
                                className="deleteMe"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteImage(data._id);
                                }}
                              >
                                <FontAwesomeIcon icon={faTrash} />{" "}
                              </div>
                            )}
                          <BlurhashImage
                            imageUrl={data.image.secure_url}
                            blurhash={data.image.blurHash}
                            width={data.image.width}
                            height={data.image.height}
                          />
                        </div>
                      );
                    })}
                </ul>
              )}
            </section>
          </div>

          {galleryData && (
            <div className="buttons flex1">
              <button
                className="btn btn-secondary mx-2 px-5"
                disabled={index <= 0}
                onClick={() => {
                  setIndex(index - 12);
                }}
              >
                {" "}
                Previous{" "}
              </button>

              <button
                className="btn btn-primary mx-2 px-5"
                disabled={totalCount <= index + 12}
                onClick={() => {
                  setIndex(index + 12);
                }}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Gallery;
