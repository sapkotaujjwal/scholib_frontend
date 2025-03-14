import React, { useEffect, useRef, useState } from "react";
import "./feeStructure.scss";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "../../layout/Table";
import Dropdown from "../../basicComponents/Dropdown";
import TableEdit2 from "../../layout/TableEdit2";
import axios from "axios";
import { SET_ALERT_GLOBAL } from "../../../redux/AlertGlobalSlice";
import { ADD_SCHOOL_BUS, DELETE_SCHOOL_BUS } from "../../../redux/HomeSlice";
import EditFees from "../../registerSchool/EditFees";
import {
  REMOVE_CONFIRM_GLOBAL,
  SET_CONFIRM_GLOBAL,
} from "../../../redux/ConfirmGlobalSlice";

const FeeStructure = () => {
  const school = useSelector((state) => state.Home.school.payload);
  // const course = useSelector((state) => state.Course.course.payload.course);
  const course = school.course;

  const [cClass, setCClass] = useState(course[0]);

  const locationRef = useRef(null);
  const amountRef = useRef(null);

  const dispatch = useDispatch();

  async function deleteBusRoute(_id) {
    axios
      .delete(
        `${process.env.REACT_APP_API_URL}/admin/${school.schoolCode}/busRoute/${_id}`,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        if (response.data.success) {
          dispatch(DELETE_SCHOOL_BUS(_id));
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

  async function addNewBusRoute() {
    if (!locationRef.current.value || amountRef.current.value < 0) {
      alert("Please provide location with amount");
      return;
    }

    axios
      .post(
        `${process.env.REACT_APP_API_URL}/admin/${school.schoolCode}/busRoute/new`,
        {
          location: locationRef.current.value,
          amount: amountRef.current.value,
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
          dispatch(
            ADD_SCHOOL_BUS(response.data.data)
          );

          locationRef.current.value = "";
          amountRef.current.value = "";
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

  const [editFees, setEditFees] = useState(false);

  // Confirm Global is used Here

  const confirmGlobalStatusState = useSelector(
    (state) => state.ConfirmGlobal.status
  );

  const [idTodelete, setIdToDelete] = useState(null);

  useEffect(() => {
    if (confirmGlobalStatusState === "accepted") {
      deleteBusRoute(idTodelete);
      dispatch(REMOVE_CONFIRM_GLOBAL());
    } else if (confirmGlobalStatusState === "declined") {
      setIdToDelete(null);
      dispatch(REMOVE_CONFIRM_GLOBAL());
    }
  }, [confirmGlobalStatusState]);

  // End of confirm Global

  if (editFees) {
    document.body.classList.add("dshauda-hidden321");
  } else if (!editFees) {
    document.body.classList.remove("dshauda-hidden321");
  }

  return (
    <>
      {editFees && (
        <EditFees data={cClass} closeFunction={() => setEditFees(false)} />
      )}

      {!editFees && <div className="fee-Structure-admin273">
        <div className="texr21">
          <p className="h4 w600"> Fee Structure </p>
        </div>

        {course.length === 0 && (
          <>
            <hr />

            <p className="h6 text-center mx-2 text-secondary my-3">
              No Courses available
            </p>
            <hr />
          </>
        )}

        {course.length > 0 && (
          <div className="fee-Table my-3 pb-3">
            <div className="for-dropdown flex1 mb-2">
              <p className="h6 w500 pe-2 mb-0"> Class : </p>
              <Dropdown
                onSelect={(a, b, c) => {
                  const selectedCourse = course.find((data) => data._id === c);
                  setCClass(selectedCourse);
                }}
                title={cClass.class}
                options={course.map((crc) => {
                  return {
                    label: crc.class,
                    value: crc._id,
                  };
                })}
              />

              <button
                onClick={() => {
                  setEditFees(true);
                }}
                className="btn btn-secondary h6 px-3 ml-2 mb-0"
                style={{ minWidth: "100px" }}
              >
                {" "}
                Edit Fees
              </button>
            </div>

            <div className="custom-scrollbar">
              <DataTable
                fields={["Title", "Amount ( Yearly )"]}
                data={cClass.fees.map(({ ...data }) => {
                  delete data._id;
                  return data;
                })}
              />
            </div>

            <hr />
            <p className="h6 w500 text-center my-3">
              <span
                className="w600 text-gray-600 me-3 px-1 py-2"
                style={{ borderRadius: "4px" }}
              >
                {" "}
                Total Amount :{" "}
              </span>{" "}
              Rs. {cClass.fees.reduce((sum, fee) => sum + fee.amount, 0)}
            </p>

            <hr />
          </div>
        )}

        {/* <hr className="line mb-3" /> */}

        <div className="texr21 pt-3">
          <p className="h4 w600"> Bus Fees </p>
        </div>

        <div className="bus-fee-table-container flex3 shadow1 rounded-md">
          <div className="ind121bsbdjd">
            <TableEdit2
              excludedKeys={["_id"]}
              function1={(_id) => {
                setIdToDelete(_id);

                dispatch(
                  SET_CONFIRM_GLOBAL({
                    message: "Are you sure to delete this bus route ?",
                  })
                );
              }}
              busFees={true}
              data={school.busFee
                .map((indData, index) => {
                  if (indData.active) {
                    return {
                      place: indData.location,
                      amount: indData.amounts[0].amount,
                      _id: indData._id,
                    };
                  }
                  return null;
                })
                .filter((item) => item)}
              fields={["Place", "Amount (Monthly)", "", ""]}
            />
          </div>
        </div>

        <hr />

        <div className="texr21 pt-3">
          <p className="h5 w600"> Add New Place </p>
        </div>

        <div className="add-new-place">
          <div className="my-inde0237">
            <p className="h6"> Place </p>
            <input ref={locationRef} type="text" />
          </div>

          <div className="my-inde0237">
            <p className="h6"> Amount (monthly) </p>
            <input
              ref={amountRef}
              type="text"
              onKeyPress={(event) => {
                const keyCode = event.keyCode || event.which;
                const keyValue = String.fromCharCode(keyCode);
                const numericRegex = /^[0-9]+$/;
                if (!numericRegex.test(keyValue)) {
                  event.preventDefault();
                }
              }}
            />
          </div>
        </div>

        <div
          className="buttons flex1"
          style={{ justifyContent: "flex-end", width: "100%" }}
        >
          <button
            className="btn btn-primary"
            style={{ width: "min(100%, 450px)" }}
            onClick={() => addNewBusRoute()}
          >
            {" "}
            Submit{" "}
          </button>
        </div>
      </div>}
    </>
  );
};

export default FeeStructure;
