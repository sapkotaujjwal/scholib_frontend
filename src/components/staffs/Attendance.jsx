import React, { useEffect, useState } from "react";
import "./attendance.scss";
import { useDispatch, useSelector } from "react-redux";
import MetaData from "../layout/MetaData";
import DataTable from "../layout/Table";
import { SET_ALERT_GLOBAL } from "../../redux/AlertGlobalSlice";
import axios from "axios";
import AttendanceNew from "./AttendanceNew";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";

const Attendance = () => {
  const user = useSelector((state) => state.User.user.payload);
  const school = useSelector((state) => state.Home.school.payload);
  const courses = useSelector((state) => state.Course.course.payload.course);
  const date = useSelector((state) => state.Other.date);
  const dispatch = useDispatch();

  const [students, setStudents] = useState(null);
  const [ourAlert, setOurAlert] = useState(false);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  function getStudents() {
    let groupId = null;

    currentClass &&
      currentClass.groups.forEach((grp) => {
        if (grp.sections.some((sec) => sec._id === currentSection._id)) {
          groupId = grp._id;
        }
      });

    if (!currentClass) {
      return;
    }

    setLoading(true);

    axios
      .get(
        `${process.env.REACT_APP_API_URL}/adminStudent/${school.schoolCode}/advanced/students`,
        {
          params: {
            classId: currentClass._id,
            groupId: groupId,
            sectionId: currentSection._id,
          },
          withCredentials: true,
        }
      )
      .then((response) => {
        setLoading(false);
        if (response.data.success) {
          setStudents(response.data.data);
          const matchedIds = response.data.data
            .filter((student) =>
              student.absentdays.some((absentDay) => {
                const absentDate = new Date(absentDay.date);
                const targetDate = new Date(date);
                return absentDate.toISOString() === targetDate.toISOString();
              })
            )
            .map((student) => student._id);

          setMarkedStudents(matchedIds);
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

  const [markedStudents, setMarkedStudents] = useState([]);

  function handlSelectedOnes(arr) {
    setMarkedStudents(
      arr.map((data) => {
        return data._id;
      })
    );
  }

  useEffect(() => {
    getStudents();
  }, [currentSection]);

  function addAsAbsent() {
    let groupId = null;

    currentClass.groups.forEach((grp) => {
      if (grp.sections.some((sec) => sec._id === currentSection._id)) {
        groupId = grp._id;
      }
    });

    axios
      .get(
        `${process.env.REACT_APP_API_URL}/adminStudent/${school.schoolCode}/advanced/admission/take`,
        {
          params: {
            classId: currentClass._id,
            groupId: groupId,
            sectionId: currentSection._id,
            absentStudents: JSON.stringify(markedStudents),
          },
          withCredentials: true,
        }
      )
      .then((response) => {
        setLoading(false);
        setOurAlert(false);

        if (response.data.success) {
          dispatch(SET_ALERT_GLOBAL(response.data));
          getStudents()
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

  if (ourAlert) {
    document.body.classList.add("dshauda-hidden321");
  } else if (!ourAlert) {
    document.body.classList.remove("dshauda-hidden321");
  }

  return (
    <div className="attendanceAdmin2838 applyBootstrap">
      <MetaData
        title={`${user && user.role ? "Staff" : "Student"} || Attendance`}
      />

      {ourAlert && students && (
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
                Are you sure the list of absent students are correct ?
              </p>

              <hr />

              <div className="absentStudents">
                <DataTable
                  data={students
                    .map((student, index) => {
                      if (markedStudents.includes(student._id)) {
                        return {
                          sn: index + 1,
                          name: student.name,
                          absentDays: student.absentdays
                            ? student.absentdays.length
                            : 0,
                          _id: student._id,
                        };
                      } else {
                        return null;
                      }
                    })
                    .filter((student) => student !== null)}
                  fields={["Roll", "Student Name", "Absent Days"]}
                  exclude={["_id"]}
                />
              </div>

              <div className="buttons flex4 pt-3">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setOurAlert(false);
                    // setMarkedStudents([]);
                  }}
                >
                  {" "}
                  Cancel{" "}
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    addAsAbsent();
                    setLoading(true);
                  }}
                >
                  {" "}
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

      <div className="inside-content">
        <div className="flex flex-col p-4 bg-white shadow1 rounded-lg mx-[2%]">
          <p className="text-xl font-semibold text-[#133189]">Students</p>
          <p className="text-sm text-gray-600">{school.name}</p>
        </div>
      </div>

      {courses && courses.length > 0 && (
        <div className="inside-content">
          <div className="centerOne">


            <div
              className="shadow1 py-4
            flex1 justify-end"
            >
              <div className="mt-3 flex gap-4 w-full min-w-[60%] max-w-[100%] mx-3 flex-wrap px-[2%]">
                <div className="flex-1 flex items-center" style={{flexBasis: '250px'}}>
                  <label className="font-medium mr-2 mb-0">Class :</label>
                  <div className="relative flex-1"  >
                    <select
                      className="w-full px-3 py-2 border rounded-md appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[150px]"
                      value={currentClass?._id || ""}
                      onChange={(e) => {
                        const selected = courses.find(
                          (course) => course._id === e.target.value
                        );
                        setCurrentClass(selected);
                      }}
                    >
                      {courses.map((course) => (
                        <option key={course._id} value={course._id}>
                          {course.class}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <FontAwesomeIcon icon={faCaretDown} className="mx-1" />
                    </div>
                  </div>
                </div>

                <div className="flex-1 flex items-center" style={{flexBasis: '250px'}}>
                  <label className="font-medium mr-2 mb-0">Section :</label>
                  <div className="relative flex-1">
                    <select
                      className="w-full px-3 py-2 border rounded-md appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={currentSection?._id || ""}
                      onChange={(e) => {
                        const selected = allSections.find(
                          (section) => section._id === e.target.value
                        );
                        setCurrentSection(selected);
                      }}
                    >
                      {allSections.map((section) => (
                        <option key={section._id} value={section._id}>
                          {section.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <FontAwesomeIcon icon={faCaretDown} className="mx-1" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {students && (
              <>
                {loading && (
                  <div className="cover-all flex1 bg-white">
                    <div
                      className="spinner-container flex1"
                      style={{ width: "100%", height: "200px" }}
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

                <AttendanceNew
                  students={students}
                  selectedOnes={handlSelectedOnes}
                  workingDates={currentSection.workingDates}
                  addAsAbsent={() => setOurAlert(true)}
                />
              </>
            )}
          </div>
        </div>
      )}

      {courses && courses.length <= 0 && (
        <>
          <hr />
          <p className="h6 text-center text-secondary py-1 w600">
            {" "}
            No Courses Available{" "}
          </p>
          <hr />
        </>
      )}
    </div>
  );
};

export default Attendance;
