export function isSameDate(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

export function parseDate(dateString) {
  const cleanDate = dateString.replace(/\//g, "-");
  const [year, month, day] = cleanDate.split("-");
  return {
    year: parseInt(year, 10),
    month: parseInt(month, 10),
    day: parseInt(day, 10),
  };
}

// convert time to 12 hr format
export function convertTo12HourClock(timeString) {
  var [hours, minutes, seconds] = timeString.split(":").map(Number);
  var period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;

  var formattedTime =
    hours +
    ":" +
    (minutes < 10 ? "0" : "") +
    minutes +
    ":" +
    (seconds < 10 ? "0" : "") +
    seconds +
    " " +
    period;

  return formattedTime;
}

// module.exports = { isSameDate, parseDate, convertTo12HourClock };
