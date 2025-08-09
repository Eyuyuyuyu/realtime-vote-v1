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
  // 表格相关颜色
  tableHeader: string;
  tableRow: string;
  tableRowHover: string;
  tableBorder: string;
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
  primary: '#fa8029',      // 主色：亮橙色
  secondary: '#f7f7f7',    // 次色：淡灰色（次级背景）
  accent: '#fa8029',       // 高亮色：橙色
  auxiliary: '#ffffff',    // 辅助色：纯白色
  background: '#ffffff',   // 背景色：白色
  foreground: '#1f2124',   // 字体颜色：深灰蓝
  muted: '#6b7280',       // 次要文本颜色
  border: '#e5e7eb',      // 边框颜色
  destructive: '#ef4444',  // 危险色：红色
  success: '#10b981',     // 成功色：绿色
  warning: '#f59e0b',     // 警告色：琥珀色
  // 表格相关颜色
  tableHeader: '#f7f7f7',  // 表头背景：淡灰色
  tableRow: '#ffffff',     // 表格行背景：白色
  tableRowHover: '#f9fafb', // 表格行悬停：极浅灰色
  tableBorder: '#e5e7eb',  // 表格边框：灰色
};

// 暗色模式配色（降低亮度，减少刺眼感）
const darkColors: ColorScheme = {
  primary: '#f97316',      // 主色：橙色（暗色模式调整）
  secondary: '#374151',    // 次色：深灰色（次级背景）
  accent: '#f97316',       // 高亮色：橙色
  auxiliary: '#1f2124',    // 辅助色：深灰蓝
  background: '#1f2124',   // 暗色背景：深灰蓝
  foreground: '#ffffff',   // 浅色字体：纯白
  muted: '#9ca3af',       // 次要文本颜色
  border: '#374151',      // 边框颜色
  destructive: '#ef4444',  // 危险色：红色
  success: '#10b981',     // 成功色：绿色
  warning: '#f59e0b',     // 警告色：琥珀色
  // 表格相关颜色
  tableHeader: '#374151',  // 表头背景：深灰色
  tableRow: '#1f2124',     // 表格行背景：深色
  tableRowHover: '#374151', // 表格行悬停：中深灰色
  tableBorder: '#4b5563',  // 表格边框：中灰色
};

// 浅色模式按钮配色
const lightButtons: ButtonColors = {
  confirm: {
    background: lightColors.primary,
    foreground: '#ffffff',
    hover: '#ea580c',
  },
  delete: {
    background: lightColors.destructive,
    foreground: '#ffffff',
    hover: '#dc2626',
  },
  cancel: {
    background: '#e5e7eb',
    foreground: '#374151',
    hover: '#d1d5db',
  },
};

// 暗色模式按钮配色
const darkButtons: ButtonColors = {
  confirm: {
    background: darkColors.primary,
    foreground: '#ffffff',
    hover: '#ea580c',
  },
  delete: {
    background: darkColors.destructive,
    foreground: '#ffffff',
    hover: '#dc2626',
  },
  cancel: {
    background: '#4b5563',
    foreground: '#ffffff',
    hover: '#374151',
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
      'General Sans',
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
    sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
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
    '--table-header': lightColors.tableHeader,
    '--table-row': lightColors.tableRow,
    '--table-row-hover': lightColors.tableRowHover,
    '--table-border': lightColors.tableBorder,
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
    '--table-header': darkColors.tableHeader,
    '--table-row': darkColors.tableRow,
    '--table-row-hover': darkColors.tableRowHover,
    '--table-border': darkColors.tableBorder,
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
