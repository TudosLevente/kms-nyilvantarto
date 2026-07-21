export function requireFields(payload, fields) {
  return fields.filter((field) => !String(payload[field] || "").trim());
}

export function isValidPaymentType(type) {
  return ["monthly", "semester", "annual"].includes(type);
}

export function isValidName(name) {
  if (!name) return false;
  if (name.length < 3 || name.length > 80) return false;
  return /^[a-zA-ZáéíóöőúüűÁÉÍÓÖŐÚÜŰ \-\.]+$/.test(name);
}

export function isValidEmail(email) {
  if (!email) return true; // Optional field
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidBirthDate(dateString) {
  if (!dateString) return false;
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return false;
  
  const now = new Date();
  const ageInMs = now - date;
  const ageInYears = ageInMs / (1000 * 60 * 60 * 24 * 365.25);
  
  return ageInYears >= 2 && ageInYears <= 100;
}
