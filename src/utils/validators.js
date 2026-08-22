/* Validators */

export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validatePhone(phone) {
  const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return re.test(phone);
}

export function validateRequired(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

export function validateMinLength(value, min) {
  if (typeof value !== 'string') return false;
  return value.trim().length >= min;
}

export function validateMaxLength(value, max) {
  if (typeof value !== 'string') return false;
  return value.trim().length <= max;
}

export function validatePassword(password) {
  // At least 8 chars, 1 uppercase, 1 lowercase, 1 number
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return re.test(password);
}

export function getPasswordStrength(password) {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
  return { score: Math.min(score, 5), label: labels[Math.min(score, 5)] };
}

export function validateCreditCard(number) {
  // Luhn algorithm
  const digits = number.replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19) return false;

  let sum = 0;
  let isEven = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    isEven = !isEven;
  }
  return sum % 10 === 0;
}

export function validateExpiry(expiry) {
  const re = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
  const match = expiry.match(re);
  if (!match) return false;

  const month = parseInt(match[1], 10);
  const year = parseInt(match[2], 10) + 2000;
  const now = new Date();
  const expDate = new Date(year, month - 1);
  return expDate > now;
}

export function validateCVC(cvc) {
  return /^\d{3,4}$/.test(cvc);
}

export function validateZipCode(zip, country = 'US') {
  if (country === 'US') return /^\d{5}(-\d{4})?$/.test(zip);
  if (country === 'CA') /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/.test(zip);
  if (country === 'UK') /^[A-Za-z]{1,2}\d[A-Za-z\d]? \d[A-Za-z]{2}$/.test(zip);
  return zip.length >= 3;
}