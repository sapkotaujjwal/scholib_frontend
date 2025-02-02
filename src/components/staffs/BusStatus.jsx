import React, { useState } from "react";
import "./busStatus.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faCircleCheck,
  faDollarSign,
  faLocationPin,
  faMap,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import Dropdown from "../basicComponents/Dropdown";
import { useDispatch, useSelector } from "react-redux";
import { SET_ALERT_GLOBAL } from "../../redux/AlertGlobalSlice";
import axios from "axios";
import { busPriceCalculator } from "../../tools/feeTools";

const BusStatus = ({
  _id,
  data,
  StudentCourseInfo,
  closeFunction = () => {},
  closeMain = () => {},
}) => {
  const dispatch = useDispatch();
  const date = useSelector((state) => state.Other.date);

  const [busPlace, setBusPlace] = useState(null);
  const school = useSelector((state) => state.Home.school.payload);

  const schoolCode = school.schoolCode;

  const busPlaces = school.busFee.map((ind) => ({
    label: ind.location,
    value: ind._id,
  }));

  const placeOptions = school.busFee
    .filter((ind) => ind.active === true)
    .map((ind) => ({
      label: ind.location,
      value: ind._id,
    }));

  placeOptions.sort((a, b) => {
    const labelA = a.label.toUpperCase();
    const labelB = b.label.toUpperCase();
    if (labelA < labelB) {
      return -1;
    }
    if (labelA > labelB) {
      return 1;
    }
    return 0;
  });

  function startBus() {
    if (!busPlace) {
      dispatch(
        SET_ALERT_GLOBAL({
          status: "PickUp point not selected",
          message: "Please select a pickup point",
        })
      );
      return;
    }

    axios
      .get(
        `${process.env.REACT_APP_API_URL}/adminStudent/${schoolCode}/student/${_id}/startBus`,
        {
          params: {
            classId: StudentCourseInfo.class,
            groupId: StudentCourseInfo.group,
            sectionId: StudentCourseInfo.section,
            location: busPlace,
          },
          withCredentials: true,
        }
      )
      .then((response) => {
        if (response.data.success) {
          dispatch(SET_ALERT_GLOBAL(response.data));
          closeFunction();
          closeMain();
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

  function endBus() {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/adminStudent/${schoolCode}/student/${_id}/endBus`,
        {
          params: {
            classId: StudentCourseInfo.class,
            groupId: StudentCourseInfo.group,
            sectionId: StudentCourseInfo.section,
          },
          withCredentials: true,
        }
      )
      .then((response) => {
        if (response.data.success) {
          dispatch(SET_ALERT_GLOBAL(response.data));
          closeFunction();
          closeMain();
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

  const busFare = busPriceCalculator(
    date,
    data.bus,
    school.busFee,
    "2081-01-01"
  );


  return (
    <div className="busmdaidna flex1">
      <div className="vmainqqw custom-scrollbar">
        {/* for closing the entire thing  */}
        <div className="closeContainer">
          <div className="close flex1" onClick={closeFunction}>
            <FontAwesomeIcon icon={faXmark} />
          </div>
        </div>

        <div className="insidermain2323">
          <p className="h5 w500 text-center"> Bus Status </p>

          <div className="content">
            <div className="each flex4">
              <div className="left233z d-flex">
                <FontAwesomeIcon icon={faCircleCheck} />
                <p className="h7 text-secondary ms-2"> Current Status </p>
              </div>
              <div className="right233z">
                <p className="h7 text-secondary ms-2 w600">
                  {data.bus[0] && !data.bus[0].end ? "Active" : "Not Active"}
                </p>
              </div>
            </div>

            <div className="each flex4">
              <div className="left233z d-flex">
                <FontAwesomeIcon icon={faLocationPin} />
                <p className="h7 text-secondary ms-2"> Place </p>
              </div>
              <div className="right233z">
                <p className="h7 text-secondary ms-2 w600">
                  {data.bus[0] && !data.bus[0].end
                    ? busPlaces.find(
                        (ind) => ind.value === data.bus[0].place && ind.label
                      ).label
                    : "N/A"}
                </p>
              </div>
            </div>

            <div className="each flex4">
              <div className="left233z d-flex">
                <FontAwesomeIcon icon={faDollarSign} />
                <p className="h7 text-secondary ms-2"> Total Fare </p>
              </div>
              <div className="right233z">
                <p className="h7 text-secondary ms-2 w600"> Rs. {busFare} </p>
              </div>
            </div>

            <hr />

            <div className="each">
              <p className="h6 text-secondary w500"> Bus Service History</p>
            </div>

            <hr />

            {data.bus.length < 1 && (
              <p className="h6 w500 text-center text-secondary"> No data </p>
            )}
            {data.bus.length > 0 &&
              data.bus.map((ind) => {
                return (
                  <>
                    <div className="each flex4">
                      <div className="left233z d-flex">
                        <FontAwesomeIcon icon={faMap} />
                        <p className="h7 text-secondary ms-2"> Place </p>
                      </div>
                      <div className="right233z">
                        <p className="h7 text-secondary ms-2 w600">
                          {(() => {
                            const foundOption = busPlaces.find(
                              (amd) => amd.value === ind.place
                            );
                            return foundOption ? (
                              <span className="">{foundOption.label}</span>
                            ) : (
                              <span className="h7">Place Unknown</span>
                            );
                          })()}
                        </p>
                      </div>
                    </div>

                    <div className="each flex4">
                      <div className="left233z d-flex">
                        <FontAwesomeIcon icon={faCalendar} />
                        <p className="h7 text-secondary ms-2"> Start Date </p>
                      </div>
                      <div className="right233z">
                        <p className="h7 text-secondary ms-2 w600">
                          {" "}
                          {ind.start.substring(0, 10)}{" "}
                        </p>
                      </div>
                    </div>
                    {ind.end && (
                      <div className="each flex4">
                        <div className="left233z d-flex">
                          <FontAwesomeIcon icon={faCalendar} />
                          <p className="h7 text-secondary ms-2"> End Date </p>
                        </div>
                        <div className="right233z">
                          <p className="h7 text-secondary ms-2 w600">
                            {" "}
                            {ind.end.substring(0, 10)}{" "}
                          </p>
                        </div>
                      </div>
                    )}
                    {_id && !data.removedOn && <hr />}
                  </>
                );
              })}
          </div>

          {_id && !data.removedOn && (
            <section>
              {((data.bus[0] && data.bus[0].end) || data.bus.length === 0) && (
                <div className="location-Full flex4">
                  <p className="h6 w500" style={{ width: "120px" }}>
                    {" "}
                    Select Place :
                  </p>

                  <div
                    className="inttt"
                    style={{ width: "calc(100% - 120px)" }}
                  >
                    <Dropdown
                      options={placeOptions}
                      title={`Select One`}
                      onSelect={(a, b, c) => setBusPlace(c)}
                    />
                  </div>
                </div>
              )}

              {((data.bus[0] && data.bus[0].end) || data.bus.length === 0) && (
                <button
                  className="btn btn-primary my-3"
                  style={{ width: "100%", fontSize: "14px" }}
                  onClick={() => startBus()}
                >
                  Start Service
                </button>
              )}

              {data.bus[0] && !data.bus[0].end && (
                <button
                  className="btn btn-primary my-3"
                  style={{ width: "100%", fontSize: "14px" }}
                  onClick={() => endBus()}
                >
                  End Service
                </button>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusStatus;
