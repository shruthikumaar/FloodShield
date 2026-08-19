import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'CITIZEN' | 'GOVERNMENT' | 'GUEST' | null;

interface UserProfile {
  name: string;
  mobile?: string;
  email?: string;
  avatarUrl?: string;
}

interface AuthContextType {
  role: UserRole;
  user: UserProfile | null;
  login: (role: UserRole, user: UserProfile) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>(null);
  const [user, setUser] = useState<UserProfile | null>(null);

  const login = (newRole: UserRole, newUser: UserProfile) => {
    setRole(newRole);
    setUser(newUser);
  };

  const logout = () => {
    setRole(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ role, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
