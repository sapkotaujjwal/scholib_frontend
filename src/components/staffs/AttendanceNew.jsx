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

  // Function to check if a date is in the future compared to current date
  const isFutureDate = (dateToCheck) => {
    const currentDate = parseDate(date);

    // Compare years first
    if (dateToCheck.year > currentDate.year) return true;

    // If same year, compare months
    if (
      dateToCheck.year === currentDate.year &&
      dateToCheck.month > currentDate.month
    )
      return true;

    // If same year and month, compare days
    if (
      dateToCheck.year === currentDate.year &&
      dateToCheck.month === currentDate.month &&
      dateToCheck.day > currentDate.day
    )
      return true;

    return false;
  };

  // Function to check if a date is a working date
  const isWorkingDate = (year, month, day) => {
    // Format month and day to ensure they match the format in workingDates
    const formattedMonth = month < 10 ? `0${month}` : `${month}`;
    const formattedDay = day < 10 ? `0${day}` : `${day}`;
    const dateStr = `${year}-${formattedMonth}-${formattedDay}`;
    return workingDates && workingDates.includes(dateStr);
  };

  // Format date for comparison
  const formatDateString = (year, month, day) => {
    return `${year}-${month}-${day}`;
  };

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
                formatDateString(
                  calenderDate.year,
                  calenderDate.month,
                  calenderDate.day
                )
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

  // Get the number of days in the current month
  const getDaysInMonth = (year, month) => {
    // For Nepali calendar, hardcode the days per month
    const daysInMonth = {
      1: 32, // Baisakh
      2: 32, // Jestha
      3: 32, // Asar
      4: 32, // Shrawan
      5: 32, // Bhadra
      6: 32, // Ashwin
      7: 32, // Kartik
      8: 32, // Mangsir
      9: 32, // Poush
      10: 32, // Magh
      11: 32, // Falgun
      12: 32, // Chaitra
    };
    return daysInMonth[month] || 30; // Default to 30 if not found
  };

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

            {!(
              workingDates.includes(
                formatDateString(
                  calenderDate.year,
                  calenderDate.month,
                  calenderDate.day
                )
              ) ||
              date ===
                formatDateString(
                  calenderDate.year,
                  calenderDate.month,
                  calenderDate.day
                )
            ) && (
              <div className="bg-gray-100 rounded-md p-3 md:min-h-[400px] sm:min-h-3  flex1">
                <p className="text-sm mb-0 text-red-600 text-center">
                  {" "}
                  Attendance Not Taken{" "}
                </p>
              </div>
            )}

            {(
              workingDates.includes(
                formatDateString(
                  calenderDate.year,
                  calenderDate.month,
                  calenderDate.day
                )
              ) ||
              date ===
                formatDateString(
                  calenderDate.year,
                  calenderDate.month,
                  calenderDate.day
                )
            ) && (
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
                            // checked={student.status === "Absent"}

                            checked={student.status === "Absent"}
                            onChange={() =>
                              handleStatusChange(student.id, "Absent")
                            }
                            className="form-radio h-4 w-4 cursor-pointer"
                            style={{ accentColor: "#dc2626" }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {(
              workingDates.includes(
                formatDateString(
                  calenderDate.year,
                  calenderDate.month,
                  calenderDate.day
                )
              ) ||
              date ===
                formatDateString(
                  calenderDate.year,
                  calenderDate.month,
                  calenderDate.day
                )
            ) && (
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
            )}
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
                      setCalenderDate((prevDate) => {
                        const newMonth =
                          prevDate.month === 12 ? 12 : prevDate.month + 1;
                        const newDate = { ...prevDate, month: newMonth };

                        // Don't allow navigating to future months
                        if (isFutureDate({ ...newDate, day: 1 })) {
                          return prevDate;
                        }
                        return newDate;
                      });
                    }}
                  />
                </div>
              </div>

              <hr className="border-gray-200 mb-4" />

              <div className="grid grid-cols-7 gap-2 overflow-y-auto max-h-[300px]">
                {[
                  ...Array(
                    getDaysInMonth(calenderDate.year, calenderDate.month)
                  ),
                ].map((_, i) => {
                  const day = i + 1;
                  const isSelectedDay = day === calenderDate.day;
                  const todayParts = date.split("-").map(Number);
                  const isToday =
                    day === todayParts[2] &&
                    calenderDate.month === todayParts[1] &&
                    calenderDate.year === todayParts[0];
                  const isFuture = isFutureDate({
                    year: calenderDate.year,
                    month: calenderDate.month,
                    day: day,
                  });
                  const isWorkDay = isWorkingDate(
                    calenderDate.year,
                    calenderDate.month,
                    day
                  );

                  let dayClasses =
                    "aspect-square flex items-center justify-center rounded-lg text-sm";
                  let dayStyle = {};

                  if (isToday) {
                    dayClasses += " bg-green-500 text-white";
                  } else if (isFuture) {
                    dayClasses += " text-gray-300 cursor-not-allowed";
                  } else if (!isWorkDay) {
                    dayStyle = {
                      backgroundColor: isSelectedDay ? "#b91c1c" : "",
                      color: isSelectedDay ? "white" : "#dc2626",
                    };
                  } else {
                    dayClasses += isSelectedDay
                      ? " bg-blue-500 text-white"
                      : " text-gray-700";
                  }

                  return (
                    <div
                      key={day}
                      className={`${dayClasses} ${
                        !isFuture ? "cursor-pointer hover:opacity-80" : ""
                      }`}
                      style={dayStyle}
                      onClick={() => {
                        if (!isFuture) {
                          setCalenderDate((prevDate) => ({
                            ...prevDate,
                            day: day,
                          }));
                        }
                      }}
                    >
                      {day}
                    </div>
                  );
                })}
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
