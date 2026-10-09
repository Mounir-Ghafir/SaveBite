export function getToday() {
  return toDateString(new Date());
}

export function addDays(n) {
  const date = new Date();
  date.setDate(date.getDate() + n);
  return toDateString(date);
}

function toDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
