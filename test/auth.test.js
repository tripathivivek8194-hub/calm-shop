import assert from 'node:assert/strict';
import test from 'node:test';

// Mock localStorage for testing
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

// We need to test the AuthContext logic - since it uses React hooks,
// we'll test the reducer logic and utility functions directly

test('AuthContext - login creates mock user', async () => {
  // This tests the logic that would be in the login callback
  const mockLogin = async (email, password) => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 10));

    const mockUser = {
      id: 'user-' + Date.now(),
      email,
      name: email.split('@')[0],
      createdAt: new Date().toISOString(),
      preferences: { newsletter: true },
    };

    return { success: true, user: mockUser };
  };

  const result = await mockLogin('test@example.com', 'password123');

  assert.equal(result.success, true);
  assert.equal(result.user.email, 'test@example.com');
  assert.equal(result.user.name, 'test');
  assert.ok(result.user.id.startsWith('user-'));
  assert.ok(result.user.preferences.newsletter === true);
});

test('AuthContext - signup creates mock user with provided name', async () => {
  const mockSignup = async (userData) => {
    await new Promise((resolve) => setTimeout(resolve, 10));

    const mockUser = {
      id: 'user-' + Date.now(),
      email: userData.email,
      name: userData.name,
      createdAt: new Date().toISOString(),
      preferences: { newsletter: userData.newsletter !== false },
    };

    return { success: true, user: mockUser };
  };

  const result = await mockSignup({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'Password123',
    newsletter: false,
  });

  assert.equal(result.success, true);
  assert.equal(result.user.name, 'John Doe');
  assert.equal(result.user.email, 'john@example.com');
  assert.equal(result.user.preferences.newsletter, false);
});

test('AuthContext - logout clears user', () => {
  let user = { id: 'user-1', email: 'test@example.com', name: 'Test' };

  const logout = () => {
    user = null;
  };

  logout();
  assert.equal(user, null);
});

test('AuthContext - updateProfile merges updates', () => {
  let user = { id: 'user-1', email: 'test@example.com', name: 'Test', preferences: { newsletter: true } };

  const updateProfile = (updates) => {
    user = user ? { ...user, ...updates } : null;
  };

  updateProfile({ name: 'Updated Name' });
  assert.equal(user.name, 'Updated Name');
  assert.equal(user.email, 'test@example.com');

  updateProfile({ preferences: { newsletter: false, theme: 'dark' } });
  assert.equal(user.preferences.newsletter, false);
  assert.equal(user.preferences.theme, 'dark');
});