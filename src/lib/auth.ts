import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { User } from './types';

const STORAGE_KEY = 'avl.user';

interface AuthContextValue {
  user: User | null;
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (input: { name: string; email: string; role: string; password: string }) => Promise<User>;
  updateProfile: (patch: Partial<Pick<User, 'name' | 'email' | 'role'>>) => void;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

function loadUser(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

function persistUser(user: User | null) {
  if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  else localStorage.removeItem(STORAGE_KEY);
}

export function useAuthState(): AuthContextValue {
  const [user, setUser] = useState<User | null>(() => loadUser());

  useEffect(() => {
    persistUser(user);
  }, [user]);

  const signIn = useCallback(async (email: string, _password: string) => {
    // Mock: accept any non-empty credentials.
    const existing = loadUser();
    const next: User = existing && existing.email === email
      ? existing
      : {
          id: existing?.id ?? `u_${Date.now()}`,
          name: existing?.name ?? email.split('@')[0] ?? 'Technician',
          email,
          role: existing?.role ?? 'Audio Engineer',
          plan: existing?.plan ?? 'trial',
        };
    setUser(next);
    return next;
  }, []);

  const signUp = useCallback(async (input: { name: string; email: string; role: string; password: string }) => {
    const next: User = {
      id: `u_${Date.now()}`,
      name: input.name.trim() || input.email.split('@')[0] || 'Technician',
      email: input.email,
      role: input.role.trim() || 'AVL Technician',
      plan: 'trial',
    };
    setUser(next);
    return next;
  }, []);

  const updateProfile = useCallback((patch: Partial<Pick<User, 'name' | 'email' | 'role'>>) => {
    setUser((curr) => (curr ? { ...curr, ...patch } : curr));
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
  }, []);

  return { user, signIn, signUp, updateProfile, signOut };
}
