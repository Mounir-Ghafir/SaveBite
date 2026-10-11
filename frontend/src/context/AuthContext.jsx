import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

function readStoredUser() {
  const stored = localStorage.getItem('savebite_user');
  if (!stored) {
    return null;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);
  const [token, setToken] = useState(() => localStorage.getItem('savebite_token'));

  function login(data) {
    localStorage.setItem('savebite_token', data.token);
    localStorage.setItem('savebite_user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  }

  function logout() {
    localStorage.removeItem('savebite_token');
    localStorage.removeItem('savebite_user');
    setToken(null);
    setUser(null);
  }

  const isStore = user ? user.role === 'store' : false;
  const value = { user, token, isStore, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
