import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Stat = { wins: number; losses: number; ties: number };
type AllStats = { X: Stat; O: Stat };
type Ctx = {
  user: string | null;
  myMark: 'X' | 'O';
  setMyMark: (m: 'X' | 'O') => Promise<void>;
  stats: AllStats;
  login: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  record: (r: 'win' | 'loss' | 'tie') => Promise<void>;
  resetStats: () => Promise<void>;
};

const zero: Stat = { wins: 0, losses: 0, ties: 0 };
const defaultAll: AllStats = { X: { ...zero }, O: { ...zero } };
const SESSION_KEY = 'session:user';
const keyStats = (e: string) => `stats2:${e.toLowerCase()}`;
const keyPref = (e: string) => `pref:${e.toLowerCase()}:mark`;

const AppContext = createContext<Ctx>({
  user: null,
  myMark: 'X',
  setMyMark: async () => {},
  stats: defaultAll,
  login: async () => {},
  logout: async () => {},
  record: async () => {},
  resetStats: async () => {},
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<string | null>(null);
  const [stats, setStats] = useState<AllStats>(defaultAll);
  const [myMark, setMyMarkState] = useState<'X' | 'O'>('X');

  useEffect(() => {
    (async () => {
      const u = await AsyncStorage.getItem(SESSION_KEY);
      if (u) await login(u);
    })();
  }, []);

  const loadStats = async (id: string) => {
    const raw = await AsyncStorage.getItem(keyStats(id));
    return raw ? (JSON.parse(raw) as AllStats) : defaultAll;
  };

  const saveStats = async (id: string, s: AllStats) => {
    await AsyncStorage.setItem(keyStats(id), JSON.stringify(s));
  };

  const login = async (email: string) => {
    const id = email.trim().toLowerCase();
    setUser(id);
    await AsyncStorage.setItem(SESSION_KEY, id);
    const s = await loadStats(id);
    setStats(s);
    const pref = (await AsyncStorage.getItem(keyPref(id))) as 'X' | 'O' | null;
    setMyMarkState(pref ?? 'X');
  };

  const logout = async () => {
    setUser(null);
    setStats(defaultAll);
    setMyMarkState('X');
    await AsyncStorage.removeItem(SESSION_KEY);
  };

  const setMyMark = async (m: 'X' | 'O') => {
    if (!user) {
      setMyMarkState(m);
      return;
    }
    setMyMarkState(m);
    await AsyncStorage.setItem(keyPref(user), m);
  };

  const record = async (r: 'win' | 'loss' | 'tie') => {
    if (!user) return;
    const next: AllStats = {
      X: { ...stats.X },
      O: { ...stats.O },
    };
    const bucket = next[myMark];
    if (r === 'win') bucket.wins += 1;
    else if (r === 'loss') bucket.losses += 1;
    else bucket.ties += 1;
    setStats(next);
    await saveStats(user, next);
  };

  const resetStats = async () => {
    if (!user) return;
    setStats(defaultAll);
    await saveStats(user, defaultAll);
  };

  const value = useMemo(
    () => ({ user, myMark, setMyMark, stats, login, logout, record, resetStats }),
    [user, myMark, stats]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);
