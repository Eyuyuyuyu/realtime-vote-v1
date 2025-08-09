import { createContext, useContext, useEffect } from 'react';
import useLocalStorageState from 'use-local-storage-state';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  actualTheme: 'light' | 'dark';
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// 检测系统主题偏好
export function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// 应用主题到 DOM
export function applyTheme(theme: 'light' | 'dark') {
  const root = document.documentElement;
  
  // 移除旧的主题类
  root.classList.remove('light', 'dark');
  
  // 添加新的主题类
  root.classList.add(theme);
}

// 自定义钩子用于主题状态管理
export function useThemeState() {
  const [theme, setTheme] = useLocalStorageState<Theme>('theme', {
    defaultValue: 'system',
  });

  // 计算实际应用的主题
  const actualTheme: 'light' | 'dark' = theme === 'system' ? getSystemTheme() : theme;

  // 监听系统主题变化
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      applyTheme(getSystemTheme());
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // 应用主题到 DOM
  useEffect(() => {
    applyTheme(actualTheme);
  }, [actualTheme]);

  return {
    theme,
    setTheme,
    actualTheme,
  };
}
