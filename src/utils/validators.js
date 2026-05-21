export function isValidEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}

export function isValidPhone(phone) {
  return /^[0-9+\-\s]{8,15}$/.test(phone);
}

export function requireText(value, fieldName) {
  if (!value || !value.trim()) return `${fieldName} không được để trống`;
  return '';
}
