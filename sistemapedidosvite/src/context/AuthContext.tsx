import React, { createContext, useContext, useState } from 'react';

interface User {
  id: number;
  nomeUsuario: string;
  role: string; // Adiciona mais informações conforme necessário
}

interface AuthContextProps {
  isAuthenticated: boolean;
  user: User | null;  // Adiciona a propriedade `user`
  role: string | null;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps>({
  isAuthenticated: false,
  user: null,
  role: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('user'));
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [role, setRole] = useState<string | null>(user ? user.role : null);

  const login = (userData: User) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setRole(userData.role);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setRole(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
