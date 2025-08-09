export interface ThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    muted: string;
    border: string;
  };
  fonts: {
    sans: string[];
    mono: string[];
  };
  spacing: {
    container: string;
    section: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

export const lightTheme: ThemeConfig = {
  colors: {
    primary: "#fa8029",
    secondary: "#f7f7f7",
    accent: "#fa8029",
    background: "#ffffff",
    foreground: "#1f2124",
    muted: "#6b7280",
    border: "#e5e7eb",
  },
  fonts: {
    sans: [
      "General Sans",
      "ui-sans-serif",
      "system-ui", 
      "-apple-system",
      "BlinkMacSystemFont",
      "Segoe UI",
      "Roboto",
      "Helvetica Neue",
      "Arial",
      "Noto Sans",
      "sans-serif"
    ],
    mono: [
      "ui-monospace",
      "SFMono-Regular",
      "Menlo",
      "Monaco",
      "Consolas",
      "Liberation Mono",
      "Courier New",
      "monospace"
    ],
  },
  spacing: {
    container: "1rem",
    section: "2rem",
  },
  borderRadius: {
    sm: "0.125rem",
    md: "0.375rem", 
    lg: "0.5rem",
    xl: "0.75rem",
  },
};

export const darkTheme: ThemeConfig = {
  colors: {
    primary: "#f97316",
    secondary: "#374151",
    accent: "#f97316",
    background: "#1f2124",
    foreground: "#ffffff",
    muted: "#9ca3af",
    border: "#374151",
  },
  fonts: lightTheme.fonts,
  spacing: lightTheme.spacing,
  borderRadius: lightTheme.borderRadius,
};

export const themeConfig = {
  light: lightTheme,
  dark: darkTheme,
};

export type Theme = keyof typeof themeConfig;
