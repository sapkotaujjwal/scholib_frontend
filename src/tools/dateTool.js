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


// export function extractDateTime(isoString) {
//   const date = new Date(isoString);

//   const yyyy = date.getFullYear();
//   const mm = String(date.getMonth() + 1).padStart(2, '0');
//   const dd = String(date.getDate()).padStart(2, '0');

//   let hours = date.getHours();
//   const minutes = String(date.getMinutes()).padStart(2, '0');
//   const seconds = String(date.getSeconds()).padStart(2, '0');
//   const ampm = hours >= 12 ? 'PM' : 'AM';

//   hours = hours % 12;
//   hours = hours ? hours : 12; // hour 0 should be 12
//   const formattedHours = String(hours).padStart(2, '0');

//   return {
//     date: `${yyyy}-${mm}-${dd}`,
//     time: `${formattedHours}:${minutes}:${seconds} ${ampm}`
//   };
// }


export function extractDateTime(isoString) {
  const date = new Date(isoString); 
  
  const formattedDate = date.toLocaleString();

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');

  let hours = date.getHours(); // local time
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours ? hours : 12;
  const formattedHours = String(hours).padStart(2, '0');

  return {
    date: `${yyyy}-${mm}-${dd}`,
    time: `${formattedHours}:${minutes}:${seconds} ${ampm}`
  };
}