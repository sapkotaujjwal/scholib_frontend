import React, { useRef, useState } from "react";
import "./reviews.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import ReactStars from "react-stars";

import review from "../../images/review.svg";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { SET_ALERT_GLOBAL } from "../../redux/AlertGlobalSlice";

const Reviews = () => {
  const school = useSelector((state) => state.Home.school.payload);
  const user = useSelector((state) => state.User.user.payload);
  const dispatch = useDispatch();

  const reviewInputRef = useRef(null);

  const reviews = [...school.reviews];

  function shuffle(array) {
    let currentIndex = array.length,
      temporaryValue,
      randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  const [reviewWrite, setReviewWrite] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  if (showAllReviews) {
    document.body.classList.add("dshauda-hidden322");
  } else {
    document.body.classList.remove("dshauda-hidden322");
  }

  const [cRating, setCRating] = useState(0);

  function handleRatingChange(a) {
    setCRating(a);
  }

  function roundToNearestHalf(number) {
    var roundedNumber = Math.round(number * 2) / 2;
    if (Number.isInteger(roundedNumber)) {
      return roundedNumber;
    } else {
      return roundedNumber.toFixed(1); // Convert to fixed decimal for precision
    }
  }

  async function submitReview() {
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/basic/${school.schoolCode}/review/add`,
        {
          rating: cRating,
          message: reviewInputRef.current.value,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        if (response.data.success) {
          dispatch(SET_ALERT_GLOBAL(response.data));
          setReviewWrite(false);
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
    <>
      {
        <div className="reviews732893g">
          <div className="inside flex2">
            <div className="left each">
              <div className="container">
                <div className="topic">
                  <p className="h4 w600"> Reviews </p>
                </div>
                <div className="below-topic flex1">
                  {reviews.length > 0 && (
                    <p className="h5 w500">
                      {" "}
                      {roundToNearestHalf(
                        school.ratings / school.reviews.length
                      )}{" "}
                    </p>
                  )}

                  {reviews.length <= 0 && <p className="h5 w500"> 0 </p>}

                  <div className="stars-main" style={{ margin: "0px 10px" }}>
                    <ReactStars
                      count={5}
                      size={24}
                      half={true}
                      value={roundToNearestHalf(
                        school.ratings / school.reviews.length
                      )}
                      edit={false}
                    />
                  </div>

                  <p className="h7 text-secondary">
                    {" "}
                    {school.reviews.length} reviews{" "}
                  </p>
                </div>
                <div className="image">
                  <img src={review} alt="" />
                </div>
              </div>
            </div>

            <div className="right each">
              {reviews.length === 0 && (
                <>
                  <p className="h5 text-center text-secondary w500">
                    {" "}
                    No reviews available{" "}
                  </p>
                  {/* <p className="h7 text-center mt-3" style={{padding: '0px 15%'}}> If you belong to this school you can login and add a review.. Your review would be highly appreciated... </p> */}
                </>
              )}

              {user && (
                <div
                  className="write"
                  onClick={() => {
                    setReviewWrite(true);
                  }}
                >
                  <button>
                    {" "}
                    <FontAwesomeIcon
                      icon={faPenToSquare}
                      style={{ marginRight: "5px" }}
                    />{" "}
                    Write a review
                  </button>
                </div>
              )}

              {reviewWrite && (
                <div className="input-write">
                  <div
                    className="rating_star_box flex1"
                    style={{ justifyContent: "flex-start" }}
                  >
                    <div className="left263vd">
                      <p className="h5 w600"> Ratings :</p>
                    </div>

                    <div className="right263vd ms-2">
                      <ReactStars
                        count={5}
                        size={24}
                        half={false}
                        value={cRating}
                        edit={true}
                        onChange={handleRatingChange}
                      />
                    </div>
                  </div>

                  <textarea
                    type="text"
                    name=""
                    id=""
                    ref={reviewInputRef}
                    placeholder="Enter Your Message"
                  />

                  <div className="flex4">
                    <button
                      className="btn btn-secondary"
                      onClick={() => setReviewWrite(false)}
                    >
                      {" "}
                      Cancel{" "}
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={() => submitReview()}
                    >
                      {" "}
                      Submit{" "}
                    </button>
                  </div>
                </div>
              )}

              {/* main reviews lies here so this place is actually cool  */}

              <div className="reviews-container">
                {shuffle(reviews)
                  .slice(0, 6)
                  .map((review, index) => {
                    return (
                      <div className="review" key={index}>
                        <div className="user flex1">
                          <div className="image">
                            <img
                              src={
                                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                              }
                              alt=""
                            />
                          </div>
                          <p className="w600">
                            {review.name}
                            <span
                              className="w400 ms-1"
                              style={{ fontSize: "10px" }}
                            >
                              {review.date.substring(
                                0,
                                review.date.indexOf("T")
                              )}
                            </span>
                          </p>
                          <div className="stars-main">
                            <ReactStars
                              count={5}
                              size={24}
                              half={true}
                              value={review.rating}
                              edit={false}
                            />
                          </div>
                        </div>
                        <div className="content">
                          <p className="px-2">{review.message}</p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>

          {reviews.length > 6 && (
            <div className="p-4">
              <button
                className="button-66"
                style={{ margin: "auto" }}
                onClick={() => setShowAllReviews(true)}
              >
                <FontAwesomeIcon icon={faEye} style={{ marginRight: "5px" }} />{" "}
                Show all Reviews
              </button>
            </div>
          )}
        </div>
      }

      {showAllReviews && (
        <div className="allreviews23 flex1">
          <div className="bar flex4">
            <p className="h6 w500"> All reviews </p>

            <button
              className="btn btn-secondary"
              onClick={() => setShowAllReviews(false)}
            >
              {" "}
              Close{" "}
            </button>
          </div>

          <div className="veryInside2328b custom-scrollbar">
            {shuffle(reviews).map((review, index) => {
              return (
                <div className="review" key={index}>
                  <div className="user flex1">
                    <div className="image">
                      <img
                        src={
                          "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                        }
                        alt=""
                      />
                    </div>
                    <p className="w600">
                      {review.name}
                      <span className="w400 ms-1" style={{ fontSize: "10px" }}>
                        {review.date.substring(0, review.date.indexOf("T"))}
                      </span>
                    </p>
                    <div className="stars-main">
                      <ReactStars
                        count={5}
                        size={24}
                        half={true}
                        value={review.rating}
                        edit={false}
                      />
                    </div>
                  </div>
                  <div className="content">
                    <p className="px-2">{review.message}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default Reviews;
