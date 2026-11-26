import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { getUserProfile } from '../services/timetableService';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => onAuthStateChanged(auth, async (u) => {
    setProfile(u ? await getUserProfile(u.uid) : null);
    setLoading(false);
  }), []);

  const login = async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
    const p = await getUserProfile(cred.user.uid);
    if (!p) throw new Error('NO_PROFILE');
    setProfile(p);
  };
  const logout = () => signOut(auth);

  return <AuthContext.Provider value={{ profile, loading, login, logout }}>{children}</AuthContext.Provider>;
}
