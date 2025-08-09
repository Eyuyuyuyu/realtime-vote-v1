import React from 'react';
import { motion } from 'framer-motion';
import { useTheme, type Theme } from '../hooks/useTheme';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme, actualTheme } = useTheme();

  const themeOptions: { value: Theme; label: string; icon: string }[] = [
    { value: 'light', label: '浅色', icon: '☀️' },
    { value: 'dark', label: '深色', icon: '🌙' },
    { value: 'system', label: '跟随系统', icon: '💻' },
  ];

  return (
    <div className="flex items-center gap-2 p-1 bg-muted rounded-lg">
      {themeOptions.map((option) => (
        <motion.button
          key={option.value}
          onClick={() => setTheme(option.value)}
          className={`
            relative px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
            ${theme === option.value 
              ? 'text-foreground' 
              : 'text-muted-foreground hover:text-foreground'
            }
          `}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {theme === option.value && (
            <motion.div
              layoutId="activeTheme"
              className="absolute inset-0 bg-background border border-border rounded-md shadow-sm"
              initial={false}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30
              }}
            />
          )}
          <span className="relative flex items-center gap-1">
            <span className="text-base">{option.icon}</span>
            <span className="hidden sm:inline">{option.label}</span>
          </span>
        </motion.button>
      ))}
    </div>
  );
};

// 简化版本的主题切换按钮（仅深色/浅色）
export const SimpleThemeToggle: React.FC = () => {
  const { actualTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(actualTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <motion.button
      onClick={toggleTheme}
      className="p-2 rounded-md bg-muted hover:bg-muted/80 text-foreground transition-colors duration-200"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="切换主题"
    >
      <motion.div
        initial={false}
        animate={{ rotate: actualTheme === 'dark' ? 180 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {actualTheme === 'dark' ? (
          <span className="text-xl">🌙</span>
        ) : (
          <span className="text-xl">☀️</span>
        )}
      </motion.div>
    </motion.button>
  );
};
