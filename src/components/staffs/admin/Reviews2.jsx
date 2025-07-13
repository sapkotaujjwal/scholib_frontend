import React, { useEffect, useState, useMemo } from "react";
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
import { Search, Filter, Calendar, User, MessageSquare } from "lucide-react";

const Reviews = () => {
  const dispatch = useDispatch();
  const school = useSelector((state) => state.Home.school.payload);
  const [deleteReviewId, setDeleteReviewId] = useState(null);

  // Filter states
  const [filters, setFilters] = useState({
    searchTerm: "",
    rating: "",
    dateRange: "",
    sortBy: "date-desc",
  });

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
    var dateObject = new Date(inputDate);
    var year = dateObject.getFullYear();
    var month = ("0" + (dateObject.getMonth() + 1)).slice(-2);
    var day = ("0" + dateObject.getDate()).slice(-2);
    var formattedDate = year + "/" + month + "/" + day;
    return formattedDate;
  }

  const formatDateForDisplay = (inputDate) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(inputDate).toLocaleDateString(undefined, options);
  };

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

  const filteredAndSortedReviews = useMemo(() => {
    if (!school?.reviews) return [];

    let filtered = school.reviews.filter((review) => {
      // Search filter
      const searchLower = filters.searchTerm.toLowerCase();
      const matchesSearch =
        !filters.searchTerm ||
        review.name.toLowerCase().includes(searchLower) ||
        review.message.toLowerCase().includes(searchLower);

      // Rating filter - Changed to show reviews BELOW the selected rating
      const matchesRating =
        !filters.rating || review.rating < parseInt(filters.rating);

      // Date filter
      let matchesDate = true;
      if (filters.dateRange) {
        const reviewDate = new Date(review.date);
        const now = new Date();

        switch (filters.dateRange) {
          case "week":
            matchesDate = now - reviewDate <= 7 * 24 * 60 * 60 * 1000;
            break;
          case "month":
            matchesDate = now - reviewDate <= 30 * 24 * 60 * 60 * 1000;
            break;
          case "year":
            matchesDate = now - reviewDate <= 365 * 24 * 60 * 60 * 1000;
            break;
          default:
            matchesDate = true;
        }
      }

      return matchesSearch && matchesRating && matchesDate;
    });

    // Sort reviews
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case "date-asc":
          return new Date(a.date) - new Date(b.date);
        case "date-desc":
          return new Date(b.date) - new Date(a.date);
        case "rating-asc":
          return a.rating - b.rating;
        case "rating-desc":
          return b.rating - a.rating;
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [school?.reviews, filters]);

  const clearFilters = () => {
    setFilters({
      searchTerm: "",
      rating: "",
      dateRange: "",
      sortBy: "date-desc",
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-1 lg:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageSquare className="text-blue-600" size={28} />
            <h1 className="text-2xl font-bold text-gray-900 mb-0">Reviews</h1>
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
              {school?.reviews?.length || 0} total
            </span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="text-gray-600" size={20} />
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search by name or review..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.searchTerm}
              onChange={(e) =>
                setFilters({ ...filters, searchTerm: e.target.value })
              }
            />
          </div>

          {/* Rating Filter - Updated options to show "Below X Stars" */}
          <div>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.rating}
              onChange={(e) =>
                setFilters({ ...filters, rating: e.target.value })
              }
            >
              <option value="">All Ratings</option>
              <option value="5">Below 5 Stars</option>
              <option value="4">Below 4 Stars</option>
              <option value="3">Below 3 Stars</option>
              <option value="2">Below 2 Stars</option>
            </select>
          </div>

          {/* Date Range Filter */}
          <div>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.dateRange}
              onChange={(e) =>
                setFilters({ ...filters, dateRange: e.target.value })
              }
            >
              <option value="">All Time</option>
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="year">Last Year</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.sortBy}
              onChange={(e) =>
                setFilters({ ...filters, sortBy: e.target.value })
              }
            >
              <option value="date-desc">Latest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="rating-desc">Highest Rating</option>
              <option value="rating-asc">Lowest Rating</option>
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
            </select>
          </div>
        </div>

        {/* Clear Filters */}
        {(filters.searchTerm ||
          filters.rating ||
          filters.dateRange ||
          filters.sortBy !== "date-desc") && (
          <div className="mt-4">
            <button
              onClick={clearFilters}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* No Reviews Message */}
      {(!school?.reviews || school.reviews.length < 1) && (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <MessageSquare className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No reviews found
          </h3>
          <p className="text-gray-500">No reviews have been submitted yet.</p>
        </div>
      )}

      {/* Reviews List */}
      {school?.reviews && school.reviews.length > 0 && (
        <div className="space-y-4">
          {filteredAndSortedReviews.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <MessageSquare className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No reviews match your filters
              </h3>
              <p className="text-gray-500">
                Try adjusting your filters to see more reviews.
              </p>
            </div>
          ) : (
            filteredAndSortedReviews.map((rev) => (
              <div
                key={rev._id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          school.logo && school.logo.secure_url
                            ? school.logo.secure_url
                            : placeholderImage
                        }
                        alt="School Logo"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <User className="text-gray-500" size={16} />
                          <h3 className="font-semibold text-gray-900 mb-0">
                            {rev.name}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar size={14} />
                          {formatDateForDisplay(rev.date)}
                        </div>
                      </div>
                    </div>

                    <div
                      onClick={() => {
                        setDeleteReviewId(rev._id);
                        dispatch(
                          SET_CONFIRM_GLOBAL({
                            message:
                              "Are you sure you want to delete this review ?",
                          })
                        );
                      }}
                      className="bg-gray-200 hover:bg-gray-300 hover:text-red-600 p-2 rounded-3xl cursor-pointer"
                    >
                      <FontAwesomeIcon
                        icon={faTrash}
                        className="text-gray-40 cursor-pointer"
                        size="sm"
                      />
                    </div>

                    
                  </div>

                  {/* Rating */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2">
                      <ReactStars
                        count={5}
                        size={24}
                        half={true}
                        value={rev.rating}
                        edit={false}
                        color2={"#ffd700"}
                      />
                      <span className="font-medium text-gray-900">
                        {rev.rating}
                      </span>
                    </div>
                  </div>

                  {/* Message */}
                  <p className="text-gray-700 leading-relaxed">{rev.message}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Reviews;
