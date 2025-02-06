import React, { useEffect, useState } from "react";
import "./reviews.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import ReactStars from "react-stars";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { SET_ALERT_GLOBAL } from "../../../redux/AlertGlobalSlice";

import { DELETE_REVIEW } from "../../../redux/HomeSlice";
import {
  REMOVE_CONFIRM_GLOBAL,
  SET_CONFIRM_GLOBAL,
} from "../../../redux/ConfirmGlobalSlice";

import placeholderImage from "../../../images/placeholder.png";

const Reviews = () => {
  const dispatch = useDispatch();
  const school = useSelector((state) => state.Home.school.payload);

  const [deleteReviewId, setDeleteReviewId] = useState(null);

  const confirmGlobalStatusState = useSelector(
    (state) => state.ConfirmGlobal.status
  );

  useEffect(() => {
    if (confirmGlobalStatusState === "accepted") {
      deleteReview(deleteReviewId);
      dispatch(REMOVE_CONFIRM_GLOBAL());
    } else if (confirmGlobalStatusState === "declined") {
      dispatch(REMOVE_CONFIRM_GLOBAL());
    }
  }, [confirmGlobalStatusState]);

  function convertDate(inputDate) {
    // Create a new Date object from the input string
    var dateObject = new Date(inputDate);

    // Extract year, month, and day from the date object
    var year = dateObject.getFullYear();
    var month = ("0" + (dateObject.getMonth() + 1)).slice(-2); // Adding 1 because getMonth() returns zero-based month
    var day = ("0" + dateObject.getDate()).slice(-2);

    // Concatenate the components with '/' as separator
    var formattedDate = year + "/" + month + "/" + day;

    return formattedDate;
  }

  async function deleteReview(_id) {
    axios
      .delete(
        `${process.env.REACT_APP_API_URL}/admin/${school.schoolCode}/review/${_id}`,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        if (response.data.success) {
          dispatch(DELETE_REVIEW(_id));
          dispatch(SET_ALERT_GLOBAL(response.data));
        } else {
          dispatch(SET_ALERT_GLOBAL(response.data));
        }
      })
      .catch((error) => {
        const data = {
          message: error.message,
          status: "Cannot communicate with the server",
        };

        if (error.response) {
          dispatch(SET_ALERT_GLOBAL(error.response.data));
          return;
        }
        dispatch(SET_ALERT_GLOBAL(data));
      });
  }

  return (
    <div className="adminReviews23879">
      <div className="texr21 pb-2">
        <p className="h4 w600"> Reviews </p>
      </div>

      {school.reviews.length < 1 && (
        <div className="my-3">
          <hr />
          <p
            className="text-lg text-gray-500 py-2 w500 text-center"
            style={{ margin: "auto" }}
          >
            {" "}
            No reviews found{" "}
          </p>
          <hr />
        </div>
      )}

      <div className="meMain23y flex4">
        <div className="vLeft etqeqs">
          {school.reviews.map((rev) => {
            return (
              <div key={rev._id} className="vRach239 p-3  mb-3">
                <div
                  className="vTop111 flex1 pe-3"
                  style={{ justifyContent: "flex-end" }}
                >
                  <FontAwesomeIcon
                    onClick={() => {
                      setDeleteReviewId(rev._id);
                      dispatch(
                        SET_CONFIRM_GLOBAL({
                          message: "Are you sure to remove this staff",
                        })
                      );
                    }}
                    icon={faTrash}
                    style={{ color: "grey", cursor: "pointer" }}
                  />
                </div>

                <div className="box2328 flex1">
                  <img
                    src={
                      school.logo && school.logo.secure_url
                        ? school.logo.secure_url
                        : placeholderImage
                    }
                    alt="School Logo"
                  />

                  <p className="h6 w600 ps-3"> {rev.name} </p>
                  <p
                    className="h7 w400 ps-3 bsajcsa77 text-secondary"
                    style={{}}
                  >
                    {convertDate(rev.date)}
                  </p>

                  <div className="stars-main">
                    <ReactStars
                      count={5}
                      size={30}
                      half={true}
                      value={rev.rating}
                      edit={false}
                    />
                  </div>

                  <p className="h6 w400 ps-3" style={{ fontSize: "15px" }}>
                    {rev.message}
                  </p>
                </div>
              </div>
            );
          })}
        </div>


          {/* Work on this as it is not completed  */}
          
        {/* <div className="vRight etqeqs">
          <p className="h5" style={{ marginBottom: "25px" }}>
            {" "}
            FILTERS{" "}
          </p>

          <div className="ind21">
            <p className="h6 text-secondary"> Sort By </p>
            <Dropdown />
          </div>

          <div className="ind21 mt-3">
            <p className="h6 text-secondary"> Ratings </p>
            <Dropdown />
          </div>
        </div> */}


      </div>
    </div>
  );
};

export default Reviews;
