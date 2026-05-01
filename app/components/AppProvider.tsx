'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Lang, Theme } from '../lib/types';

interface AppCtx {
  theme: Theme;
  lang: Lang;
  multiLangEnabled: boolean;
  toggleTheme: () => void;
  setLang: (l: Lang) => void;
}

const AppContext = createContext<AppCtx>({
  theme: 'dark', lang: 'id', multiLangEnabled: true,
  toggleTheme: () => {}, setLang: () => {},
});

export function AppProvider({
  children, defaultTheme, defaultLang, multiLangEnabled,
}: {
  children: React.ReactNode;
  defaultTheme: Theme;
  defaultLang: Lang;
  multiLangEnabled: boolean;
}) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [lang, setLangState] = useState<Lang>(defaultLang);

  useEffect(() => {
    const savedTheme = localStorage.getItem('pf-theme') as Theme | null;
    const savedLang = localStorage.getItem('pf-lang') as Lang | null;
    if (savedTheme === 'dark' || savedTheme === 'light') {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      document.documentElement.setAttribute('data-theme', defaultTheme);
    }
    if (savedLang && multiLangEnabled && (savedLang === 'id' || savedLang === 'en')) {
      setLangState(savedLang);
    }
  }, [defaultTheme, multiLangEnabled]);

  const toggleTheme = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('pf-theme', next);
  };

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem('pf-lang', l);
  };

  return (
    <AppContext.Provider value={{ theme, lang, multiLangEnabled, toggleTheme, setLang }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
