import React, { useEffect, useState } from "react";
import "./exams.scss";
import { useDispatch, useSelector } from "react-redux";
import MetaData from "../layout/MetaData";
import axios from "axios";
import { SET_ALERT_GLOBAL } from "../../redux/AlertGlobalSlice";
import Dropdown from "../basicComponents/Dropdown";
import AllClasses from "./admin/AllClasses";
import GeneratePDF from "../layout/GeneratePDF";
import ExamMarks from "./ExamMarks";

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

      {!newMarks && true && (
        <div className="inside-content">
          <div className="flex flex-col p-4 bg-white shadow1 rounded-lg">
            <p className="text-xl font-semibold text-[#133189]">Exams</p>
            <p className="text-sm text-gray-600">{school.name}</p>
          </div>

          {/* Main Actions */}
          <div className="my-7">
            {user &&
              ["Administrator", "Coordinator", "Moderator"].includes(
                user.role
              ) && (
                <>
                  <div className="flex1 justify-end min-w-[100%]">
                    <button
                      onClick={() =>
                        setAllClasses({
                          title: "Add New Exam",
                          btnText: "Add New Exam",
                          handleGetSelectedOnes: addNewExam,
                        })
                      }
                      className="w-[50%] md:w-[240px] bg-white text-gray-600 hover:bg-gray-200 rounded-lg py-2 px-3 shadow1 transition-all duration-200 flex items-center justify-center space-x-2 mx-2"
                    >
                      <i className="fas fa-plus-circle"></i>
                      <span className="font-medium">Create New Exam</span>
                    </button>
                    <button
                      onClick={() =>
                        setAllClasses({
                          title: "Publish Result",
                          btnText: "Publish Result",
                          handleGetSelectedOnes: publishResult,
                        })
                      }
                      className="w-[50%] md:w-[240px] bg-white text-gray-600 hover:bg-gray-200 rounded-lg py-2 px-3 shadow1 transition-all duration-200 flex items-center justify-center space-x-2 mx-2"
                    >
                      <i className="fas fa-share-square"></i>
                      <span className="font-medium">Publish Results</span>
                    </button>
                  </div>
                </>
              )}
          </div>

          {/* Filters Section */}
          <div className="bg-white rounded-xl shadow1 p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Academic Session
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onChange={(e) => {
                    const selectedYear =
                      e.target.value === "current" ? null : e.target.value;

                    setSession(selectedYear);

                    axios
                      .get(
                        `${process.env.REACT_APP_API_URL}/staff/${schoolCode}/students`,
                        {
                          params: { year: selectedYear },
                          withCredentials: true,
                        }
                      )
                      .then((response) => {
                        if (response.data.success) {
                          setStudents(response.data.data);
                          if (response.data.courses) {
                            const coursesNew = response.data.courses.map(
                              (crc) => courses.find((crc2) => crc2._id === crc)
                            );
                            setCourses(coursesNew);
                          }
                        }
                      })
                      .catch((error) => {
                        // Handle error
                      });
                  }}
                >
                  <option value="current">Current</option>
                  {school.olderData?.map((each) => (
                    <option key={each.year} value={each.year}>
                      {each.year}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Class
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onChange={(e) => {
                    const selectedClass = courses.find(
                      (c) => c._id === e.target.value
                    );
                    setCurrentClass(selectedClass);
                    setExamInfo(null);
                  }}
                >
                  {courses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.class}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Term
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onChange={(e) => setCurrentTerm(parseInt(e.target.value))}
                  value={currentTerm}
                >
                  {examInfo &&
                    examInfo
                      .find((sec) => sec.section === currentSection._id)
                      ?.exam.term.map((_, index) => (
                        <option key={index} value={index + 1}>
                          Term {index + 1}
                        </option>
                      ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Section
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onChange={(e) => {
                    const selectedSection = allSections.find(
                      (s) => s._id === e.target.value
                    );
                    setCurrentSection(selectedSection);
                    const subjectsList = findSectionById(
                      courses,
                      e.target.value
                    ).subjects;
                    setCurrentSubject(subjectsList[0]);
                    setAllSubjects(subjectsList);
                  }}
                >
                  {examInfo &&
                    examInfo.map((each) => (
                      <option key={each.section} value={each.section}>
                        {allSections.find((s) => s._id === each.section)?.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="hidden md:flex flex-wrap gap-4 my-7 bg-gray-100 p-4 rounded-lg justify-end">
            {printData && <GeneratePDF data={printData} />}

            <button className="bg-gray-500 text-white flex items-center space-x-2 py-2 border border-gray-500 rounded-lg hover:bg-gray-600 transition-colors duration-200 px-[60px]">
              <i className="fas fa-file-excel text-gray-600"></i>
              <span>Export Excel</span>
            </button>
            <button
              className="bg-gray-500 text-white flex items-center space-x-2 py-2 border border-gray-500 rounded-lg hover:bg-gray-600 transition-colors duration-200 px-[60px]"
              onClick={() => {
                const subject = examInfo
                  ?.find((sec) => sec.section === currentSection._id)
                  ?.exam.term[currentTerm - 1]?.subjects.find(
                    (sub) => sub._id === currentSubject._id
                  );
                setNewMarks(subject);
              }}
            >
              <i className="fas fa-edit text-gray-600"></i>
              <span>Edit Marks</span>
            </button>
          </div>

          {currentSubject && (
            <div className="each flex1 justify-end mb-3 pt-2 flex-wrap-reverse flex-grow-1 mt-3">
              <div className="">
                {/* <p className="text-md mb-0 w500"> Subject :</p> */}
                <Dropdown
                  title={` ${currentSubject.subject || "Select One"}`}
                  options={allSubjects.map((each) => {
                    return {
                      label: each.subject,
                      value: each._id,
                    };
                  })}
                  onSelect={(a, b, c) => {
                    setCurrentSubject(allSubjects.find((sub) => sub._id === c));
                  }}
                />
              </div>

              {examInfo &&
              examInfo.find((sec) => sec.section == currentSection._id)?.exam
                ?.term?.[currentTerm - 1]?.publishedDate ? (
                <div className="bg-green-200 py-2 px-4 mr-3 rounded-sm">
                  <p className="text-sm text-gray-600 w500 mb-0"> Published </p>
                </div>
              ) : (
                <div className="bg-red-200 py-2 px-4 mr-3 rounded-sm">
                  <p className="text-sm text-gray-600 w500 mb-0">
                    {" "}
                    Not Published{" "}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Results Table */}
          <div className="bg-white shadow1 p-6 max-w[100%] overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center h-48">
                <div className="spinner-border text-primary" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            ) : examInfo && currentSection && students ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Roll
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student Name
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                      Written Marks
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                      Practical Marks
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {examInfo
                    .find((sec) => sec.section === currentSection._id)
                    ?.exam.term[currentTerm - 1]?.subjects.find(
                      (sub) => sub._id === currentSubject._id
                    )
                    ?.students.map((std, index) => {
                      const student = students.find(
                        (stu) => stu._id === std.student
                      );
                      return student ? (
                        <tr key={student._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {student.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                            {std.obtainedMarks}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                            {std.obtainedMarks2}
                          </td>
                        </tr>
                      ) : null;
                    })}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[200px] text-gray-500 space-y-4">
                <i className="fas fa-search text-gray-300 text-4xl"></i>
                <p>No exam data found for the selected filters</p>
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

      {newMarks && false && (
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

      {newMarks && (
        <ExamMarks
          students={students}
          newMarks={newMarks}
          setNewMarks={setNewMarks}
          updateExamInfo={updateExamInfo}
        />
      )}
    </div>
  );
};

export default Exams;
