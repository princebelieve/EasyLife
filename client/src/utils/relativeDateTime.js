export default function relativeDateTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const elapsed = Math.max(0, Date.now() - date.getTime());
  const days = Math.max(1, Math.floor(elapsed / 86_400_000));
  let age;
  if (days <= 30) {
    age = `${days} day${days === 1 ? "" : "s"} ago`;
  } else if (days < 365) {
    const months = Math.min(12, Math.floor(days / 30));
    age = `${months} month${months === 1 ? "" : "s"} ago`;
  } else {
    const years = Math.floor(days / 365);
    age = `${years} year${years === 1 ? "" : "s"} ago`;
  }

  return `${age}, ${date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
}
