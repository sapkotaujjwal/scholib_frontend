import React, { useEffect, useState } from "react";
import "./exams.scss";
import { useDispatch, useSelector } from "react-redux";
import MetaData from "../layout/MetaData";
import axios from "axios";
import { SET_ALERT_GLOBAL } from "../../redux/AlertGlobalSlice";
import Dropdown from "../basicComponents/Dropdown";
import DataTable from "../layout/Table";
import AllClasses from "./admin/AllClasses";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import GeneratePDF from "../layout/GeneratePDF";

const Exams = () => {
  const school = useSelector((state) => state.Home.school.payload);
  const user = useSelector((state) => state.User.user.payload);
  // const students = useSelector((state) => state.Students.students.payload);

  const studentsInfo = useSelector((state) => state.Students.students.payload);

  const [students, setStudents] = useState(studentsInfo);

  const schoolCode = school.schoolCode;

  const dispatch = useDispatch();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const coursesCurrent = useSelector(
    (state) => state.Course.course.payload.course
  );
  const course1 = useSelector((state) => state.Course.courseAll.payload.course);

  const [courses, setCourses] = useState(coursesCurrent);

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
    let tempAllSections = getAllSectionIds();
    setCurrentSection(tempAllSections[0]);
    setAllSections(tempAllSections);
  }, [currentClass]);

  useEffect(() => {
    getExamInfo();
  }, [allSections]);

  const [examInfo, setExamInfo] = useState(null);
  const [currentTerm, setCurrentTerm] = useState(null);
  const [currentSubject, setCurrentSubject] = useState(null);

  const [allSubjects, setAllSubjects] = useState(null);

  function getExamInfo() {
    if (!currentClass) {
      return;
    }

    setLoading(true);

    setExamInfo(null);
    axios
      .get(`${process.env.REACT_APP_API_URL}/admin/${schoolCode}/exam/info`, {
        params: {
          year: 2081,
          classId: currentClass._id,
          sectionIds: allSections.map((sec) => sec._id),
        },
        withCredentials: true,
      })
      .then((response) => {
        setLoading(false);
        if (response.data.success) {
          setCurrentTerm(() => {
            const section = response.data.data.find(
              (sec) => sec.section === currentSection._id
            );
            return section?.exam ? section.exam.term.length : 0;
          });

          let subjectsList = findSectionById(
            courses,
            currentSection._id
          ).subjects;

          setCurrentSubject(subjectsList[0]);
          setAllSubjects(subjectsList);
          setExamInfo(response.data.data);
        } else {
          // dispatch(SET_ALERT_GLOBAL(response.data));
        }
      })
      .catch((error) => {
        setLoading(false);
        const data = {
          message: error.message,
          status: "Cannot communicate with the server",
        };

        if (error.response) {
          // dispatch(SET_ALERT_GLOBAL(error.response.data));
          return;
        }
        dispatch(SET_ALERT_GLOBAL(data));
      });
  }

  const [loading, setLoading] = useState(false);

  const findSectionById = (courses, sectionId) => {
    let foundSection = null;

    courses.forEach((course) => {
      course.groups.forEach((group) => {
        // Find the section with the matching _id in the current group's sections
        const section = group.sections.find((sec) => sec._id === sectionId);

        // If section is found, assign it to foundSection and break out of loops
        if (section) {
          foundSection = section;
          return; // break out of forEach for groups
        }
      });

      // If section is already found, break out of forEach for courses
      if (foundSection) {
        return; // break out of forEach for courses
      }
    });

    return foundSection;
  };

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
          getExamInfo();
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
    function getAllSections(data) {
      let sectionIds = [];

      data.forEach((course) => {
        if (a.includes(course._id)) {
          course.groups.forEach((group) => {
            group.sections.forEach((section) => {
              sectionIds.push(section);
            });
          });
        }
      });

      return sectionIds;
    }

    const sectionsAll = getAllSections(courses).map((eac) => eac.exam);

    axios
      .get(
        `${process.env.REACT_APP_API_URL}/admin/${schoolCode}/result/publish`,
        {
          params: {
            examsList: JSON.stringify(sectionsAll),
          },
          withCredentials: true,
        }
      )
      .then((response) => {
        if (response.data.success) {
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

  function updateExamInfo() {
    let reObj = {
      data: newMarks,
      term: currentTerm - 1,
      section: currentSection._id,
    };

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

        if (response.data.success) {
          dispatch(SET_ALERT_GLOBAL(response.data));
          setNewMarks(false);
          getExamInfo();
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
          dispatch(SET_ALERT_GLOBAL(error.response.data));
          return;
        }
        setLoading(false);
        dispatch(SET_ALERT_GLOBAL(data));
      });
  }

  const [allClasses, setAllClasses] = useState(false);

  if (allClasses) {
    document.body.classList.add("dshauda-hidden");
  } else if (!allClasses) {
    document.body.classList.remove("dshauda-hidden");
  }

  const [newMarks, setNewMarks] = useState(false);

  function handlePrintData() {
    const studentsOfSection = students
      .filter(
        (student) =>
          student.course.class === currentClass._id &&
          student.course.section === currentSection._id
      )
      .map((student) => ({
        studentInfo: {
          _id: student._id,
          name: student.name,
          id: student.loginId,
          class: currentClass.class,
          section: currentSection.name,
        },

        schoolInfo: {
          name: school.name,
          address: school.address,
        },

        examInfo: {
          term: currentTerm,
        },

        subjects: [],
      }));

    let subjects = examInfo.find((sec) => sec.section == currentSection._id)
      .exam.term[currentTerm - 1].subjects;

    subjects.forEach((subject) => {
      let obj = {
        name: subject.subject,
        theory: subject.fullMarks,
        practical: subject.fullMarks2,
      };

      subject.students.forEach((std) => {
        studentsOfSection.find((student, index) => {
          if (student.studentInfo._id === std.student) {
            studentsOfSection[index].subjects.push({
              ...obj,
              obtainedMarks: std.obtainedMarks,
              obtainedMarks2: std.obtainedMarks2,
            });
          }
        });
      });
    });

    return studentsOfSection;
  }

  const [printData, setPrintData] = useState(null);

  useEffect(() => {
    if (
      currentTerm &&
      currentSection &&
      currentClass &&
      examInfo &&
      studentsInfo
    ) {
      setPrintData(handlePrintData());
    }
  }, [currentTerm, currentSection, currentClass, examInfo, studentsInfo]);

  const [session, setSession] = useState(null);

  useEffect(() => {
    if (!session) {
      setCourses(coursesCurrent);
    }
  }, [session]);

  return (
    <div className="examsAdmin2838">
      <MetaData title={`${user && user.role ? "Staff" : "Student"} || Exams`} />
      {!newMarks && (
        <div className="inside-content">
          <div className="veryTop">
            <p className="h4 text-center" style={{ color: "#133189" }}>
              Exams
            </p>
            <p className="h6 text-center"> {school.name} </p>
          </div>

          {user &&
            (user.role === "Administrator" ||
              user.role === "Coordinator" ||
              user.role === "Moderator") && (
              <div
                className="outer-buttons flex1"
                style={{ justifyContent: "flex-end" }}
              >
                <div
                  className="examControls flex1"
                  style={{ justifyContent: "flex-end" }}
                >
                  <button
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
                </div>

                <div
                  className="examControls flex1 btn-end"
                  style={{ justifyContent: "flex-end", marginRight: "0" }}
                >
                  <button
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
              </div>
            )}

          <div className="classInfo">
            <p className="h5 w600 ms-2"> All Classes </p>

            <div className="year-dropdown flex1">
              <p className="h6 me-2" style={{ marginBottom: "0" }}>
                {" "}
                Session :
              </p>
              <Dropdown
                title={"Current"}
                options={[
                  { label: "Current", value: null },
                  ...school.olderData?.map((each) => {
                    return {
                      label: each.year,
                      value: each.year,
                    };
                  }),
                ]}
                onSelect={(a, b, c) => {
                  setSession(c);

                  axios
                    .get(
                      `${process.env.REACT_APP_API_URL}/staff/${schoolCode}/students`,
                      {
                        params: {
                          year: c,
                        },
                        withCredentials: true,
                      }
                    )
                    .then((response) => {
                      if (response.data.success) {
                        setStudents(response.data.data);

                        if (response.data.courses) {
                          let coursesNew = response.data.courses.map((crc) =>
                            course1.find((crc2) => crc2._id === crc)
                          );
                          setCourses(coursesNew);
                        }
                      } else {
                        dispatch(SET_ALERT_GLOBAL(response.data.data));
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
                }}
              />
            </div>

            {courses.length > 0 && (
              <div className="classes-list flex1">
                {courses.map((arr) => {
                  return (
                    <div
                      className={`each flex1 ${
                        currentClass._id === arr._id ? "active" : ""
                      }`}
                      key={arr._id}
                      onClick={() => {
                        setExamInfo(null);
                        setCurrentClass(arr);
                      }}
                    >
                      <p className="h6 w600"> {arr.class} </p>
                    </div>
                  );
                })}
              </div>
            )}

            {courses.length === 0 && (
              <>
                <hr />

                <p className="h6 text-center mx-2 text-secondary my-3">
                  No courses available
                </p>

                <hr />
              </>
            )}

            {examInfo && !loading && currentTerm > 0 && (
              <>
                <div className="ourOptions flex1">
                  {/* <div className="each flex1"> Year : <Dropdown /> </div> */}

                  <div className="each ">
                    <Dropdown
                      title={`Term : ${currentTerm}`}
                      options={examInfo
                        .find((sec) => sec.section === currentSection._id)
                        .exam.term.map((each, index) => {
                          return {
                            label: `${index + 1} `,
                            value: each._id,
                          };
                        })}
                      onSelect={(a) => {
                        setCurrentTerm(a + 1);
                      }}
                    />
                  </div>

                  <div className="each ">
                    <Dropdown
                      title={`Section : ${currentSection.name}`}
                      options={examInfo
                        .map((each) => {
                          return {
                            label: allSections.find(
                              (ind) => ind._id === each.section
                            ).name,
                            value: each.section,
                          };
                        })
                        .sort((a, b) =>
                          a.label
                            .toLowerCase()
                            .localeCompare(b.label.toLowerCase())
                        )}
                      onSelect={(a, b, c) => {
                        setCurrentSection(
                          allSections.find((sec) => sec._id === c)
                        );

                        let subjectsList = findSectionById(courses, c).subjects;

                        setCurrentSubject(subjectsList[0]);
                        setAllSubjects(subjectsList);
                      }}
                    />{" "}
                  </div>

                  <div className="each ">
                    <Dropdown
                      title={`Subject : ${
                        currentSubject.subject || "Select One"
                      }`}
                      options={allSubjects.map((each, index) => {
                        return {
                          label: each.subject,
                          value: each._id,
                        };
                      })}
                      onSelect={(a, b, c) => {
                        setCurrentSubject(
                          allSubjects.find((sub) => sub._id === c)
                        );
                      }}
                    />
                  </div>
                </div>

                <hr />

                <div className="button flex3 my-3 flex-wrap">
                  {/* <button className="button-Simple" onClick={handlePrintData}>
                    <FontAwesomeIcon icon={faPrint} /> Print to PDF
                  </button> */}

                  {printData && <GeneratePDF data={printData} />}

                  <button className="button-Simple">
                    <FontAwesomeIcon icon={faFileExcel} /> Export to Excel
                  </button>

                  <button
                    className="button-Simple"
                    onClick={() => {
                      let subject = examInfo
                        .find((sec) => sec.section === currentSection._id)
                        .exam.term[currentTerm - 1].subjects.find(
                          (sub) => sub._id === currentSubject._id
                        );

                      setNewMarks(subject);
                    }}
                  >
                    {" "}
                    <FontAwesomeIcon icon={faPenToSquare} /> Edit Marks{" "}
                  </button>
                </div>

                {examInfo && currentSection && students && (
                  <div
                    className="absentStudents my-3 custom-scrollbar shadow1"
                    style={{ overflowX: "auto" }}
                  >
                    <DataTable
                      data={examInfo
                        .find((sec) => sec.section === currentSection._id)
                        .exam.term[currentTerm - 1].subjects.find(
                          (sub) => sub._id === currentSubject._id
                        )
                        .students.map((std, index) => {
                          const student = students.find(
                            (stu) => stu._id === std.student
                          );
                          return {
                            Roll: index + 1,
                            name: student?.name, // Use optional chaining to safely access name
                            marks: std.obtainedMarks,
                            marks2: std.obtainedMarks2,
                          };
                        })
                        .filter((entry) => entry.name !== undefined)} // Filter out entries without a valid name
                      fields={[
                        "Roll",
                        "Student Name",
                        "Written Marks",
                        "Practical Marks",
                      ]}
                      exclude={[]}
                    />
                  </div>
                )}
              </>
            )}

            {!examInfo && !loading && (
              <>
                <hr />
                <p className="h6 w600 text-center text-secondary">
                  {" "}
                  Exam details not found{" "}
                </p>
                <hr />
              </>
            )}

            {currentTerm === 0 && (
              <>
                <hr />
                <p className="h6 w600 text-center text-secondary">
                  No Exams have been conducted
                </p>
                <hr />
              </>
            )}

            {loading && (
              <div
                className="spinner-container flex1"
                style={{ width: "100%", height: "60px" }}
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

      {allClasses && (
        <AllClasses
          title={allClasses.title}
          btnText={allClasses.btnText}
          handleGetSelectedOnes={allClasses.handleGetSelectedOnes}
          closeFunction={() => setAllClasses(false)}
        />
      )}

      {newMarks && (
        <div className="create-result-main-parent">
          <div className="anotherIn custom-scrollbar">
            {
              <>
                <p className="h5 w600 text-center"> Edit Exam Info </p>
                <hr />
                {newMarks.students.length > 0 && (
                  <div
                    className="create-result-parent27327"
                    style={{ overflow: "auto", paddingBottom: "4px" }}
                  >
                    <div className="create-result327 flex1">
                      <div className="vertical">
                        <div className="each top"> S.N </div>
                        {newMarks.students.map((obj, index) => (
                          <div key={index} className="each">
                            {index + 1}
                          </div>
                        ))}
                      </div>

                      <div className="vertical">
                        <div className="each top"> Student Name </div>
                        {newMarks.students.map((obj, index) => (
                          <div key={index} className="each">
                            {
                              students.find((std) => std._id === obj.student)
                                .name
                            }
                          </div>
                        ))}
                      </div>

                      {/* Obtained Marks 1 */}
                      <div className="vertical">
                        <div className="each top"> Written Marks </div>
                        {newMarks.students.map((obj, index) => (
                          <div key={index} className="each bg-gray-100">
                            <input
                              style={{
                                background: "transparent",
                                width: "100%",
                                height: "100%",
                              }}
                              type="text"
                              name={`marks-${index}`}
                              id={`marks-${index}`}
                              value={obj.obtainedMarks || ""}
                              onChange={(event) => {
                                const newObtainedMarks = event.target.value;
                                const numericValue =
                                  newObtainedMarks === ""
                                    ? ""
                                    : newObtainedMarks.replace(/\D/g, "");

                                if (
                                  newObtainedMarks !== "" &&
                                  numericValue === ""
                                ) {
                                  return;
                                }

                                setNewMarks((prevMarks) => {
                                  const updatedStudents = [
                                    ...prevMarks.students,
                                  ];
                                  updatedStudents[index] = {
                                    ...updatedStudents[index],
                                    obtainedMarks:
                                      numericValue === ""
                                        ? null
                                        : parseInt(numericValue, 10),
                                  };

                                  return {
                                    ...prevMarks,
                                    students: updatedStudents,
                                  };
                                });
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  const nextElement = document.getElementById(
                                    `marks-${index + 1}`
                                  );
                                  if (nextElement) {
                                    nextElement.focus();
                                  }
                                }
                              }}
                            />
                          </div>
                        ))}
                      </div>

                      {/* Obtained Marks 2 */}
                      <div className="vertical">
                        <div className="each top"> Practical Marks </div>
                        {newMarks.students.map((obj, index) => (
                          <div key={index} className="each bg-gray-100">
                            <input
                              style={{
                                background: "transparent",
                                width: "100%",
                                height: "100%",
                              }}
                              type="text"
                              name={`marks2-${index}`}
                              id={`marks2-${index}`}
                              value={obj.obtainedMarks2 || ""}
                              onChange={(event) => {
                                const newObtainedMarks2 = event.target.value;
                                const numericValue =
                                  newObtainedMarks2 === ""
                                    ? ""
                                    : newObtainedMarks2.replace(/\D/g, "");

                                if (
                                  newObtainedMarks2 !== "" &&
                                  numericValue === ""
                                ) {
                                  return;
                                }

                                setNewMarks((prevMarks) => {
                                  const updatedStudents = [
                                    ...prevMarks.students,
                                  ];
                                  updatedStudents[index] = {
                                    ...updatedStudents[index],
                                    obtainedMarks2:
                                      numericValue === ""
                                        ? null
                                        : parseInt(numericValue, 10),
                                  };

                                  return {
                                    ...prevMarks,
                                    students: updatedStudents,
                                  };
                                });
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  const nextElement = document.getElementById(
                                    `marks2-${index + 1}`
                                  );
                                  if (nextElement) {
                                    nextElement.focus();
                                  }
                                }
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {newMarks.students.length === 0 && (
                  <div className="">
                    <p className="h6 w600 text-center text-secondary">
                      {" "}
                      No Students Available{" "}
                    </p>

                    <hr />
                  </div>
                )}
                <div className="inputsBelow">
                  <div className="each">
                    <div className="inside">
                      <p className="h6 pb-1"> Written </p>
                      <input
                        type="text"
                        name=""
                        id=""
                        value={newMarks.fullMarks}
                        onChange={(e) => {
                          const value = e.target.value;
                          const numericValue =
                            value === "" ? null : parseInt(value, 10);

                          if (isNaN(numericValue)) {
                            return;
                          }

                          setNewMarks({
                            ...newMarks,
                            fullMarks: numericValue,
                          });
                        }}
                      />
                    </div>
                  </div>

                  <div className="each">
                    <div className="inside">
                      <p className="h6 pb-1"> Practical </p>
                      <input
                        type="text"
                        name=""
                        id=""
                        value={newMarks.fullMarks2}
                        onChange={(e) => {
                          const value = e.target.value;
                          const numericValue =
                            value === "" ? null : parseInt(value, 10);

                          if (isNaN(numericValue)) {
                            return;
                          }

                          setNewMarks({
                            ...newMarks,
                            fullMarks2: numericValue,
                          });
                        }}
                      />
                    </div>
                  </div>
                </div>
                <hr />
                <div className="button flex4 my-3">
                  <button
                    className="btn btn-secondary"
                    style={{ width: "48%" }}
                    onClick={() => {
                      setNewMarks(false);
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    className="btn btn-primary"
                    style={{ width: "48%" }}
                    onClick={() => {
                      updateExamInfo();
                    }}
                  >
                    Submit
                  </button>
                </div>
              </>
            }
          </div>
        </div>
      )}
    </div>
  );
};

export default Exams;
