import { uiConfig } from './src/config/ui-config';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // 自定义颜色系统
      colors: {
        // 主色系
        primary: {
          DEFAULT: "var(--color-primary)",
          foreground: "var(--color-foreground)",
        },
        secondary: {
          DEFAULT: "var(--color-secondary)",
          foreground: "var(--color-foreground)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          foreground: "var(--color-foreground)",
        },
        auxiliary: "var(--color-auxiliary)",
        
        // 基础颜色
        background: "var(--color-background)",
        foreground: "var(--color-foreground)",
        muted: {
          DEFAULT: "var(--color-muted)",
          foreground: "var(--color-foreground)",
        },
        border: "var(--color-border)",
        
        // 状态颜色
        destructive: {
          DEFAULT: "var(--color-destructive)",
          foreground: "#ffffff",
        },
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        
        // 按钮颜色
        btn: {
          confirm: {
            DEFAULT: "var(--btn-confirm-bg)",
            foreground: "var(--btn-confirm-fg)",
            hover: "var(--btn-confirm-hover)",
          },
          delete: {
            DEFAULT: "var(--btn-delete-bg)",
            foreground: "var(--btn-delete-fg)",
            hover: "var(--btn-delete-hover)",
          },
          cancel: {
            DEFAULT: "var(--btn-cancel-bg)",
            foreground: "var(--btn-cancel-fg)",
            hover: "var(--btn-cancel-hover)",
          },
        },
        
        // Shadcn UI 兼容性颜色
        input: "var(--color-border)",
        ring: "var(--color-primary)",
        popover: {
          DEFAULT: "var(--color-background)",
          foreground: "var(--color-foreground)",
        },
        card: {
          DEFAULT: "var(--color-background)",
          foreground: "var(--color-foreground)",
        },
        
        // 表格颜色
        table: {
          header: "var(--table-header)",
          row: "var(--table-row)",
          "row-hover": "var(--table-row-hover)",
          border: "var(--table-border)",
        },
      },
      
      // 字体系统
      fontFamily: {
        sans: uiConfig.fonts.sans,
        mono: uiConfig.fonts.mono,
      },
      
      // 字号系统
      fontSize: {
        xs: ['12px', '16px'],
        sm: [uiConfig.fontSize.sm, '20px'],
        base: [uiConfig.fontSize.base, '24px'],
        lg: [uiConfig.fontSize.lg, '28px'],
        xl: [uiConfig.fontSize.xl, '28px'],
        '2xl': [uiConfig.fontSize['2xl'], '32px'],
        '3xl': [uiConfig.fontSize['3xl'], '36px'],
        '4xl': [uiConfig.fontSize['4xl'], '40px'],
      },
      
      // 间距系统
      spacing: {
        xs: uiConfig.spacing.xs,
        sm: uiConfig.spacing.sm,
        md: uiConfig.spacing.md,
        lg: uiConfig.spacing.lg,
        xl: uiConfig.spacing.xl,
        '2xl': uiConfig.spacing['2xl'],
      },
      
      // 圆角系统
      borderRadius: {
        sm: uiConfig.borderRadius.sm,
        md: uiConfig.borderRadius.md,
        lg: uiConfig.borderRadius.lg,
        xl: uiConfig.borderRadius.xl,
        full: uiConfig.borderRadius.full,
      },
      
      // 阴影系统
      boxShadow: {
        sm: uiConfig.shadows.sm,
        md: uiConfig.shadows.md,
        lg: uiConfig.shadows.lg,
        xl: uiConfig.shadows.xl,
      },
      
      // 动画
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-up": {
          from: { transform: "translateY(10px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
      },
    },
  },
  plugins: [],
}
