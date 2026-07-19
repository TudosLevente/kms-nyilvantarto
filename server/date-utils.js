export function currentMonthKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function currentSemesterKey(date = new Date()) {
  return `${date.getFullYear()}-${date.getMonth() >= 8 ? "09" : "01"}`;
}

export function currentYearKey(date = new Date()) {
  return String(date.getFullYear());
}

export function periodForPaymentType(type, date = new Date()) {
  if (type === "monthly") return currentMonthKey(date);
  if (type === "semester") return currentSemesterKey(date);
  if (type === "annual") return currentYearKey(date);
  throw new Error("Unknown payment type");
}
