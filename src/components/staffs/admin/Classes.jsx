import React, { useEffect, useState } from "react";
import "./classes.scss";
import CreateCourses from "../../registerSchool/CreateCourses";
import DataTable from "../../layout/Table";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Dropdown from "../../basicComponents/Dropdown";
import { useDispatch, useSelector } from "react-redux";
import SessionTree from "../../registerSchool/SessionTree";
import AllClasses from "./AllClasses";
import axios from "axios";
import { SET_ALERT_GLOBAL } from "../../../redux/AlertGlobalSlice";
import EditSubjectTeacher from "../../registerSchool/EditSubjectTeacher";

const Classes = () => {
  const courses = useSelector((state) => state.Course.course.payload.course);
  const [newClass, setNewClass] = useState(false);
  const [sessionTree, setSessionTree] = useState(false);
  const students = useSelector((state) => state.Students.students.payload);
  const dispatch = useDispatch();

  async function handleDropdownChange(a) {
    setCurrentSection(allSections[a]);
  }

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
  }, [currentClass]);

  useEffect(() => {
    setCurrentSection(allSections[0]);
  }, [allSections]);

  const school = useSelector((state) => state.Home.school.payload);

  const [allClasses, setAllClasses] = useState(false);
  const [loading, setLoading] = useState(false);

  function startNewSession(a) {
    setLoading(true);
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/admin/${school.schoolCode}/sessions/new`,
        {
          params: {
            classesList: JSON.stringify(a),
          },
          withCredentials: true,
        }
      )
      .then((response) => {
        setLoading(false);
        if (response.data.success) {
          dispatch(SET_ALERT_GLOBAL(response.data));
        } else {
          dispatch(SET_ALERT_GLOBAL(response.data));
        }
      })
      .catch((error) => {
        setLoading(false);
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

  const [editSubjectTeachers, setEditSubjectTeachers] = useState(false);

  if (newClass || sessionTree || allClasses || editSubjectTeachers || loading) {
    document.body.classList.add("dshauda-hidden321");
  } else if (
    !newClass &&
    !sessionTree &&
    !allClasses &&
    !editSubjectTeachers &&
    !loading
  ) {
    document.body.classList.remove("dshauda-hidden321");
  }


  // Add this useEffect to update currentClass when courses changes
useEffect(() => {
  if (courses.length > 0) {
    // Find the current course ID in the updated courses array
    if (currentClass) {
      const updatedCourse = courses.find(course => course._id === currentClass._id);
      if (updatedCourse) {
        setCurrentClass(updatedCourse);
      } else {
        // If current course no longer exists, default to first course
        setCurrentClass(courses[0]);
      }
    } else {
      setCurrentClass(courses[0]);
    }
  }
}, [courses]);

// Update allSections useEffect to properly depend on currentClass
useEffect(() => {
  if (currentClass) {
    const sectionIds = getAllSectionIds();
    setAllSections(sectionIds);
  }
}, [currentClass]);

  return (
    <>
      {loading && (
        <div
          className="cover-all flex1 bg-white"
          style={{
            width: "100vw",
            height: "100vh",
            position: "fixed",
            top: "0",
            left: "0",
            zIndex: "99999",
          }}
        >
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
        </div>
      )}

      {newClass && (
        <CreateCourses closeFunction={() => setNewClass(!newClass)} />
      )}
      {sessionTree && (
        <SessionTree closeFunction={() => setSessionTree(false)} />
      )}
      {allClasses && (
        <AllClasses
          title={allClasses.title}
          btnText={allClasses.btnText}
          handleGetSelectedOnes={allClasses.handleGetSelectedOnes}
          closeFunction={() => setAllClasses(false)}
          courseData={school.course}
        />
      )}
      {editSubjectTeachers && (
        <EditSubjectTeacher
          data={currentSection}
          closeFunction={() => setEditSubjectTeachers(false)}
        />
      )}
      <div className="classes-admin-tool">
        <div className="first-top">
          <p className="h4 w600 mb-3 pb-2"> All Classes</p>
          <div className="buttons">
            <button onClick={() => setSessionTree(true)} className="me-3">
              {" "}
              Session Table{" "}
            </button>
            <button className="mx-3" onClick={() => setNewClass(true)}>Add New Class</button>
            <button
              onClick={() =>
                setAllClasses({
                  title: "Start New Session",
                  btnText: "Start New Session",
                  handleGetSelectedOnes: startNewSession,
                })
              }
              className="ms-3"
            >
              Start New Session
            </button>
          </div>
        </div>

        {courses.length > 0 && (
          <div className="flex justify-center flex-wrap gap-3 py-4 shadow1 mt-8 rounded-md mb-2">
            {courses.map((course) => (
              <button
                key={course._id}
                onClick={() => setCurrentClass(course)}
                className={`
      h-20 w-28 rounded border transition-all
      ${
        currentClass._id === course._id
          ? "border-blue-500 bg-blue-100 text-blue-700"
          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
      }
    `}
              >
                <span className="text-sm">{course.class}</span>
              </button>
            ))}
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

        {currentClass && (
          <section className="class-info">
            <p className="h5 w600 mb-3 pt-2 ms-1"> Class Info </p>

            <div className="info-container flex2">
              <div className="left-info">
                <div className="m-left232">
                  <div className="stylish">
                    <p className="h6 w500"> Class : {currentClass.class} </p>
                  </div>
                  <p className="h6 w600 my-3">
                    {" "}
                    Rs.{" "}
                    {currentClass.fees.reduce(
                      (sum, fee) => sum + fee.amount,
                      0
                    )}{" "}
                    /year{" "}
                  </p>

                  <p
                    className="h6 w600 text-center py-2"
                    style={{ backgroundColor: "#DEE0E7", borderRadius: "3px" }}
                  >
                    {" "}
                    Fee Structure{" "}
                  </p>

                  <div className="table-my my-2 max-w-[94vw] overflow-auto">
                    <DataTable
                      data={currentClass.fees.map((fee) => {
                        return {
                          title: fee.title,
                          amount: fee.amount,
                        };
                      })}
                      fields={["Title", "Amount Rs."]}
                    />
                  </div>
                </div>

                <div className="left-student max-w-[94vw] overflow-auto">
                  <p
                    className="h6 w600 text-center py-2"
                    style={{ backgroundColor: "#DEE0E7", borderRadius: "3px" }}
                  >
                    Students
                  </p>

                  {students && (
                    <div className="table-my my-2">
                      <DataTable
                        data={students
                          .filter(
                            (student) =>
                              student.course.class === currentClass._id &&
                              student.course.section === currentSection._id
                          )
                          .map((student, index) => ({
                            sn: index + 1,
                            name: student.name,
                          }))}
                        fields={["SN", "Student Name"]}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="right-info">
                {/* <button className="btn btn-secondary"> Edit Class </button> */}

                <div className="inside-right" style={{ marginTop: "50px" }}>
                  <p className="h6 w600">
                    {" "}
                    <FontAwesomeIcon
                      style={{ marginRight: "5px", color: "#107A34" }}
                      icon={faCircleCheck}
                    />{" "}
                    General Information{" "}
                  </p>

                  <div className="inputForms2829">
                    <div className="form-content6">
                      <div className="each width2">
                        <p> Class </p>
                        <p className="likeInput"> {currentClass.class} </p>
                      </div>

                      <div className="each width2">
                        <p> Section </p>
                        <div className="wobbler" style={{ padding: "0px 3px" }}>
                          <Dropdown
                            options={allSections.map((sec) => {
                              return {
                                label: sec.name,
                              };
                            })}
                            title={currentSection.name}
                            onSelect={handleDropdownChange}
                          />
                        </div>
                      </div>

                      <div className="each width2">
                        <p> Total Seats </p>
                        <p className="likeInput">
                          {" "}
                          {currentClass.seatsAvailable}{" "}
                        </p>
                      </div>

                      <div className="each width2">
                        <p> Occupied </p>
                        <p className="likeInput"> {"Specify Later"} </p>
                      </div>

                      <div className="each width4">
                        <p> Left </p>
                        <p className="likeInput">{" Specity Later "}</p>
                      </div>
                    </div>
                  </div>

                  <p
                    className="h6 w600 text-center py-2"
                    style={{ backgroundColor: "#DEE0E7", borderRadius: "3px" }}
                  >
                    Subjects
                  </p>

                  <div className="table-my my-2 max-w-[94vw] overflow-auto">
                    <DataTable
                      data={currentSection.subjects.map((sub) => {
                        return {
                          subject: sub.subject,
                          teacher: sub.teacher ? sub.teacher.name : "N/A",
                        };
                      })}
                      fields={["Subject", "Teacher"]}
                    />
                  </div>

                  <button
                    className="btn btn-secondary my-3 button-edit-teacher"
                    onClick={() => setEditSubjectTeachers(true)}
                  >
                    {" "}
                    Edit Subject Teachers
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default Classes;
