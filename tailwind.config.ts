import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['"Plus Jakarta Sans"', 'sans-serif'],
        headline: ['"Plus Jakarta Sans"', 'sans-serif'],
        label: ['"Plus Jakarta Sans"', 'sans-serif'],
        code: ['monospace'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
        // Custom Palette from user
        "outline": "#958da1",
        "on-secondary": "#272377",
        "on-tertiary-fixed-variant": "#713700",
        "on-surface": "#dbe2fd",
        "surface-container-highest": "#2d3449",
        "on-secondary-fixed": "#100563",
        "surface-variant": "#2d3449",
        "surface-bright": "#31394e",
        "on-secondary-container": "#afadff",
        "on-primary-fixed": "#25005a",
        "tertiary-container": "#a15100",
        "on-error-container": "#ffdad6",
        "primary-container": "#7c3aed",
        "on-secondary-fixed-variant": "#3e3c8f",
        "inverse-surface": "#dbe2fd",
        "surface-container-low": "#131b2e",
        "on-primary-fixed-variant": "#5a00c6",
        "error": "#ffb4ab",
        "on-surface-variant": "#ccc3d8",
        "on-background": "#dbe2fd",
        "primary-fixed": "#eaddff",
        "surface": "#0b1326",
        "error-container": "#93000a",
        "surface-dim": "#0b1326",
        "on-tertiary-fixed": "#301400",
        "on-tertiary": "#4f2500",
        "secondary-fixed": "#e2dfff",
        "inverse-primary": "#732ee4",
        "tertiary-fixed-dim": "#ffb784",
        "on-tertiary-container": "#ffe0cd",
        "tertiary": "#ffb784",
        "on-primary": "#3f008e",
        "on-error": "#690005",
        "secondary-container": "#3e3c8f",
        "primary-fixed-dim": "#d2bbff",
        "tertiary-fixed": "#ffdcc6",
        "surface-container-lowest": "#060d20",
        "outline-variant": "#4a4455",
        "surface-tint": "#d2bbff",
        "on-primary-container": "#ede0ff",
        "surface-container-high": "#222a3e",
        "inverse-on-surface": "#283044",
        "secondary-fixed-dim": "#c3c0ff",
        "surface-container": "#171f33",
      },
      borderRadius: {
        xl: "0.75rem",
        lg: "0.5rem",
        md: "calc(0.5rem - 2px)",
        sm: "calc(0.5rem - 4px)",
        DEFAULT: "0.25rem",
        full: "9999px",
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        'gassy-flow': {
          '0%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
          '100%': { 'background-position': '0% 50%' },
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'gassy-flow': 'gassy-flow 15s ease infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
