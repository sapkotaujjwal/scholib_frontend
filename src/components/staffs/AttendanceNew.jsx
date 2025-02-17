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

            <div className="w-full max-w-[94vw] overflow-x-auto shadow1 rounded-md">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      &nbsp;&nbsp;&nbsp; SN &nbsp;&nbsp;&nbsp;
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
                      style={{ textAlign: "left" }}
                    >
                      Name
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      Present
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      Absent
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {attendanceData.map((student, index) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500 border-b">
                        {index + 1}
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b text-left"
                        style={{ textAlign: "left" }}
                      >
                        {student.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center border-b">
                        <input
                          type="radio"
                          checked={student.status === "Present"}
                          onChange={() =>
                            handleStatusChange(student.id, "Present")
                          }
                          className="form-radio h-4 w-4 text-green-600 focus:ring-green-500 cursor-pointer"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center border-b">
                        <input
                          type="radio"
                          checked={student.status === "Absent"}
                          onChange={() =>
                            handleStatusChange(student.id, "Absent")
                          }
                          className="form-radio h-4 w-4 cursor-pointer"
                          style={{ accentColor: "#dc2626" }} // This adds the red color inline
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

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
            <div className="w-full p-4 bg-white shadow1 rounded-md calender m-1">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold text-gray-800">
                  {shortMonths[calenderDate.month - 1]} {calenderDate.year}
                </h4>
                <div className="flex gap-4">
                  <FontAwesomeIcon
                    className="text-gray-600 hover:text-gray-800 cursor-pointer"
                    icon={faCaretLeft}
                    onClick={() => {
                      setCalenderDate((prevDate) => ({
                        ...prevDate,
                        month: prevDate.month === 1 ? 1 : prevDate.month - 1,
                      }));
                    }}
                  />
                  <FontAwesomeIcon
                    className="text-gray-600 hover:text-gray-800 cursor-pointer"
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

              <hr className="border-gray-200 mb-4" />

              <div className="grid grid-cols-7 gap-2 overflow-y-auto max-h-[300px]">
                {[...Array(32)].map((_, i) => (
                  <div
                    key={i}
                    className={`
              aspect-square flex items-center justify-center rounded-lg text-sm cursor-pointer
              ${
                i + 1 === calenderDate.day
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-100 text-gray-700"
              }
            `}
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
