export function requireFields(payload, fields) {
  return fields.filter((field) => !String(payload[field] || "").trim());
}

export function isValidPaymentType(type) {
  return ["monthly", "semester", "annual"].includes(type);
}
