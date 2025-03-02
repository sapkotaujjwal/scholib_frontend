import React, { useRef, useState } from "react";
import "./feeInfo.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { SET_ALERT_GLOBAL } from "../../redux/AlertGlobalSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

const FeeInfo = ({
  _id,
  classFee,
  data,
  StudentCourseInfo,
  amountLeft,
  busAmount,
  feePaid,
  closeFunction = () => {},
}) => {
  const school = useSelector((state) => state.Home.school.payload);
  const schoolCode = school.schoolCode;

  const dispatch = useDispatch();
  const remarkRef = useRef(null);
  const amountRef = useRef(null);

  function addFine() {
    const remark = remarkRef.current.value;
    const amount = amountRef.current.value;

    if (!remark || !amount) {
      dispatch(
        SET_ALERT_GLOBAL({
          status: "Amount and remark are both required",
          message: "Please enter amount and remark",
        })
      );
      return;
    }

    axios
      .get(
        `${process.env.REACT_APP_API_URL}/adminStudent/${schoolCode}/student/${_id}/addFine`,
        {
          params: {
            classId: StudentCourseInfo.class,
            groupId: StudentCourseInfo.group,
            sectionId: StudentCourseInfo.section,
            remark: remark,
            fineAmount: amount,
          },
          withCredentials: true,
        }
      )
      .then((response) => {
        if (response.data.success) {
          dispatch(SET_ALERT_GLOBAL(response.data));
          closeFunction();
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

  function addDiscount() {
    const remark = remarkRef.current.value;
    const amount = amountRef.current.value;

    if (!remark || !amount) {
      dispatch(
        SET_ALERT_GLOBAL({
          status: "Amount and remark are both required",
          message: "Please enter amount and remark",
        })
      );
      return;
    }

    axios
      .get(
        `${process.env.REACT_APP_API_URL}/adminStudent/${schoolCode}/student/${_id}/addDiscount`,
        {
          params: {
            classId: StudentCourseInfo.class,
            groupId: StudentCourseInfo.group,
            sectionId: StudentCourseInfo.section,
            remark: remark,
            discountAmount: amount,
          },
          withCredentials: true,
        }
      )
      .then((response) => {
        if (response.data.success) {
          dispatch(SET_ALERT_GLOBAL(response.data));
          closeFunction();
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
    <div className="busmdaidna122 custom-scrollbar flex1">
      {
        <div className="vmainqqw">
          {/* for closing the entire thing  */}
          <div className="closeContainer">
            <div className="close flex1" onClick={closeFunction}>
              <FontAwesomeIcon icon={faXmark} />
            </div>
          </div>

          <div className="insidermain2323">
            <p className="h5 w500 text-center"> Fee Info </p>

            {
              <div className="content">
                <div className="each flex4">
                  <div className="left233z d-flex">
                    <FontAwesomeIcon icon={faCircleCheck} className="mr-2" />
                    <p className="h7 text-secondary">Class Fee</p>
                  </div>
                  <div className="right233z">
                    <p className="h7 text-secondary w600">{classFee}</p>
                  </div>
                </div>

                <div className="each flex4">
                  <div className="left233z d-flex">
                    <FontAwesomeIcon icon={faCircleCheck} className="mr-2" />
                    <p className="h7 text-secondary"> Previous Left </p>
                  </div>
                  <div className="right233z">
                    <p className="h7 text-secondary w600">
                      {data.previousLeft}
                    </p>
                  </div>
                </div>

                <div className="each flex4">
                  <div className="left233z d-flex">
                    <FontAwesomeIcon icon={faCircleCheck} className="mr-2" />
                    <p className="h7 text-secondary"> Bus Amount </p>
                  </div>
                  <div className="right233z">
                    <p className="h7 text-secondary w600">{busAmount}</p>
                  </div>
                </div>

                <div className="each flex4">
                  <div className="left233z d-flex">
                    <FontAwesomeIcon icon={faCircleCheck} className="mr-2" />
                    <p className="h7 text-secondary ms-2"> Amount Paid </p>
                  </div>
                  <div className="right233z">
                    <p className="h7 text-secondary ms-2 w600">{feePaid}</p>
                  </div>
                </div>

                <hr />

                <div className="each flex4 ">
                  <div className="left233z d-flex ">
                    <FontAwesomeIcon icon={faCircleCheck} className="mr-2" />
                    <p className="h7 text-secondary ms-2 font-semibold">
                      Amount Left
                    </p>
                  </div>
                  <div className="right233z">
                    <p className="h7 text-secondary ms-2 font-semibold">
                      {amountLeft}
                    </p>
                  </div>
                </div>

                <hr />

                {data.fine.map((ind) => {
                  return (
                    <div
                      className="each flex4 withInfo"
                      title={`On ${ind.date.substring(0, 10)} - ${
                        school.staffs.find((stf) => stf._id === ind.approvedBy)
                          .name
                      }`}
                      key={ind._id}
                    >
                      <div className="left233z d-flex">
                        {/* <FontAwesomeIcon icon={faCircleCheck} /> */}
                        <p className="h7 text-secondary ml-2">{ind.remark}</p>
                      </div>
                      <div className="right233z">
                        <p className="h7 text-secondary ml-2 w600">
                          {" "}
                          Rs. {ind.amount}{" "}
                        </p>
                      </div>
                    </div>
                  );
                })}

                <div
                  className="each flex1 ng-one"
                  style={{ justifyContent: "flex-start" }}
                >
                  <div className="left233z d-flex">
                    {/* <FontAwesomeIcon icon={faCircleCheck} /> */}
                    <p className="h7 text-secondary ml-2 w500">
                      {" "}
                      Total Fine :{" "}
                    </p>
                  </div>
                  <div className="right233z">
                    <p className="h7 text-secondary ml-2 w600">
                      {" "}
                      Rs.{" "}
                      {data.fine.reduce(
                        (acc, fine) => acc + fine.amount,
                        0
                      )}{" "}
                    </p>
                  </div>
                </div>

                <hr />

                {data.discount.map((ind) => {
                  return (
                    <div
                      className="each flex4 withInfo"
                      title={`On ${ind.date.substring(0, 10)} - ${
                        school.staffs.find((stf) => stf._id === ind.approvedBy)
                          .name
                      }`}
                      key={ind._id}
                    >
                      <div className="left233z d-flex">
                        {/* <FontAwesomeIcon icon={faCircleCheck} /> */}
                        <p className="h7 text-secondary ml-2">{ind.remark}</p>
                      </div>
                      <div className="right233z">
                        <p className="h7 text-secondary ml-2 w600">
                          {" "}
                          Rs. {ind.amount}{" "}
                        </p>
                      </div>
                    </div>
                  );
                })}

                <div
                  className="each flex1 ng-one"
                  style={{ justifyContent: "flex-start" }}
                >
                  <div className="left233z d-flex">
                    {/* <FontAwesomeIcon icon={faCircleCheck} /> */}
                    <p className="h7 text-secondary ml-2 w500">
                      {" "}
                      Total Discount :{" "}
                    </p>
                  </div>
                  <div className="right233z">
                    <p className="h7 text-secondary ml-2 w600">
                      {" "}
                      Rs.{" "}
                      {data.discount.reduce(
                        (acc, discount) => acc + discount.amount,
                        0
                      )}{" "}
                    </p>
                  </div>
                </div>
              </div>
            }

            {_id && (
              <section>
                <div className="inputmew2 mb-2">
                  <p className="h6 w500"> Remark :</p>
                  <input
                    type="text"
                    className="input1"
                    placeholder="Enter the remark ...."
                    ref={remarkRef}
                  />
                </div>

                <div className="inputmew2 mb-2 mt-3">
                  <p className="h6 w500"> Amount (Rs) :</p>
                  <input
                    type="text"
                    className="input1"
                    placeholder="Enter Your Amount ...."
                    ref={amountRef}
                  />
                </div>

                <button
                  className="btn btn-secondary mt-2 mb-2"
                  style={{ width: "100%", fontSize: "14px" }}
                  onClick={() => addFine()}
                >
                  {" "}
                  Add as fine{" "}
                </button>
                <button
                  className="btn btn-primary mb-3"
                  style={{ width: "100%", fontSize: "14px" }}
                  onClick={() => addDiscount()}
                >
                  {" "}
                  Add as discount{" "}
                </button>
              </section>
            )}
          </div>
        </div>
      }
    </div>
  );
};

export default FeeInfo;
