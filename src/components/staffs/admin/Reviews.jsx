import React, { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faPenToSquare,
  faStar as faStarSolid,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { SET_ALERT_GLOBAL } from "../../../redux/AlertGlobalSlice";

// Custom star rating component using FontAwesome
const StarRating = ({
  value,
  onChange = null,
  editable = false,
  size = "text-lg",
}) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex">
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          className={`${size} text-amber-400 focus:outline-none transition-colors duration-200 ${
            editable ? "cursor-pointer hover:text-amber-500" : "cursor-default"
          }`}
          onClick={() => editable && onChange && onChange(star)}
          disabled={!editable}
        >
          <FontAwesomeIcon
            icon={star <= Math.round(value) ? faStarSolid : faStarRegular}
          />
        </button>
      ))}
    </div>
  );
};

const Reviews = () => {
  const school = useSelector((state) => state.Home.school.payload);
  const user = useSelector((state) => state.User.user.payload);
  const dispatch = useDispatch();

  const reviewInputRef = useRef(null);
  const reviews = [...school.reviews];

  const [reviewWrite, setReviewWrite] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [cRating, setCRating] = useState(0);

  function shuffle(array) {
    let currentIndex = array.length,
      temporaryValue,
      randomIndex;

    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  // Lock body scroll when showing all reviews
  if (showAllReviews) {
    document.body.classList.add("overflow-hidden");
  } else {
    document.body.classList.remove("overflow-hidden");
  }

  function roundToNearestHalf(number) {
    if (isNaN(number) || reviews.length === 0) return 0;
    var roundedNumber = Math.round(number * 2) / 2;
    if (Number.isInteger(roundedNumber)) {
      return roundedNumber;
    } else {
      return roundedNumber.toFixed(1);
    }
  }

  const averageRating = roundToNearestHalf(
    school.ratings / school.reviews.length
  );

  async function submitReview() {
    if (!cRating || !reviewInputRef.current.value.trim()) {
      dispatch(
        SET_ALERT_GLOBAL({
          message: "Please provide both a rating and a review message",
          status: "error",
        })
      );
      return;
    }

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

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="w-full py-8">
      <div className="w-full">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row  justify-between mb-8">
          <div className="flex mb-4 md:mb-0 w-full justify-start">
            <h2 className="text-2xl font-bold text-white mr-4">Reviews</h2>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg py-1 px-3 flex items-center">
              <span className="text-xl font-bold text-amber-400 mr-2">
                {averageRating}
              </span>
              <StarRating value={averageRating} size="text-sm" />
              <span className="ml-2 text-sm text-white/80">
                ({reviews.length})
              </span>
            </div>
          </div>

          {user && (
            <button
              onClick={() => setReviewWrite(!reviewWrite)}
              className="flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-all duration-300 shadow-md min-w-[280px]"
            >
              <FontAwesomeIcon icon={faPenToSquare} className="mr-2" />
              {reviewWrite ? "Cancel Review" : "Write a Review"}
            </button>
          )}
        </div>

        {/* Review Form */}
        {reviewWrite && (
          <div className="w-full backdrop-blur-md rounded-md p-6 mb-8 animate-fade-in shadow1">
            <h3 className="text-lg font-semibold text-white mb-4">
              Share Your Experience
            </h3>

            <div className="mb-4">
              <label className="block text-white mb-2">Your Rating</label>
              <StarRating
                value={cRating}
                onChange={setCRating}
                editable={true}
                size="text-2xl"
              />
            </div>

            <div className="mb-4">
              <label className="block text-white mb-2">Your Review</label>
              <textarea
                ref={reviewInputRef}
                className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-white/30 focus:outline-none"
                rows="4"
                placeholder="Share your thoughts about this school..."
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setReviewWrite(false)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitReview}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
              >
                Submit Review
              </button>
            </div>
          </div>
        )}

        {/* Reviews Section */}
        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-block p-4 rounded-full bg-white/10 mb-4">
              <FontAwesomeIcon
                icon={faStarSolid}
                className="text-4xl text-white/50"
              />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No Reviews Yet
            </h3>
            <p className="text-white/70 max-w-md mx-auto">
              Be the first to share your experience with this school.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {shuffle(reviews)
                .slice(0, 6)
                .map((review, index) => (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-sm p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-white/20 flex items-center justify-center mr-3">
                        <img
                          src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                          alt=""
                          className="w-6 h-6 object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-white">
                          {review.name}
                        </h4>
                        <div className="flex items-center">
                          <StarRating value={review.rating} size="text-xs" />
                          <span className="ml-2 text-xs text-white/60">
                            {formatDate(review.date)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-white/80 text-sm">{review.message}</p>
                  </div>
                ))}
            </div>

            {reviews.length > 6 && (
              <div className="text-center">
                <button
                  onClick={() => setShowAllReviews(true)}
                  className="inline-flex items-center px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-full transition-all duration-300 shadow-md"
                >
                  <FontAwesomeIcon icon={faEye} className="mr-2" />
                  View All Reviews
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* All Reviews Modal */}
      {showAllReviews && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-blue-900/90 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="text-xl font-bold text-white">
                All Reviews ({reviews.length})
              </h3>
              <button
                onClick={() => setShowAllReviews(false)}
                className="text-white/70 hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="overflow-y-auto p-4 flex-grow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {shuffle(reviews).map((review, index) => (
                  <div key={index} className="bg-white/10 p-4 rounded-lg">
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-white/20 flex items-center justify-center mr-3">
                        <img
                          src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                          alt=""
                          className="w-6 h-6 object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-white">
                          {review.name}
                        </h4>
                        <div className="flex items-center">
                          <StarRating value={review.rating} size="text-xs" />
                          <span className="ml-2 text-xs text-white/60">
                            {formatDate(review.date)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-white/80 text-sm">{review.message}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-white/10">
              <button
                onClick={() => setShowAllReviews(false)}
                className="w-full py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reviews;
