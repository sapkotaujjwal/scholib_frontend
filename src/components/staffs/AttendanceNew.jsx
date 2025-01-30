import React, { useEffect, useState } from "react";
import "./attendanceNew.scss";
import {
  faCaretLeft,
  faCaretRight,
  faCircleCheck,
  faFaceFrown,
  faGraduationCap,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector } from "react-redux";
import { isSameDate, parseDate } from "../../tools/dateTool";

const AttendanceNew = ({
  students = [],
  selectedOnes,
  addAsAbsent,
  workingDates,
}) => {
  const date = useSelector((state) => state.Other.date);
  const [calenderDate, setCalenderDate] = useState(parseDate(date));

  const [attendanceData, setAttendanceData] = useState([]);

  const handleStatusChange = (id, status) => {
    setAttendanceData(
      attendanceData.map((student) =>
        student.id === id ? { ...student, status } : student
      )
    );
  };

  const totalStudents = attendanceData.length;
  const presentCount = attendanceData.filter(
    (s) => s.status === "Present"
  ).length;
  const absentCount = attendanceData.filter(
    (s) => s.status === "Absent"
  ).length;

  useEffect(() => {
    setAttendanceData(
      students.map((std) => {
        return {
          name: std.name,
          id: std._id,
          status:
            std.absentdays &&
            std.absentdays.some((absent) =>
              isSameDate(
                absent.date,
                `${calenderDate.year}-${calenderDate.month}-${calenderDate.day}`
              )
            )
              ? "Absent"
              : "Present",
        };
      })
    );
  }, [students, calenderDate]);

  useEffect(() => {
    selectedOnes(
      attendanceData
        .filter((a) => a.status === "Absent")
        .map((a) => ({ _id: a.id }))
    );
  }, [attendanceData]);

  const shortMonths = [
    "Baisakh", // Baisakh
    "Jestha", // Jestha
    "Asar", // Asar
    "Shrawan", // Shrawan
    "Bhadra", // Bhadra
    "Ashwin", // Ashwin
    "Kartik", // Kartik
    "Mangsir", // Mangsir
    "Poush", // Poush
    "Magh", // Magh
    "Falgun", // Falgun
    "Chaitra", // Chaitra
  ];

  return (
    <div className="allWrapupAttendanceNew">
      <div className="attendance-container">
        <div className="main-content flex1">
          <div className="attendance-table">
            <hr />
            <table>
              <thead>
                <tr>
                  <th> Id</th>
                  <th>Name</th>
                  <th>Present</th>
                  <th>Absent</th>
                </tr>
              </thead>
              <tbody>
                {attendanceData.map((student, index) => (
                  <tr key={student.id}>
                    <td>{index + 1}</td>
                    <td>{student.name}</td>
                    <td>
                      <input
                        type="radio"
                        checked={student.status === "Present"}
                        onChange={() =>
                          handleStatusChange(student.id, "Present")
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="radio"
                        checked={student.status === "Absent"}
                        style={{ accentColor: "red" }}
                        onChange={() =>
                          handleStatusChange(student.id, "Absent")
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="submit-button">
              <button
                className="btn btn-secondary my-3"
                onClick={() => {
                  addAsAbsent();
                }}
              >
                {" "}
                Submit{" "}
              </button>
            </div>
          </div>

          <div className="calendar-summary">
            <div className="calendar">
              <div className="top flex3">
                <h4 className="h5 w600">
                  {shortMonths[calenderDate.month - 1]} {calenderDate.year}{" "}
                </h4>
                <div className="arrows flex1">
                  <FontAwesomeIcon
                    className="me-3"
                    icon={faCaretLeft}
                    onClick={() => {
                      setCalenderDate((prevDate) => ({
                        ...prevDate,
                        month: prevDate.month === 1 ? 1 : prevDate.month - 1,
                      }));
                    }}
                  />
                  <FontAwesomeIcon
                    icon={faCaretRight}
                    onClick={() => {
                      setCalenderDate((prevDate) => ({
                        ...prevDate,
                        month: prevDate.month === 12 ? 12 : prevDate.month + 1,
                      }));
                    }}
                  />
                </div>
              </div>

              <hr />

              <div className="days custom-scrollbar">
                {[...Array(32)].map((_, i) => (
                  <div
                    key={i}
                    className={`numbersHere ${
                      i === calenderDate.day - 1 ? "selected" : ""
                    }`}
                    onClick={() => {
                      setCalenderDate((prevDate) => ({
                        ...prevDate,
                        day: i + 1,
                      }));
                    }}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>

            <div className="summary">
              <div className="summary-card flex1 total">
                <div className="left flex1">
                  <FontAwesomeIcon icon={faGraduationCap} />
                </div>

                <div className="right">
                  <h3 className="h6 w500">{totalStudents}</h3>
                  <p className="h7 w500">Total Students</p>
                </div>
              </div>
              <div className="summary-card flex1 present">
                <div className="left flex1">
                  <FontAwesomeIcon icon={faCircleCheck} />
                </div>

                <div className="right">
                  <h3 className="h6 w500">{presentCount}</h3>
                  <p className="h7 w500">Present</p>
                </div>
              </div>
              <div className="summary-card absent flex1">
                <div className="left flex1">
                  <FontAwesomeIcon icon={faFaceFrown} />
                </div>

                <div className="right">
                  <h3 className="h6 w500">{absentCount}</h3>
                  <p className="h7 w500">Absent</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceNew;
