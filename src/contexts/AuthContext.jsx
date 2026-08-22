/* Auth Context */
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const AuthContext = createContext(null);

const initialUser = null;

export function AuthProvider({ children }) {
  const [savedUser, setSavedUser] = useLocalStorage('calm-shop-user', null);
  const [user, setUser] = useState(savedUser);
  const [isLoading, setIsLoading] = useState(true);
  const [authMode, setAuthMode] = useState(null); // 'login' | 'signup' | null

  // Initialize from localStorage
  useEffect(() => {
    if (savedUser) {
      setUser(savedUser);
    }
    setIsLoading(false);
  }, [savedUser]);

  // Persist user changes
  useEffect(() => {
    setSavedUser(user);
  }, [user, setSavedUser]);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    // Mock login - simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    // In real app: validate credentials with backend
    const mockUser = {
      id: 'user-' + Date.now(),
      email,
      name: email.split('@')[0],
      createdAt: new Date().toISOString(),
      preferences: { newsletter: true },
    };

    setUser(mockUser);
    setAuthMode(null);
    setIsLoading(false);
    return { success: true, user: mockUser };
  }, []);

  const signup = useCallback(async (userData) => {
    setIsLoading(true);
    // Mock signup - simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const mockUser = {
      id: 'user-' + Date.now(),
      email: userData.email,
      name: userData.name,
      createdAt: new Date().toISOString(),
      preferences: { newsletter: userData.newsletter !== false },
    };

    setUser(mockUser);
    setAuthMode(null);
    setIsLoading(false);
    return { success: true, user: mockUser };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const updateProfile = useCallback((updates) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
  }, []);

  const openLogin = useCallback(() => setAuthMode('login'), []);
  const openSignup = useCallback(() => setAuthMode('signup'), []);
  const closeAuth = useCallback(() => setAuthMode(null), []);

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    authMode,
    login,
    signup,
    logout,
    updateProfile,
    openLogin,
    openSignup,
    closeAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}