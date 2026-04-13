export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

export function validatePassword(pw) {
  return typeof pw === "string" && pw.length >= 6
}
