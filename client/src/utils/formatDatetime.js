const formatDatetime = (datetime) => {
  let d = new Date(datetime);
  let now = new Date();

  let months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  let month = months[d.getMonth()];
  let date = d.getDate();
  let year = d.getFullYear();

  let fulldate = `${month} ${date}`;
  year !== now.getFullYear() && (fulldate += `, ${year}`);

  // Fixed locale issue by using 24-hour format without locale
  let hours = d.getHours().toString().padStart(2, '0');
  let minutes = d.getMinutes().toString().padStart(2, '0');
  let time = `${hours}:${minutes}`;

  if (date === now.getDate()) return time;
  else if (date === now.getDate() - 1) return "yesterday";
  else if (date === now.getDate() + 1) return "tomorrow";
  else return fulldate;
};

export default formatDatetime;