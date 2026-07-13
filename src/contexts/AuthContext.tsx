import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'admin' | 'ceo' | 'employee';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: AppUser | null;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => ({}),
  logout: () => {},
  isAuthenticated: false,
});

// Hardcoded users for demo roles (can be swapped with Supabase Auth later)
const DEMO_USERS: Record<string, AppUser & { password: string }> = {
  'admin@relata.app': {
    id: '1',
    name: 'Admin User',
    email: 'admin@relata.app',
    role: 'admin',
    password: 'admin123',
    avatar: 'https://i.pravatar.cc/150?u=admin',
  },
  'ceo@relata.app': {
    id: '2',
    name: 'Ziyad Ahmad',
    email: 'ceo@relata.app',
    role: 'ceo',
    password: 'ceo123',
    avatar: 'https://i.pravatar.cc/150?u=ceo',
  },
  'employee@relata.app': {
    id: '3',
    name: 'Employee User',
    email: 'employee@relata.app',
    role: 'employee',
    password: 'emp123',
    avatar: 'https://i.pravatar.cc/150?u=employee',
  },
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);

  // Persist session in localStorage
  useEffect(() => {
    const saved = localStorage.getItem('relata_user');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem('relata_user');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ error?: string }> => {
    const found = DEMO_USERS[email.toLowerCase()];
    if (!found || found.password !== password) {
      return { error: 'Invalid email or password.' };
    }
    const { password: _, ...appUser } = found;
    setUser(appUser);
    localStorage.setItem('relata_user', JSON.stringify(appUser));
    return {};
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('relata_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
