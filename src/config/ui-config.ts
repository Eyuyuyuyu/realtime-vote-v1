/**
 * 统一的 UI 配置文件
 * 包含主题配色、字体、间距等设计规范
 */

export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  auxiliary: string;
  background: string;
  foreground: string;
  muted: string;
  border: string;
  destructive: string;
  success: string;
  warning: string;
}

export interface ButtonColors {
  confirm: {
    background: string;
    foreground: string;
    hover: string;
  };
  delete: {
    background: string;
    foreground: string;
    hover: string;
  };
  cancel: {
    background: string;
    foreground: string;
    hover: string;
  };
}

export interface UIConfig {
  colors: {
    light: ColorScheme;
    dark: ColorScheme;
  };
  buttons: {
    light: ButtonColors;
    dark: ButtonColors;
  };
  fonts: {
    sans: string[];
    mono: string[];
  };
  fontSize: {
    base: string;
    sm: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

// 浅色模式配色
const lightColors: ColorScheme = {
  primary: '#b1f8f2',      // 主色：青绿色
  secondary: '#bcd39c',    // 次色：绿色
  accent: '#fffc99',       // 高亮色：黄色
  auxiliary: '#eafdcf',    // 辅助色：浅绿色
  background: '#ffffff',   // 背景色：白色
  foreground: '#000000',   // 字体颜色：黑色
  muted: '#f5f5f5',       // 次要文本颜色
  border: '#e5e5e5',      // 边框颜色
  destructive: '#ff4d4f',  // 危险色：红色
  success: '#52c41a',     // 成功色：绿色
  warning: '#faad14',     // 警告色：橙色
};

// 暗色模式配色（降低亮度，减少刺眼感）
const darkColors: ColorScheme = {
  primary: '#81d9d4',      // 主色调暗
  secondary: '#9bb47c',    // 次色调暗
  accent: '#d1cc80',       // 高亮色调暗
  auxiliary: '#c2dfb0',    // 辅助色调暗
  background: '#1a1a1a',   // 暗色背景
  foreground: '#f5f5f5',   // 浅色字体
  muted: '#a0a0a0',       // 次要文本颜色
  border: '#404040',      // 边框颜色
  destructive: '#cc3b3d',  // 危险色调暗
  success: '#42a518',     // 成功色调暗
  warning: '#d18b12',     // 警告色调暗
};

// 浅色模式按钮配色
const lightButtons: ButtonColors = {
  confirm: {
    background: lightColors.primary,
    foreground: '#000000',
    hover: '#9ef0ea',
  },
  delete: {
    background: lightColors.destructive,
    foreground: '#ffffff',
    hover: '#ff7875',
  },
  cancel: {
    background: '#d9d9d9',
    foreground: '#000000',
    hover: '#c5c5c5',
  },
};

// 暗色模式按钮配色
const darkButtons: ButtonColors = {
  confirm: {
    background: darkColors.primary,
    foreground: '#000000',
    hover: '#6fcac4',
  },
  delete: {
    background: darkColors.destructive,
    foreground: '#ffffff',
    hover: '#a52d2f',
  },
  cancel: {
    background: '#555555',
    foreground: '#ffffff',
    hover: '#404040',
  },
};

// 完整的 UI 配置
export const uiConfig: UIConfig = {
  colors: {
    light: lightColors,
    dark: darkColors,
  },
  buttons: {
    light: lightButtons,
    dark: darkButtons,
  },
  fonts: {
    sans: [
      'ui-sans-serif',
      'system-ui',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'Helvetica Neue',
      'Arial',
      'Noto Sans',
      'sans-serif',
    ],
    mono: [
      'ui-monospace',
      'SFMono-Regular',
      'Menlo',
      'Monaco',
      'Consolas',
      'Liberation Mono',
      'Courier New',
      'monospace',
    ],
  },
  fontSize: {
    base: '16px',
    sm: '14px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
    '4xl': '36px',
  },
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
  },
  borderRadius: {
    sm: '0.125rem',  // 2px
    md: '0.375rem',  // 6px
    lg: '0.5rem',    // 8px
    xl: '0.75rem',   // 12px
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },
};

// 工具函数：获取当前主题的颜色
export const getThemeColors = (isDark: boolean): ColorScheme => {
  return isDark ? uiConfig.colors.dark : uiConfig.colors.light;
};

// 工具函数：获取当前主题的按钮颜色
export const getThemeButtons = (isDark: boolean): ButtonColors => {
  return isDark ? uiConfig.buttons.dark : uiConfig.buttons.light;
};

// CSS 变量名映射
export const cssVariables = {
  light: {
    '--color-primary': lightColors.primary,
    '--color-secondary': lightColors.secondary,
    '--color-accent': lightColors.accent,
    '--color-auxiliary': lightColors.auxiliary,
    '--color-background': lightColors.background,
    '--color-foreground': lightColors.foreground,
    '--color-muted': lightColors.muted,
    '--color-border': lightColors.border,
    '--color-destructive': lightColors.destructive,
    '--color-success': lightColors.success,
    '--color-warning': lightColors.warning,
    '--btn-confirm-bg': lightButtons.confirm.background,
    '--btn-confirm-fg': lightButtons.confirm.foreground,
    '--btn-confirm-hover': lightButtons.confirm.hover,
    '--btn-delete-bg': lightButtons.delete.background,
    '--btn-delete-fg': lightButtons.delete.foreground,
    '--btn-delete-hover': lightButtons.delete.hover,
    '--btn-cancel-bg': lightButtons.cancel.background,
    '--btn-cancel-fg': lightButtons.cancel.foreground,
    '--btn-cancel-hover': lightButtons.cancel.hover,
  },
  dark: {
    '--color-primary': darkColors.primary,
    '--color-secondary': darkColors.secondary,
    '--color-accent': darkColors.accent,
    '--color-auxiliary': darkColors.auxiliary,
    '--color-background': darkColors.background,
    '--color-foreground': darkColors.foreground,
    '--color-muted': darkColors.muted,
    '--color-border': darkColors.border,
    '--color-destructive': darkColors.destructive,
    '--color-success': darkColors.success,
    '--color-warning': darkColors.warning,
    '--btn-confirm-bg': darkButtons.confirm.background,
    '--btn-confirm-fg': darkButtons.confirm.foreground,
    '--btn-confirm-hover': darkButtons.confirm.hover,
    '--btn-delete-bg': darkButtons.delete.background,
    '--btn-delete-fg': darkButtons.delete.foreground,
    '--btn-delete-hover': darkButtons.delete.hover,
    '--btn-cancel-bg': darkButtons.cancel.background,
    '--btn-cancel-fg': darkButtons.cancel.foreground,
    '--btn-cancel-hover': darkButtons.cancel.hover,
  },
};

export default uiConfig;
