'use client';

import { useEffect } from 'react';
import { useUIStore } from '@/store/uiStore';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, setResolvedTheme } = useUIStore();

  useEffect(() => {
    const root = document.documentElement;
    const applyTheme = (t: 'light' | 'dark') => {
      root.classList.toggle('dark', t === 'dark');
      setResolvedTheme(t);
    };

    if (theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      applyTheme(mq.matches ? 'dark' : 'light');
      const handler = (e: MediaQueryListEvent) => applyTheme(e.matches ? 'dark' : 'light');
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    } else {
      applyTheme(theme as 'light' | 'dark');
    }
  }, [theme, setResolvedTheme]);

  return <>{children}</>;
}
