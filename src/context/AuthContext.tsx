import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, UserRole } from '@/types';
import { teacherAccount, parentAccounts } from '@/data/demoData';
import { studentAccount } from '@/data/recyclingData';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => boolean;
  demoLogin: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const AUTH_KEY = 'msedu_auth_v1';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(AUTH_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  const login = (email: string, password: string, role: UserRole): boolean => {
    if (role === 'teacher') {
      if (email === teacherAccount.email && password === teacherAccount.password) {
        const u: User = { id: teacherAccount.id, email: teacherAccount.email, name: teacherAccount.name, role: 'teacher' };
        setUser(u);
        localStorage.setItem(AUTH_KEY, JSON.stringify(u));
        return true;
      }
    } else if (role === 'parent') {
      const parent = parentAccounts.find(
        (p) => p.email === email && p.password === password
      );
      if (parent) {
        const u: User = { id: parent.id, email: parent.email, name: parent.name, role: 'parent', childId: parent.childId };
        setUser(u);
        localStorage.setItem(AUTH_KEY, JSON.stringify(u));
        return true;
      }
    } else if (role === 'student') {
      if (email === studentAccount.email && password === studentAccount.password) {
        const u: User = { id: studentAccount.id, email: studentAccount.email, name: studentAccount.name, role: 'student', studentId: studentAccount.studentId };
        setUser(u);
        localStorage.setItem(AUTH_KEY, JSON.stringify(u));
        return true;
      }
    }
    return false;
  };

  const demoLogin = (role: UserRole) => {
    if (role === 'teacher') {
      const u: User = { id: teacherAccount.id, email: teacherAccount.email, name: teacherAccount.name, role: 'teacher' };
      setUser(u);
      localStorage.setItem(AUTH_KEY, JSON.stringify(u));
    } else if (role === 'parent') {
      const parent = parentAccounts[0];
      const u: User = { id: parent.id, email: parent.email, name: parent.name, role: 'parent', childId: parent.childId };
      setUser(u);
      localStorage.setItem(AUTH_KEY, JSON.stringify(u));
    } else if (role === 'student') {
      const u: User = { id: studentAccount.id, email: studentAccount.email, name: studentAccount.name, role: 'student', studentId: studentAccount.studentId };
      setUser(u);
      localStorage.setItem(AUTH_KEY, JSON.stringify(u));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, login, demoLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
