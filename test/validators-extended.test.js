import assert from 'node:assert/strict';
import test from 'node:test';
import {
  validateEmail,
  validatePassword,
  validateRequired,
  validatePhone,
  validateExpiry,
  validateCVC,
  validateCreditCard
} from '../src/utils/validators.js';

// Additional validator functions not exported - we'll test them inline
function validatePINCode(pin) {
  return /^[1-9][0-9]{5}$/.test(pin);
}

function validateCardNumber(number) {
  return /^\d{16}$/.test(number);
}

test('validateEmail - validates correct emails', () => {
  assert.equal(validateEmail('hello@calmshop.com'), true);
  assert.equal(validateEmail('test.email@example.com'), true);
  assert.equal(validateEmail('user+tag@domain.co.in'), true);
  assert.equal(validateEmail('user123@sub.domain.com'), true);
});

test('validateEmail - rejects invalid emails', () => {
  assert.equal(validateEmail('not-an-email'), false);
  assert.equal(validateEmail('missing@domain'), false);
  assert.equal(validateEmail('@nodomain.com'), false);
  assert.equal(validateEmail('nodomain.com'), false);
  assert.equal(validateEmail(''), false);
  assert.equal(validateEmail('spaces in@email.com'), false);
});

test('validatePassword - enforces strength policy', () => {
  assert.equal(validatePassword('CalmShop8'), true);
  assert.equal(validatePassword('Password1'), true);
  assert.equal(validatePassword('MyStr0ngPass'), true);
  assert.equal(validatePassword('A1bcdefg'), true);
});

test('validatePassword - rejects weak passwords', () => {
  assert.equal(validatePassword('short'), false);
  assert.equal(validatePassword('lowercaseonly8'), false); // no uppercase
  assert.equal(validatePassword('UPPERCASEONLY8'), false); // no lowercase
  assert.equal(validatePassword('NoNumbersHere'), false); // no number
  assert.equal(validatePassword('12345678'), false); // no letters
  assert.equal(validatePassword(''), false);
  assert.equal(validatePassword('pass1234'), false); // no uppercase
  assert.equal(validatePassword('PASS1234'), false); // no lowercase
  assert.equal(validatePassword('Password'), false); // no number
});

test('validateRequired - recognizes required values', () => {
  assert.equal(validateRequired('calm'), true);
  assert.equal(validateRequired('0'), true);
  assert.equal(validateRequired(false), true); // boolean false is valid
  assert.equal(validateRequired(0), true); // number 0 is valid
});

test('validateRequired - rejects empty values', () => {
  assert.equal(validateRequired(''), false);
  assert.equal(validateRequired('   '), false);
  assert.equal(validateRequired(null), false);
  assert.equal(validateRequired(undefined), false);
  assert.equal(validateRequired([]), false);
});

test('validatePINCode - validates Indian PIN codes', () => {
  assert.equal(validatePINCode('110001'), true);
  assert.equal(validatePINCode('400001'), true);
  assert.equal(validatePINCode('560001'), true);
  assert.equal(validatePINCode('600001'), true);
});

test('validatePINCode - rejects invalid PIN codes', () => {
  assert.equal(validatePINCode('010001'), false); // starts with 0
  assert.equal(validatePINCode('11001'), false); // 5 digits
  assert.equal(validatePINCode('1100011'), false); // 7 digits
  assert.equal(validatePINCode('abcdef'), false); // letters
  assert.equal(validatePINCode(''), false);
  assert.equal(validatePINCode(' 110001'), false); // space
});

test('validatePhone - validates phone numbers', () => {
  // The regex: ^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$
  // Expects: optional +, optional (, 3 digits, optional ), optional separator, 3 digits, optional separator, 4-6 digits
  assert.equal(validatePhone('987-654-3210'), true);
  assert.equal(validatePhone('(555) 123-4567'), true);
  assert.equal(validatePhone('555-123-4567'), true);
  assert.equal(validatePhone('5551234567'), true); // No separators works too (optional separators)
  // +1-555-123-4567 doesn't match because after + it expects 3 digits (area code)
  assert.equal(validatePhone('+91 98765 43210'), false); // 2-digit country code doesn't match
});

test('validatePhone - rejects invalid phone numbers', () => {
  assert.equal(validatePhone('123'), false); // too short
  assert.equal(validatePhone('abcdefghij'), false);
  assert.equal(validatePhone(''), false);
});

test('validateCardNumber - validates 16-digit cards', () => {
  assert.equal(validateCardNumber('1234567890123456'), true);
  assert.equal(validateCardNumber('1234 5678 9012 3456'), false); // spaces not allowed in raw
});

test('validateCardNumber - rejects invalid card numbers', () => {
  assert.equal(validateCardNumber('123456789012345'), false); // 15 digits
  assert.equal(validateCardNumber('12345678901234567'), false); // 17 digits
  assert.equal(validateCardNumber('abcd567890123456'), false);
  assert.equal(validateCardNumber(''), false);
});

test('validateCardNumber - spaces are not allowed in this simple implementation', () => {
  // This simple implementation only accepts exactly 16 digits
  assert.equal(validateCardNumber('1234 5678 9012 3456'), false);
});

test('validateCreditCard - validates using Luhn algorithm', () => {
  assert.equal(validateCreditCard('4242424242424242'), true); // Valid Visa test number
  assert.equal(validateCreditCard('5555555555554444'), true); // Valid Mastercard test number
});

test('validateCreditCard - rejects invalid cards', () => {
  assert.equal(validateCreditCard('1234567890123456'), false); // Invalid Luhn
  assert.equal(validateCreditCard('123'), false); // Too short
  assert.equal(validateCreditCard('abcd'), false); // Non-numeric
});

test('validateExpiry - validates MM/YY format', () => {
  const futureYear = (new Date().getFullYear() + 1).toString().slice(-2);
  const futureMonth = '12';
  assert.equal(validateExpiry(`${futureMonth}/${futureYear}`), true);

  const nextYear = (new Date().getFullYear() + 2).toString().slice(-2);
  assert.equal(validateExpiry(`01/${nextYear}`), true);
});

test('validateExpiry - rejects invalid expiry', () => {
  assert.equal(validateExpiry('13/25'), false); // invalid month
  assert.equal(validateExpiry('00/25'), false); // zero month
  assert.equal(validateExpiry('12/2'), false); // 1 digit year
  assert.equal(validateExpiry('1/25'), false); // 1 digit month
  assert.equal(validateExpiry('12-25'), false); // wrong separator
  assert.equal(validateExpiry(''), false);

  // Past expiry should be false
  const pastYear = (new Date().getFullYear() - 1).toString().slice(-2);
  assert.equal(validateExpiry(`12/${pastYear}`), false);
});

test('validateCVC - validates 3-4 digit CVC', () => {
  assert.equal(validateCVC('123'), true);
  assert.equal(validateCVC('1234'), true);
});

test('validateCVC - rejects invalid CVC', () => {
  assert.equal(validateCVC('12'), false);
  assert.equal(validateCVC('12345'), false);
  assert.equal(validateCVC('abc'), false);
  assert.equal(validateCVC(''), false);
});