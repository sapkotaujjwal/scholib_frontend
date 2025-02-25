import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  POST_CREATE_COURSE,
  ERROR_REMOVE,
  POST_CREATE_COURSE_SUCCESS,
  POST_CREATE_COURSE_FAIL,
} from "../../redux/CreateCourse";
import { SET_ALERT_GLOBAL } from "../../redux/AlertGlobalSlice";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import Error from "../layout/error";

const EditFees = ({ data, closeFunction = () => {} }) => {
  const [courseInfo, setCourseInfo] = useState(data);
  const feeTitleRef = useRef(null);

  const error = useSelector((state) => state.CreateCourse.error.payload);
  const loading = useSelector((state) => state.CreateCourse.loading);
  const school = useSelector((state) => state.Home.school.payload);
  const schoolCode = school.schoolCode;

  const dispatch = useDispatch();

  async function handleSubmit() {
    const feeData = courseInfo.fees.map((fee) => ({
      title: fee.title,
      amount: parseInt(fee.amount),
    }));

    dispatch(POST_CREATE_COURSE());

    axios
      .post(
        `${process.env.REACT_APP_API_URL}/admin/${schoolCode}/course/feeUpdate`,
        feeData,
        {
          params: { courseId: courseInfo._id },
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      )
      .then((response) => {
        if (response.data.success) {
          dispatch(POST_CREATE_COURSE_SUCCESS(response.data.data));
          dispatch(SET_ALERT_GLOBAL(response.data));
          closeFunction();
        } else {
          dispatch(POST_CREATE_COURSE_FAIL(response.data.data));
        }
      })
      .catch((error) => {
        const data = {
          message: error.message,
          status: "Cannot communicate with the server",
        };
        dispatch(
          POST_CREATE_COURSE_FAIL(error.response ? error.response.data : data)
        );
      });
  }

  const updateFee = (index, field, value) => {
    setCourseInfo((prev) => {
      const newFees = [...prev.fees];
      newFees[index] = { ...newFees[index], [field]: value };
      return { ...prev, fees: newFees };
    });
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 "
      style={{ zIndex: 100000 }}
    >
      <div className="w-full max-w-xl bg-white rounded-lg shadow-xl p-6 m-4 max-h-[90vh] overflow-y-auto">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-75">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-t-4 border-blue-500 border-opacity-25">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        )}

        {error && (
          <Error
            status={error.status}
            message={error.message}
            errorRemove={() => dispatch(ERROR_REMOVE())}
          />
        )}

        {!loading && !error && (
          <>
            <h5 className="text-xl font-semibold text-center mb-4">
              Edit Fee Structure
            </h5>

            <p className=" text-red-600 text-center mb-3 text-sm">
              Make sure to specify all amounts on a yearly basis
            </p>

            {/* Fee List */}
            <div className="space-y-4 mb-6">
              {courseInfo.fees?.map((fee, index) => (
                <div key={index} className="flex space-x-2 items-center">
                  <input
                    type="text"
                    value={fee.title}
                    onChange={(e) => updateFee(index, "title", e.target.value)}
                    className="flex-1 rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                    placeholder="Fee Title"
                  />
                  <input
                    type="number"
                    value={fee.amount}
                    onChange={(e) => updateFee(index, "amount", e.target.value)}
                    className="w-32 rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                    placeholder="Amount"
                  />
                </div>
              ))}
            </div>

            {/* Add New Fee */}
            <div className="space-y-4 mb-6">
              <hr className="border-gray-200" />
              <div className="flex items-center space-x-2">
                <input
                  ref={feeTitleRef}
                  type="text"
                  placeholder="Add New Fee Title"
                  className="flex-1 rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      document.getElementById("addFeeBtn").click();
                    }
                  }}
                />
                <button
                  id="addFeeBtn"
                  className="rounded-md bg-green-500 p-2 text-white hover:bg-green-600"
                  onClick={() => {
                    const tempValue = feeTitleRef.current.value;
                    if (tempValue) {
                      setCourseInfo((prev) => ({
                        ...prev,
                        fees: [
                          ...(prev.fees || []),
                          { title: tempValue, amount: 0 },
                        ],
                      }));
                      feeTitleRef.current.value = "";
                    }
                  }}
                >
                  <FontAwesomeIcon icon={faCheck} className="mx-3" />
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 w-[50%]"
                onClick={closeFunction}
              >
                Close
              </button>
              <button
                className="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 w-[50%]"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EditFees;
