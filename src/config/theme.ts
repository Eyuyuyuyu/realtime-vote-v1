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
    primary: "hsl(221.2 83.2% 53.3%)",
    secondary: "hsl(210 40% 96%)",
    accent: "hsl(210 40% 96%)",
    background: "hsl(0 0% 100%)",
    foreground: "hsl(222.2 84% 4.9%)",
    muted: "hsl(210 40% 96%)",
    border: "hsl(214.3 31.8% 91.4%)",
  },
  fonts: {
    sans: [
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
    primary: "hsl(217.2 91.2% 59.8%)",
    secondary: "hsl(217.2 32.6% 17.5%)",
    accent: "hsl(217.2 32.6% 17.5%)",
    background: "hsl(222.2 84% 4.9%)",
    foreground: "hsl(210 40% 98%)",
    muted: "hsl(217.2 32.6% 17.5%)",
    border: "hsl(217.2 32.6% 17.5%)",
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
