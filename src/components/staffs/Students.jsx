import React, { useEffect, useState } from "react";
import "./students.scss";
import { useDispatch, useSelector } from "react-redux";
import MetaData from "../layout/MetaData";
import StudentSearch from "../adminComponents/StudentSearch";
import Dropdown from "../basicComponents/Dropdown";
import StudentDetails from "./StudentDetails";
import DataTable from "../layout/Table";
import axios from "axios";
import { SET_ALERT_GLOBAL } from "../../redux/AlertGlobalSlice";

const Students = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.User.user.payload);
  const school = useSelector((state) => state.Home.school.payload);
  const schoolCode = school.schoolCode;
  const course = useSelector((state) => state.Course.course.payload.course);
  const course1 = useSelector((state) => state.Course.courseAll.payload.course);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const [courses, setCourses] = useState(course);

  const studentsInfo = useSelector((state) => state.Students.students.payload);
  const [students, setStudents] = useState(studentsInfo);

  const [currentStudent, setCurrentStudent] = useState(null);

  if (currentStudent) {
    document.body.classList.add("dshauda-hidden322");
  } else {
    document.body.classList.remove("dshauda-hidden322");
  }

  const [storedStudents, setStoredStudents] = useState(() => {
    const storedData = localStorage.getItem("selectedStudents");

    if (storedData) {
      try {
        let data = JSON.parse(storedData);

        let allHere = data.map((ind) =>
          students.find((std) => std._id === ind._id)
        );
        let availableOnes = allHere.filter((a) => a);

        if (allHere.length !== availableOnes.length) {
          localStorage.setItem(
            "selectedStudents",
            JSON.stringify(availableOnes)
          );
          return availableOnes;
        }

        // Check if data exists and is an array
        if (Array.isArray(data) && data.length > 0) {
          const selectedClass = courses.find(
            (crc) => crc._id === data[0]?.course?.class // Safely access course and class
          );

          if (!selectedClass) {
            // If the class is not found, reset localStorage and return an empty array
            localStorage.setItem("selectedStudents", JSON.stringify([]));
            return [];
          }

          // Return the parsed data if valid
          return data;
        }
      } catch (error) {
        console.error("Error parsing localStorage data:", error);
      }
    }

    // Default to an empty array if storedData is invalid or not found
    localStorage.setItem("selectedStudents", JSON.stringify([]));
    return [];
  });

  const [localStorageActive, setLocalStorageActive] = useState(true);

  function setStudentFunction(id) {
    if (localStorageActive) {
      const storedData = localStorage.getItem("selectedStudents");

      if (storedData) {
        let studentsFromStorage = JSON.parse(storedData);

        const studentToAdd = students.find((std) => std._id === id);
        studentsFromStorage = studentsFromStorage.filter(
          (std) => std._id !== studentToAdd._id
        );
        studentsFromStorage.push(studentToAdd);
        if (studentsFromStorage.length > 5) {
          studentsFromStorage.shift();
        }
        localStorage.setItem(
          "selectedStudents",
          JSON.stringify(studentsFromStorage)
        );
      } else {
        let dummyArray = [];
        dummyArray.push(students.find((std) => std._id === id));
        localStorage.setItem("selectedStudents", JSON.stringify(dummyArray));
      }

      setStoredStudents(() => {
        const storedData = localStorage.getItem("selectedStudents");
        if (storedData) {
          return JSON.parse(storedData);
        } else {
          return [];
        }
      });
    }

    setCurrentStudent(id);
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

  const studentsDataAll = students
    .filter(
      (student) =>
        student.course.class === currentClass._id &&
        student.course.section === currentSection._id
    )
    .map((student, index) => ({
      sn: index + 1,
      name: student.name,
      loginId: student.loginId,
      _id: student._id,
    }));

  const [session, setSession] = useState(null);

  return (
    <div className="studentsAdmin2838">
      <MetaData
        title={`${user && user.role ? "Staff" : "Student"} || Students`}
      />

      {currentStudent && (
        <div className="student-details-container2212 custom-scrollbar">
          <StudentDetails
            _id={currentStudent}
            students={students}
            year={session}
            closeFunction={() => setCurrentStudent(null)}
          />
        </div>
      )}

      <div className="inside-content">
        <div className="veryTop">
          <p className="h4 text-center" style={{ color: "#133189" }}>
            Students
          </p>
          <p className="h6 text-center"> {school.name} </p>
        </div>

        <div className="here-main2638">
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
                if (c) {
                  setLocalStorageActive(false);
                } else {
                  setCourses(course);
                  setLocalStorageActive(true);
                }

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

          {students && (
            <StudentSearch
              setStudent={setStudentFunction}
              students={students}
              storedStudents={localStorageActive ? storedStudents : []}
            />
          )}

          <div className="students-table-3283">
            <p className="h4 pt-3 pb-2 w600 text-center"> Students </p>

            <div className="bar-control flex1 mt-3">
              <div className="ind-bar flex1">
                {" "}
                <p className="h6 w500 me-2"> Class : </p>{" "}
                <Dropdown
                  title={currentClass && currentClass.class}
                  options={courses.map((ind) => {
                    return {
                      label: ind.class,
                      value: ind._id,
                    };
                  })}
                  onSelect={(a, b, c) => {
                    setCurrentClass(
                      courses.find((ind) => {
                        return ind._id === c;
                      })
                    );
                  }}
                />{" "}
              </div>
              <div className="ind-bar flex1">
                {" "}
                <p className="h6 w500 me-2"> Section : </p>{" "}
                <Dropdown
                  options={allSections.map((sec) => {
                    return {
                      label: sec.name,
                      value: sec._id,
                    };
                  })}
                  onSelect={(a, b, c) => {
                    setCurrentSection(
                      allSections.find((ind) => {
                        return ind._id === c;
                      })
                    );
                  }}
                  title={currentSection && currentSection.name}
                />{" "}
              </div>
            </div>

            <hr />
          </div>

          {students && students.length > 0 && (
            <div
              className="mt-3 custom-scrollbar m-auto shadow1"
              style={{ overflowX: "auto", width: "min(94vw, 1000px)" }}
            >
              <DataTable
                data={studentsDataAll}
                exclude={["_id"]}
                fields={["SN", "Student Name", "Login Id"]}
                noSelect={true}
                selectedOnes={(a) => {
                  setStudentFunction(a._id);
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Students;
