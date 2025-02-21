import { useState, useEffect } from "react";
import { parseDate } from "../../tools/dateTool";

const DatePicker = ({ data = '0000/00/00', setData =()=>{} }) => {

  if(!data){
    data = '0000/00/00'
  }
  const date = parseDate(data);


  const [year, setYear] = useState(date.year);
  const [month, setMonth] = useState(String(date.month).padStart(2, '0'));
  const [day, setDay] = useState(String(date.day).padStart(2, '0'));
  

  useEffect(() => {
    if (year && month && day ) {
      setData(`${year}/${month}/${day}`);
    }
  }, [year, month, day]);

  const generateYears = () => {
    const years = [];
    for (let i = 2090; i >= 2000; i--) {
      years.push(i);
    }
    return years;
  };

  const generateMonths = () => {
    return Array.from({ length: 12 }, (_, i) =>
      (i + 1).toString().padStart(2, "0")
    );
  };

  const generateDays = () => {
    return Array.from({ length: 32 }, (_, i) =>
      (i + 1).toString().padStart(2, "0")
    );
  };

  return (
    <div className="flex gap-2 mt-2">
      {/* Year Dropdown */}
      <select
        id="year"
        className="border p-2 rounded-md w-1/3"
        value={year}
        onChange={(e) => setYear(e.target.value)}
      >
        <option value="">YYYY</option>
        {generateYears().map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>

      {/* Month Dropdown */}
      <select
        id="month"
        className="border p-2 rounded-md w-1/3"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
      >
        <option value="">MM</option>
        {generateMonths().map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>

      {/* Day Dropdown */}
      <select
        id="day"
        className="border p-2 rounded-md w-1/3"
        value={day}
        onChange={(e) => setDay(e.target.value)}
      >
        <option value="">DD</option>
        {generateDays().map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DatePicker;
