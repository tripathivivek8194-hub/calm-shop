import assert from 'node:assert/strict';
import test from 'node:test';
import { validateEmail, validatePassword, validateRequired } from '../src/utils/validators.js';

test('validates email addresses', () => {
  assert.equal(validateEmail('hello@calmshop.com'), true);
  assert.equal(validateEmail('not-an-email'), false);
});

test('enforces the password strength policy', () => {
  assert.equal(validatePassword('CalmShop8'), true);
  assert.equal(validatePassword('short'), false);
  assert.equal(validatePassword('lowercaseonly8'), false);
});

test('recognises required values', () => {
  assert.equal(validateRequired('calm'), true);
  assert.equal(validateRequired('   '), false);
  assert.equal(validateRequired([]), false);
});
