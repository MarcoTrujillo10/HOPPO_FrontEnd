// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Al montar, recuperar usuario guardado
  useEffect(() => {
    const raw = localStorage.getItem("hoppo_user");
    if (raw) {
      try { setUser(JSON.parse(raw)); } catch { /* noop */ }
    }
  }, []);

  // Guardar cambios de usuario
  useEffect(() => {
    if (user) localStorage.setItem("hoppo_user", JSON.stringify(user));
    else localStorage.removeItem("hoppo_user");
  }, [user]);

  const login = async ({ email, password }) => {
    // MOCK: aceptamos cualquier email/pass
    const mockUser = {
      id: "u1",
      name: email.split("@")[0] || "Usuario",
      email,
      avatarUrl: `https://api.dicebear.com/8.x/identicon/svg?seed=${encodeURIComponent(email)}`,
    };
    setUser(mockUser);
    return mockUser;
  };

  const register = async ({ name, email, password }) => {
    const mockUser = {
      id: "u1",
      name: name || (email.split("@")[0] || "Usuario"),
      email,
      avatarUrl: `https://api.dicebear.com/8.x/identicon/svg?seed=${encodeURIComponent(email)}`,
    };
    setUser(mockUser);
    return mockUser;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
