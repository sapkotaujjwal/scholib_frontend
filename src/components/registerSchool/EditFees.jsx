import React, { useRef, useState } from "react";
import "./editFees.scss";
import {
  POST_CREATE_COURSE,
  ERROR_REMOVE,
  POST_CREATE_COURSE_SUCCESS,
  POST_CREATE_COURSE_FAIL,
} from "../../redux/CreateCourse";
import { useDispatch, useSelector } from "react-redux";
import Error from "../layout/error";
import { SET_ALERT_GLOBAL } from "../../redux/AlertGlobalSlice";
import axios from "axios";
import TableEdit from "../layout/TableEdit";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

const EditFees = ({ data, closeFunction = () => {} }) => {
  const [courseInfo, setCourseInfo] = useState(data);
  const feeTitleRef = useRef(null);

  const error = useSelector((state) => state.CreateCourse.error.payload);
  const loading = useSelector((state) => state.CreateCourse.loading);

  const school = useSelector((state) => state.Home.school.payload);
  const schoolCode = school.schoolCode;

  const dispatch = useDispatch();

  async function handleSubmit() {
    const feeData = courseInfo.fees.map((fee) => {
      return {
        title: fee.title,
        amount: parseInt(fee.amount),
      };
    });

    dispatch(POST_CREATE_COURSE());

    axios
      .post(
        `${process.env.REACT_APP_API_URL}/admin/${schoolCode}/course/feeUpdate`,
        feeData,
        {
          params: {
            courseId: courseInfo._id,
          },
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
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

        if (error.response) {
          dispatch(POST_CREATE_COURSE_FAIL(error.response.data));
          return;
        }
        dispatch(POST_CREATE_COURSE_FAIL(data));
      });
  }

  return (
    <div className="editFeesdwsbj flex1">
      {loading && (
        <div
          className="spinner-container flex1"
          style={{ width: "100%", height: "80vh" }}
        >
          <div
            className="spinner-border text-primary my-4 loading452"
            role="status"
          >
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
        <div className="courseInside730">
          <p className="h5 text-center w600p py-2"> Edit Fee Structure </p>

          {/* Actual thing i want to do  */}

          <div className="actual-container-very-form custom-scrollbar">
            <div className="form-content6">
              <p
                className="h7 text-center text-danger px-2 pt-2"
                style={{ width: "100%" }}
              >
                * Make sure to specify all amounts in a yearly basis
              </p>

              <div className="custom-scrollbar " style={{overflow: 'auto', width: '100%'}}>

              <div className="table-my each width4 custom-scrollbar">
                <TableEdit
                  data={courseInfo.fees}
                  exclude={["_id"]}
                  fields={["Fee Title", "Amount Rs.", "", ""]}
                  setDataFromChild={(a) => {
                    setCourseInfo({ ...courseInfo, fees: a });
                  }}
                />
              </div>

              </div>

              <div className="each width4">
                <hr />

                <div className="grouping">
                  <input
                    className="inputAdv"
                    type="text"
                    placeholder="Add New Fee Title"
                    ref={feeTitleRef}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        document.getElementById("feeBtnClick163138").click();
                      }
                    }}
                  />

                  <div
                    className="enterBtn flex1"
                    id="feeBtnClick163138"
                    onClick={() => {
                      const tempValue = feeTitleRef.current.value;
                      setCourseInfo((prevCourseInfo) => {
                        const newFees = prevCourseInfo.fees
                          ? [...prevCourseInfo.fees]
                          : [];
                        return {
                          ...prevCourseInfo,
                          fees: [
                            ...newFees,
                            {
                              title: tempValue,
                              amount: 0,
                            },
                          ],
                        };
                      });
                      feeTitleRef.current.value = "";
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faCheck}
                      style={{ marginBottom: "0px" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="buttons flex3">
            <button onClick={() => closeFunction()}>Close</button>

            <button
              style={{ backgroundColor: "#00BDD6" }}
              onClick={() => handleSubmit()}
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditFees;
