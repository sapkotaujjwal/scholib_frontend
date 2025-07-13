import { faCaretLeft, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


const Calendar = ({ calenderDate, setCalenderDate, shortMonths }) => {
  const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Get number of days in a month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month, 0).getDate();
  };

  // Get what day of the week the month starts on (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month - 1, 1).getDay();
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(calenderDate.year, calenderDate.month);
    const firstDay = getFirstDayOfMonth(calenderDate.year, calenderDate.month);
    const days = [];

    // Add empty cells for days before the month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const handlePrevMonth = () => {
    setCalenderDate(prevDate => {
      if (prevDate.month === 1) {
        return { ...prevDate, month: 12, year: prevDate.year - 1 };
      } else {
        return { ...prevDate, month: prevDate.month - 1 };
      }
    });
  };

  const handleNextMonth = () => {
    setCalenderDate(prevDate => {
      if (prevDate.month === 12) {
        return { ...prevDate, month: 1, year: prevDate.year + 1 };
      } else {
        return { ...prevDate, month: prevDate.month + 1 };
      }
    });
  };

  const handleDayClick = (day) => {
    if (day) {
      setCalenderDate(prevDate => ({ ...prevDate, day }));
    }
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className="flex-1">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">
          {shortMonths[calenderDate.month - 1]} {calenderDate.year}
        </h3>
        <div className="flex space-x-4">
          <button
            className="p-2 hover:bg-gray-100 rounded-full"
            onClick={handlePrevMonth}
          >
            <FontAwesomeIcon icon={faCaretLeft} />
          </button>
          <button
            className="p-2 hover:bg-gray-100 rounded-full"
            onClick={handleNextMonth}
          >
            <FontAwesomeIcon icon={faCaretRight} />
          </button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {dayHeaders.map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((day, index) => (
          <button
            key={index}
            className={`
              aspect-square rounded-lg p-2 text-center
              transition-colors
              ${day ? 'hover:bg-blue-50 cursor-pointer' : 'cursor-default invisible'}
              ${day === calenderDate.day
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : day 
                  ? "bg-gray-50"
                  : ""
              }
            `}
            onClick={() => handleDayClick(day)}
            disabled={!day}
          >
            {day || ''}
          </button>
        ))}
      </div>
    </div>
  );
};


export default Calendar;