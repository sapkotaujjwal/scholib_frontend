import React, { useState } from "react";
import { useSelector } from "react-redux";
import { parseDate } from "../../../tools/dateTool";

const AbsentDaysCalendar = ({ absentDays }) => {
  const date = useSelector((state) => state.Other.date);
  const [calenderDate, setCalenderDate] = useState(parseDate(date));
  const [monthIndex, setMonthIndex] = useState(calenderDate.month - 1);

  // You had selectedDay in your JSX but it wasn't defined, so I'm adding it here
  const [selectedDay, setSelectedDay] = useState(null);

  const months = [
    "Baisakh",
    "Jestha",
    "Ashadh",
    "Shrawan",
    "Bhadra",
    "Ashwin",
    "Kartik",
    "Mangsir",
    "Poush",
    "Magh",
    "Falgun",
    "Chaitra",
  ];

  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const changeMonth = (direction) => {
    setMonthIndex((prev) => {
      const newIndex = (prev + direction + 12) % 12;
      return newIndex;
    });
  };

  const absentArray = absentDays.map((each) => {
    return parseDate(each.date);
  });

  // Function to check if a specific day is in the absentArray for the current month
  const isAbsentDay = (day) => {
    return absentArray.some(
      (absentDate) =>
        absentDate.day === day &&
        absentDate.month === monthIndex + 1 &&
        absentDate.year === calenderDate.year
    );
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => changeMonth(-1)}
          className="p-2 bg-gray-200 rounded-md"
        >
          ◀
        </button>
        <h2 className="text-xl font-bold">{months[monthIndex]}</h2>{" "}
        <button
          onClick={() => changeMonth(1)}
          className="p-2 bg-gray-200 rounded-md"
        >
          ▶
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium">
        {days.map((day) => (
          <div
            key={day}
            className={` p-2 md:p-4 border rounded-md cursor-pointer ${
              isAbsentDay(day) ? "bg-red-600 text-white" : ""
            } ${day === selectedDay ? "ring-2 ring-blue-500" : ""}`}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AbsentDaysCalendar;
