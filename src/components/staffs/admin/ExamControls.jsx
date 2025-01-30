import React, { useEffect, useState } from "react";
import "./examControls.scss";
import { useDispatch, useSelector } from "react-redux";
import Dropdown from "../../basicComponents/Dropdown";
import AllClasses from "./AllClasses";
import axios from "axios";
import { SET_ALERT_GLOBAL } from "../../../redux/AlertGlobalSlice";
import DataTable from "../../layout/Table";

const ExamControls = ({ closeFunction = () => {} }) => {
  const courses = useSelector((state) => state.Course.course.payload.course);
  const school = useSelector((state) => state.Home.school.payload);
  const schoolCode = school.schoolCode;
  const dispatch = useDispatch();
  const students = useSelector((state) => state.Students.students.payload);

  const [currentClass, setCurrentClass] = useState(
    courses.length > 0 ? courses[0] : null
  );

  function getAllSectionIds() {
    if (currentClass === null) {
      return [];
    }

    let sectionIds = [];

    currentClass.groups.forEach((group) => {
      group.sections.forEach((section) => {
        sectionIds.push(section);
      });
    });

    return sectionIds;
  }

  const [allSections, setAllSections] = useState(
    getAllSectionIds(
      courses.find((crc) => {
        return crc._id === currentClass;
      })
    )
  );

  const [currentSection, setCurrentSection] = useState(allSections[0]);

  useEffect(() => {
    setAllSections(getAllSectionIds());
    getExamInfo();
  }, [currentClass]);

  useEffect(() => {
    setCurrentSection(allSections[0]);
    setCurrentSubject(null);
  }, [allSections]);

  //starting of my create-result component

  const [allClasses, setAllClasses] = useState(false);

  if (allClasses) {
    document.body.classList.add("dshauda-hidden");
  } else if (!allClasses) {
    document.body.classList.remove("dshauda-hidden");
  }

  function addNewExam(a) {
    axios
      .get(`${process.env.REACT_APP_API_URL}/admin/${schoolCode}/exam/add`, {
        params: {
          classesList: JSON.stringify(a),
        },
        withCredentials: true,
      })
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

  function publishResult(a) {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/admin/${schoolCode}/result/publish`,
        {
          params: {
            classesList: JSON.stringify(a),
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

  const [examInfo, setExamInfo] = useState(null);
  const [currentTerm, setCurrentTerm] = useState(null);

  useEffect(() => {
    if (!examInfo) {
      return;
    }

    setCurrentSubject(
      examInfo.find((sec) => sec.section === currentSection._id).exam.term[
        currentTerm - 1
      ].subjects[0]
    );
  }, [currentTerm]);

  function getExamInfo() {
    if (!currentClass) {
      return;
    }

    setExamInfo(null);
    axios
      .get(`${process.env.REACT_APP_API_URL}/admin/${schoolCode}/exam/info`, {
        params: {
          year: 2081,
          classId: currentClass._id,
          sectionIds: getAllSectionIds().map((each) => each._id),
        },
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.success) {
          setExamInfo(response.data.data);

          setCurrentTerm(
            response.data.data.find((sec) => sec.section === currentSection._id)
              .exam.term.length
          );

          // setCurrentTerm(response.data.data.course.term.length - 1);
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

  const [allSubjects, setAllSubjects] = useState([]);
  const [currentSubject, setCurrentSubject] = useState(null);

  useEffect(() => {
    if (!currentSection) {
      return;
    }

    setAllSubjects(
      currentSection.subjects.map((sub) => {
        return {
          label: sub.subject,
          value: sub._id,
        };
      })
    );
  }, [currentSection]);

  useEffect(() => {
    if (!currentSubject) return;

    // Create a deep copy of the examInfo
    const updatedExamInfo = JSON.parse(JSON.stringify(examInfo));

    // Find the section and subject and update it
    const section = updatedExamInfo.find(
      (sec) => sec.section === currentSection._id
    ).exam.term[currentTerm - 1];
    const subjectIndex = section.subjects.findIndex(
      (sub) => sub._id === currentSubject._id
    );

    if (subjectIndex !== -1) {
      section.subjects[subjectIndex] = currentSubject;
    }

    setExamInfo(updatedExamInfo);
  }, [currentSubject]);

  const [ourAlert, setOurAlert] = useState(false);
  const [examInfo2, setExamInfo2] = useState([]);
  const [loading, setLoading] = useState(false);

  function updateExamInfo() {
    let examDataMain = examInfo2
      .find((crc) => crc._id === examInfo._id)
      .course.term[currentTerm].section.find(
        (sec) => sec._id === currentSection._id
      )
      .subjects.find((sub) => sub._id === currentSubject._id);

    let reObj = {
      data: examDataMain,
      course: examInfo._id,
      term: currentTerm,
      section: currentSection._id,
      subject: currentSubject._id,
    };

    // console.log(reObj);
    // console.log(examInfo2);

    axios
      .post(
        `${process.env.REACT_APP_API_URL}/staff/${school.schoolCode}/exam/update`,
        reObj,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        setLoading(false);
        setOurAlert(false);

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
          setLoading(false);
          setOurAlert(false);
          dispatch(SET_ALERT_GLOBAL(error.response.data));
          return;
        }
        setLoading(false);
        setOurAlert(false);
        dispatch(SET_ALERT_GLOBAL(data));
      });
  }

  // console.log("Exam Info 2 Is :");
  console.log(examInfo2);
  // console.log(currentSubject);

  return (
    <div className="exam-controls-main">
      <div className="insiderxzqw custom-scrollbar">
        <div className="close">
          <button onClick={() => closeFunction()}> Close </button>
        </div>

        <div className="myContent">
          <p className="h5 w600 text-center f2"> Exam Controls </p>

          <div className="box flex1">
            <div className="each first">
              <div
                className="buttons mt-3 mb-3 flex1"
                style={{ justifyContent: "flex-end" }}
              >
                <button
                  className="button-border-two me-2"
                  onClick={() =>
                    setAllClasses({
                      title: "Add New Exam",
                      btnText: "Add New Exam",
                      handleGetSelectedOnes: addNewExam,
                    })
                  }
                >
                  {" "}
                  Add New Exam{" "}
                </button>
                <button
                  className="button-border-one"
                  onClick={() =>
                    setAllClasses({
                      title: "Publish Result",
                      btnText: "Publish Result",
                      handleGetSelectedOnes: publishResult,
                    })
                  }
                >
                  {" "}
                  Publish Result{" "}
                </button>
              </div>

              <hr />
            </div>
          </div>
          <p className="h6 w600 text-center"> Results Table </p>
          <div
            className="results-table flex4"
            style={{ alignItems: "flex-start" }}
          >
            <div className="each first">
              {/* for that legendary create result component */}

              <div className="our-dropdown flex1 mb-3">
                <div className="righterOne flex1">
                  {
                    <div
                      className="each flex1 ms-2 ps-2"
                      style={{ marginTop: "8px" }}
                    >
                      {" "}
                      <p className="h7 w500"> Class : </p>{" "}
                      <Dropdown
                        title={currentClass && currentClass.class}
                        options={courses.map((ind) => {
                          return {
                            label: ind.class,
                            value: ind._id,
                          };
                        })}
                        onSelect={(a, b, c) => {
                          if (examInfo) {
                            setExamInfo2((prevArray) => {
                              const index = prevArray.findIndex(
                                (item) => item._id === examInfo._id
                              );

                              if (index !== -1) {
                                // Replace the existing item with the new examInfo
                                return prevArray.map((item, i) =>
                                  i === index ? examInfo : item
                                );
                              } else {
                                // Add the new examInfo to the array
                                return [...prevArray, examInfo];
                              }
                            });
                          }
                          setCurrentClass(
                            courses.find((ind) => {
                              return ind._id === c;
                            })
                          );
                        }}
                      />{" "}
                    </div>
                  }
                  <div
                    className="each flex1 ms-2 ps-2"
                    style={{ marginTop: "8px" }}
                  >
                    {" "}
                    <p className="h7 w500"> Section : </p>{" "}
                    <Dropdown
                      options={allSections.map((sec) => {
                        return {
                          label: sec.name,
                          value: sec._id,
                        };
                      })}
                      onSelect={(a, b, c) => {
                        let tempSection = allSections.find((ind) => {
                          return ind._id === c;
                        });
                        setAllSubjects(
                          tempSection.subjects.map((sub) => {
                            return {
                              label: sub.subject,
                              value: sub._id,
                            };
                          })
                        );

                        if (examInfo) {
                          setCurrentSubject(
                            examInfo.find(
                              (sec) => sec.section === tempSection._id
                            ).exam.term[currentTerm - 1].subjects[0]
                          );
                        }

                        setCurrentSection(tempSection);
                      }}
                      title={currentSection && currentSection.name}
                    />
                  </div>

                  <div
                    className="each flex1 ms-2 ps-2"
                    style={{ marginTop: "8px" }}
                  >
                    {" "}
                    <p className="h7 w500"> Subject : </p>{" "}
                    <Dropdown
                      options={
                        examInfo &&
                        allSubjects &&
                        examInfo
                          .find((sec) => sec.section === currentSection._id)
                          .exam.term[currentTerm - 1].subjects.map((sub) => {
                            return {
                              value: sub._id,
                              label: allSubjects.find(
                                (sub2) => sub2.value === sub._id
                              ).label,
                            };
                          })
                      }
                      onSelect={(a, b, c) => {
                        setCurrentSubject(
                          examInfo
                            .find((sec) => sec.section === currentSection._id)
                            .exam.term[currentTerm - 1].subjects.find(
                              (sub) => sub._id === c
                            )
                        );
                      }}
                      title={
                        currentSubject &&
                        currentSection.subjects.find(
                          (sub) => sub._id === currentSubject._id
                        ).subject
                      }
                    />
                  </div>
                </div>
              </div>
              <hr />

              {currentSubject && currentSubject.students && (
                <div className="create-result-main-parent">
                  <div
                    className="create-result-parent27327 custom-scrollbar"
                    style={{ overflow: "auto", paddingBottom: "4px" }}
                  >
                    <div className="create-result327 flex1">
                      <div className="vertical">
                        <div className="each top"> Roll No </div>
                        {currentSubject.students.map((obj, index) => (
                          <div key={index} className="each">
                            {index + 1}
                          </div>
                        ))}
                      </div>

                      <div className="vertical">
                        <div className="each top"> Student Name </div>
                        {currentSubject.students.map((obj, index) => (
                          <div key={index} className="each">
                            {
                              students.find((std) => {
                                return std._id === obj.student;
                              }).name
                            }
                          </div>
                        ))}
                      </div>

                      {/* obtainedMarks 1 */}

                      <div className="vertical">
                        <div className="each top"> Written Marks </div>
                        {currentSubject.students.map((obj, index) => (
                          <div key={index} className="each">
                            <input
                              type="text"
                              name={`marks-${index}`}
                              id={`marks-${index}`}
                              value={obj.obtainedMarks || ""}
                              onChange={(event) => {
                                const newObtainedMarks = event.target.value;

                                // Use a regular expression to check if the value is numeric
                                const numericValue =
                                  newObtainedMarks === ""
                                    ? ""
                                    : newObtainedMarks.replace(/\D/g, "");

                                // If the value contains non-numeric characters, do nothing
                                if (
                                  newObtainedMarks !== "" &&
                                  numericValue === ""
                                ) {
                                  return;
                                }

                                setCurrentSubject((prevData) => {
                                  const updatedStudents = [
                                    ...prevData.students,
                                  ];
                                  updatedStudents[index] = {
                                    ...updatedStudents[index],
                                    obtainedMarks:
                                      numericValue === ""
                                        ? null
                                        : parseInt(numericValue, 10),
                                  };
                                  return {
                                    ...prevData,
                                    students: updatedStudents,
                                  };
                                });
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  if (
                                    document.getElementById(
                                      `marks-${index + 1}`
                                    )
                                  ) {
                                    document
                                      .getElementById(`marks-${index + 1}`)
                                      .focus();
                                  }
                                }
                              }}
                            />
                          </div>
                        ))}
                      </div>

                      {/* obtainedMarks 1 */}

                      <div className="vertical">
                        <div className="each top"> Practical Marks </div>
                        {currentSubject.students.map((obj, index) => (
                          <div key={index} className="each">
                            <input
                              type="text"
                              name={`marks-${index}`}
                              id={`marks-${index}`}
                              value={obj.obtainedMarks2 || ""}
                              onChange={(event) => {
                                const newObtainedMarks = event.target.value;

                                // Use a regular expression to check if the value is numeric
                                const numericValue =
                                  newObtainedMarks === ""
                                    ? ""
                                    : newObtainedMarks.replace(/\D/g, "");

                                // If the value contains non-numeric characters, do nothing
                                if (
                                  newObtainedMarks !== "" &&
                                  numericValue === ""
                                ) {
                                  return;
                                }

                                setCurrentSubject((prevData) => {
                                  const updatedStudents = [
                                    ...prevData.students,
                                  ];
                                  updatedStudents[index] = {
                                    ...updatedStudents[index],
                                    obtainedMarks2:
                                      numericValue === ""
                                        ? null
                                        : parseInt(numericValue, 10),
                                  };
                                  return {
                                    ...prevData,
                                    students: updatedStudents,
                                  };
                                });
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  if (
                                    document.getElementById(
                                      `marks-${index + 1}`
                                    )
                                  ) {
                                    document
                                      .getElementById(`marks-${index + 1}`)
                                      .focus();
                                  }
                                }
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="inputsBelow">
                    <div className="each">
                      <div className="inside">
                        <p className="h6 pb-2"> Full Marks </p>
                        <input
                          type="text"
                          name=""
                          id=""
                          value={currentSubject.fullMarks}
                          onChange={(e) => {
                            const value = e.target.value;
                            const numericValue =
                              value === "" ? null : parseInt(value, 10);

                            if (isNaN(numericValue)) {
                              return;
                            }

                            setCurrentSubject({
                              ...currentSubject,
                              fullMarks: numericValue,
                            });
                          }}
                        />
                      </div>
                    </div>
                    <div className="each">
                      <div className="inside">
                        <p className="h6 pb-2"> Pass Marks </p>
                        <input
                          type="text"
                          name=""
                          id=""
                          value={currentSubject.passMarks}
                          onChange={(e) => {
                            const value = e.target.value;
                            const numericValue =
                              value === "" ? null : parseInt(value, 10);

                            if (isNaN(numericValue)) {
                              // Handle non-numeric input, e.g., show an error message or reset to a default value
                              return;
                            }

                            setCurrentSubject({
                              ...currentSubject,
                              passMarks: numericValue,
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <hr />

                  <div className="button flex1 my-3">
                    <button
                      className="btn btn-primary"
                      style={{ width: "100%" }}
                      onClick={() => {
                        setExamInfo2((prevArray) => {
                          const index = prevArray.findIndex(
                            (item) => item._id === examInfo._id
                          );

                          if (index !== -1) {
                            // Replace the existing item with the new examInfo
                            return prevArray.map((item, i) =>
                              i === index ? examInfo : item
                            );
                          } else {
                            // Add the new examInfo to the array
                            return [...prevArray, examInfo];
                          }
                        });
                        setOurAlert(true);
                      }}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              )}


              
            </div>

            {examInfo &&
              examInfo.find((sec) => sec.section === currentSection._id)
                ?.exam && (
                <div
                  className="each second flex1"
                  style={{ flexDirection: "column", margin: "0px" }}
                >
                  <div className="exNo">
                    <p className="h6 w600 mb-3">
                      Exams Conducted:{" "}
                      {
                        examInfo.find(
                          (sec) => sec.section === currentSection._id
                        ).exam.term.length
                      }
                    </p>
                  </div>

                  {examInfo
                    .find((sec) => sec.section === currentSection._id)
                    .exam.term.map((term, index) => {
                      return (
                        <div
                          key={index}
                          className={`exNo ${
                            currentTerm - 1 === index ? "activeHere" : ""
                          }`}
                          onClick={() => setCurrentTerm(index + 1)}
                        >
                          <p className="h7 w600">Term: {index + 1}</p>
                          <p className="h7 w400">Status: {term.status}</p>
                          <hr style={{ height: "2px" }} />
                        </div>
                      );
                    })}
                </div>
              )}
          </div>
        </div>
      </div>

      {allClasses && (
        <AllClasses
          title={allClasses.title}
          btnText={allClasses.btnText}
          handleGetSelectedOnes={allClasses.handleGetSelectedOnes}
          closeFunction={() => setAllClasses(false)}
        />
      )}

      {ourAlert && (
        <div className="finalAlert flex1">
          <div className="finalInside custom-scrollbar">
            <div className="inxsds">
              <p className="h5 w600 text-danger text-center">
                {" "}
                Confirm Changes{" "}
              </p>
              <hr />
              <p className="h6 text-secondary text-center px-3">
                {" "}
                Are you sure you want to save the current update to exam data ?
              </p>

              <hr />

              {examInfo2.length > 0 && (
                <div className="absentStudents">
                  <DataTable
                    data={examInfo2
                      .find((crc) => crc._id === examInfo._id)
                      .course.term[currentTerm - 1].section.find(
                        (sec) => sec._id === currentSection._id
                      )
                      .subjects.find((sub) => sub._id === currentSubject._id)
                      .students.map((std, index) => {
                        return {
                          roll: index + 1,
                          name: students.find((dat) => dat._id === std._id)
                            .name,
                          marks: std.obtainedMarks,
                          marks2: std.obtainedMarks2,
                        };
                      })}
                    fields={[
                      "Roll",
                      "Student Name",
                      "Obtained Marks",
                      "Obtained Marks 2",
                    ]}
                    exclude={[]}
                  />
                </div>
              )}

              <hr style={{ marginBottom: "0" }} />

              <div className="inputsBelow" style={{ paddingTop: "o" }}>
                <div className="each">
                  <div className="inside">
                    <p className="h6 pb-2"> Full Marks </p>
                    <input
                      type="text"
                      name=""
                      id=""
                      value={currentSubject.fullMarks}
                      onChange={(e) => {
                        const value = e.target.value;
                        const numericValue =
                          value === "" ? null : parseInt(value, 10);

                        if (isNaN(numericValue)) {
                          return;
                        }

                        setCurrentSubject({
                          ...currentSubject,
                          fullMarks: numericValue,
                        });
                      }}
                    />
                  </div>
                </div>
                <div className="each">
                  <div className="inside">
                    <p className="h6 pb-2"> Pass Marks </p>
                    <input
                      type="text"
                      name=""
                      id=""
                      value={currentSubject.passMarks}
                      onChange={(e) => {
                        const value = e.target.value;
                        const numericValue =
                          value === "" ? null : parseInt(value, 10);

                        if (isNaN(numericValue)) {
                          // Handle non-numeric input, e.g., show an error message or reset to a default value
                          return;
                        }

                        setCurrentSubject({
                          ...currentSubject,
                          passMarks: numericValue,
                        });
                      }}
                    />
                  </div>
                </div>
              </div>

              <hr />

              <div className="buttons flex4">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setOurAlert(false);
                  }}
                >
                  {" "}
                  Cancel{" "}
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    updateExamInfo();
                    setLoading(true);
                  }}
                >
                  Submit{" "}
                </button>
              </div>
            </div>

            {loading && (
              <div
                className="spinner-container flex1"
                style={{
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: "0px",
                  left: "0px",
                  backgroundColor: "#fff",
                }}
              >
                <div
                  className="spinner-border text-primary my-4 loading452"
                  role="status"
                >
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamControls;
