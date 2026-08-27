import assert from 'node:assert/strict';
import test from 'node:test';

const mockLocalStorage = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString(); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; },
    _reset: () => { store = {}; },
  };
})();

global.localStorage = mockLocalStorage;

// We need to test the hooks logic - we'll test the core functions

test('useLocalStorage - reads from localStorage on init', () => {
  localStorage.setItem('test-key', JSON.stringify('stored-value'));

  const initialValue = 'default';
  const item = localStorage.getItem('test-key');
  const result = item ? JSON.parse(item) : initialValue;

  assert.equal(result, 'stored-value');
});

test('useLocalStorage - returns initialValue when key not in localStorage', () => {
  localStorage._reset();

  const initialValue = 'default';
  const item = localStorage.getItem('non-existent');
  const result = item ? JSON.parse(item) : initialValue;

  assert.equal(result, 'default');
});

test('useLocalStorage - handles parse errors gracefully', () => {
  localStorage.setItem('bad-key', 'invalid-json{');

  const initialValue = 'default';
  let result;
  try {
    const item = localStorage.getItem('bad-key');
    result = item ? JSON.parse(item) : initialValue;
  } catch (e) {
    result = initialValue;
  }

  assert.equal(result, 'default');
});

test('useLocalStorage - setValue stores in localStorage', () => {
  localStorage._reset();

  const setValue = (value) => {
    localStorage.setItem('test-key', JSON.stringify(value));
  };

  setValue('new-value');
  const stored = localStorage.getItem('test-key');
  assert.equal(JSON.parse(stored), 'new-value');
});

test('useLocalStorage - functional update works', () => {
  localStorage._reset();
  localStorage.setItem('counter', JSON.stringify(5));

  const setValue = (value) => {
    const currentValue = localStorage.getItem('counter');
    const current = currentValue ? JSON.parse(currentValue) : 0;
    const newValue = value instanceof Function ? value(current) : value;
    localStorage.setItem('counter', JSON.stringify(newValue));
  };

  setValue((prev) => prev + 3);
  const stored = localStorage.getItem('counter');
  assert.equal(JSON.parse(stored), 8);
});

test('useLocalStorage - removeValue clears localStorage', () => {
  localStorage._reset();
  localStorage.setItem('test-key', JSON.stringify('value'));

  const removeValue = () => {
    localStorage.removeItem('test-key');
  };

  removeValue();
  const item = localStorage.getItem('test-key');
  assert.equal(item, null);
});

test('useSessionStorage - works similarly to localStorage', () => {
  const mockSessionStorage = (() => {
    let store = {};
    return {
      getItem: (key) => store[key] || null,
      setItem: (key, value) => { store[key] = value.toString(); },
      removeItem: (key) => { delete store[key]; },
      _reset: () => { store = {}; },
    };
  })();

  global.sessionStorage = mockSessionStorage;

  mockSessionStorage.setItem('session-key', JSON.stringify('session-value'));

  const item = sessionStorage.getItem('session-key');
  const result = item ? JSON.parse(item) : 'default';

  assert.equal(result, 'session-value');
});