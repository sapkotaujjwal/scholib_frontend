 export function getDateTimeFromISO(isoDate) {
  const date = new Date(isoDate);

  const dateString = date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

const timeString = date
  .toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  })
  .replace(/([AP]M)/i, (match) => match.toUpperCase());

  return {
    date: dateString,
    time: timeString
  };
}
