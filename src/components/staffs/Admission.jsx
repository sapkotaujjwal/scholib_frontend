import React, { useEffect, useState } from "react";
import "./admission.scss";
import { useDispatch, useSelector } from "react-redux";
import MetaData from "../layout/MetaData";
import Dropdown from "../basicComponents/Dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import StudentProfileBig from "./admin/studentProfileBig";
import { SET_SCHOOL_ADMISSIONS } from "../../redux/HomeSlice";

const Admission = () => {
  const user = useSelector((state) => state.User.user.payload);
  const school = useSelector((state) => state.Home.school.payload);
  const dispatch = useDispatch();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  //for our legendary filter component
  const [filter, showFilter] = useState(false);

  let admissions = school.admissions;

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/admin/${school.schoolCode}/admissions`,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        dispatch(SET_SCHOOL_ADMISSIONS(response.data.data));
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const [studentId, setStudentId] = useState(null);

  if (studentId) {
    document.body.classList.add("dshauda-hidden322");
  } else if (!studentId) {
    document.body.classList.remove("dshauda-hidden322");
  }

  const [filter2, setFilter2] = useState({
    class: "All",
    classStudents: admissions,
    gpa: 0,
    sortBy: "LF",
    admissions: admissions,
  });

  useEffect(() => {
    setFilter2((prevState) => ({
      ...prevState,
      classStudents: school.admissions,
      admissions: school.admissions,
    }));
  }, [school]);

  function sortHere(arr, type = filter2.sortBy) {
    let array;

    if (type === "AO") {
      // Call the sorting function immediately with the input array
      array = (function sortByName(arr) {
        return [...arr].sort((a, b) => {
          const nameA = a.name.toLowerCase();
          const nameB = b.name.toLowerCase();

          if (nameA < nameB) return -1;
          if (nameA > nameB) return 1;
          return 0; // names are equal
        });
      })(arr); // Call the function with arr
    }

    if (type === "GPA") {
      // Call the sorting function immediately with the input array
      array = (function sortByGPA(arr) {
        return [...arr].sort((a, b) => {
          const gpaA = a.gpa || 0; // Default to 0 if gpa is missing or undefined
          const gpaB = b.gpa || 0; // Default to 0 if gpa is missing or undefined
          return gpaB - gpaA;
        });
      })(arr); // Call the function with arr
    }

    if (type === "LF") {
      // Access the global 'school.admissions' array
      const admissions = school.admissions;

      // Call the sorting function immediately with the input array
      array = (function reverseBasedOnFirstArray(secondArray) {
        const sortedArray = admissions.filter((admission) =>
          secondArray.some((secondItem) => secondItem._id === admission._id)
        );

        return sortedArray.reverse();
      })(arr); // Call the function with arr
    }

    if (type === "OF") {
      // Access the global 'school.admissions' array
      const admissions = school.admissions;

      // Call the sorting function immediately with the input array
      array = (function oldestFirst(secondArray) {
        const originalOrderArray = admissions.filter((admission) =>
          secondArray.some((secondItem) => secondItem._id === admission._id)
        );

        return originalOrderArray;
      })(arr); // Call the function with arr
    }

    return array; // Now returns the sorted array, not a function
  }

  return (
    <div className="admissionAdmine2673">
      <MetaData
        title={`${user && user.role ? "Staff" : "Student"} || Admissions`}
      />

      {studentId && (
        <StudentProfileBig
          id={studentId}
          closeFunction={() => setStudentId(null)}
          course={school.course}
        />
      )}

      {filter2.admissions && (
        <div className="inside-content">
        <div className="flex flex-col p-4 bg-white shadow1 rounded-lg mx-[2%]">
          <p className="text-xl font-semibold text-[#133189]">Admissions</p>
          <p className="text-sm text-gray-600">{school.name}</p>
        </div>

          <div className="posgdj d-flex">
            <p className="h5 w600"> Admission Inquiries</p>

            <div className="fs2526 flex1">
              <p className="h6 w600"> {filter2.admissions.length} </p>
            </div>

            <div className="myFilter" onClick={() => showFilter(!filter)}>
              <FontAwesomeIcon icon={faBars} />
              <p className="d-inline-block ms-2"> Filter </p>
            </div>
          </div>

          <div className="myBox34 flex4">
          {filter2.admissions && filter2.admissions.length < 1 && (
              <div className="" style={{ width: "min(640px, 100%)" }}>
                <hr />
                <p className="text-secondary text-center p-2 pt-3 h6">
                  No Admission Inquiries Available
                </p>{" "}
                <hr />
              </div>
            )}

            {filter2.admissions.length >= 1 && (
              <div className="left3553 indi">
                {filter2.admissions.map((content) => {
                  return (
                    <div
                      className="admission-inquiry flex3"
                      onClick={() => setStudentId(content._id)}
                    >
                      <div className="each left flex1">
                        <img
                        className="shadow1"
                          src={
                            content.photo1
                              ? content.photo1.secure_url
                              : "https://www.tenforums.com/attachments/user-accounts-family-safety/322690d1615743307-user-account-image-log-user.png"
                          }
                          alt=""
                        />

                        <div className="info d-inline-block ms-4">
                          <p className="h6 w600 mb-2"> {content.name} </p>

                          <p className="h7">
                            {" "}
                            Class :{" "}
                            {
                              school.course.find(
                                (crc) => crc._id === content.course.class
                              ).class
                            }{" "}
                          </p>
                          <p className="h7">
                            {" "}
                            Group :{" "}
                            {
                              school.course
                                .find((crc) => crc._id === content.course.class)
                                .groups.find(
                                  (grp) => grp._id === content.course.group
                                ).name
                            }{" "}
                          </p>

                          <p className="h6 w600 mt-2">
                            GPA : {content.gpa || "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="each right flex1">
                        <div className="info">
                          <p className="h6"> {content.name} </p>
                          <p className="h6"> {content.phone} </p>
                          <p className="h6"> {content.email} </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            { school && (
              <div
                className={`right3553 indi ${filter ? "" : "rightMobileView"}`}
              >
                <div className="line1 flex1 mb-2">
                  <p className="h5 w600">FILTERS</p>
                </div>

                <div className="fgsjjs my-3">
                  <p className="h6 w500"> Class </p>
                  <Dropdown
                    options={[
                      {
                        value: "all",
                        label: "All",
                      },
                      ...school.course.map((crc) => ({
                        value: crc._id,
                        label: crc.class,
                      })),
                    ]}
                    title={"All"}
                    onSelect={(a, b, c) => {
                      if (c === "all") {
                        return setFilter2((prevState) => ({
                          ...prevState,
                          class: c,
                          classStudents: school.admissions,
                          admissions: sortHere(
                            school.admissions.filter(
                              (std) => std.gpa >= prevState.gpa
                            )
                          ),
                        }));
                      } else {
                        setFilter2((prevState) => ({
                          ...prevState,
                          class: c,
                          classStudents: school.admissions.filter(
                            (std) => std.course.class === c
                          ),
                          admissions: sortHere(
                            school.admissions
                              .filter((std) => std.course.class === c)
                              .filter((std) => std.gpa >= prevState.gpa)
                          ),
                        }));
                      }
                    }}
                  />
                </div>

                <div className="fgsjjs my-3">
                  <p className="h6 w500"> GPA </p>
                  <Dropdown
                    options={[
                      {
                        value: 0,
                        label: "All",
                      },
                      {
                        label: "Above 2",
                        value: 2,
                      },
                      {
                        label: "Above 3",
                        value: 3,
                      },
                      {
                        label: "Above 3.5",
                        value: 3.5,
                      },
                    ]}
                    title={"All"}
                    onSelect={(a, b, c) => {
                      setFilter2((prevState) => ({
                        ...prevState,
                        gpa: c,
                        admissions: sortHere(
                          filter2.classStudents.filter((std) => std.gpa >= c)
                        ),
                      }));
                    }}
                  />
                </div>

                <div className="fgsjjs my-3">
                  <p className="h6 w500"> Sort By </p>
                  <Dropdown
                    options={[
                      {
                        label: "Latest First",
                        value: "LF",
                      },
                      {
                        label: "Oldest First",
                        value: "OF",
                      },
                      {
                        label: "Alphabetical",
                        value: "AO",
                      },
                      {
                        label: "GPA",
                        value: "GPA",
                      },
                    ]}
                    title={"All"}
                    onSelect={(a, b, c) => {
                      setFilter2((prevState) => ({
                        ...prevState,
                        sortBy: c,
                        admissions: sortHere(prevState.admissions, c),
                      }));
                    }}
                  />
                </div>

                {/* <button
                  className="btn d-block mt-3"
                  style={{
                    width: "100%",
                    fontSize: "14px",
                    padding: "4px",
                    backgroundColor: "#01BCD6",
                    color: "#fff",
                  }}
                >
                  Apply{" "}
                </button> */}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Admission;
