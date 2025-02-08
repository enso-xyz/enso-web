import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      borderRadius: {
        none: '0',
        sm: '0.125rem',
        DEFAULT: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        full: '9999px',
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        glow: "color-mix(in srgb, var(--glow-color) calc(<alpha-value> * 100%), transparent)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      typography: {
        DEFAULT: {
          css: {
            color: 'rgb(255 255 255 / 0.8)',
            a: {
              color: 'rgb(96 165 250)',
              '&:hover': {
                color: 'rgb(147 197 253)',
              },
            },
            strong: {
              color: 'rgb(255 255 255 / 0.9)',
            },
            'ol > li::marker': {
              color: 'rgb(255 255 255 / 0.4)',
            },
            'ul > li::marker': {
              color: 'rgb(255 255 255 / 0.4)',
            },
            hr: {
              borderColor: 'rgb(255 255 255 / 0.1)',
            },
            blockquote: {
              borderLeftColor: 'rgb(255 255 255 / 0.1)',
              color: 'rgb(255 255 255 / 0.6)',
            },
            h1: {
              color: 'rgb(255 255 255 / 0.9)',
            },
            h2: {
              color: 'rgb(255 255 255 / 0.9)',
            },
            h3: {
              color: 'rgb(255 255 255 / 0.9)',
            },
            h4: {
              color: 'rgb(255 255 255 / 0.9)',
            },
            'figure figcaption': {
              color: 'rgb(255 255 255 / 0.6)',
            },
            code: {
              color: 'rgb(255 255 255 / 0.8)',
            },
            'a code': {
              color: 'rgb(96 165 250)',
            },
            pre: {
              backgroundColor: 'rgb(255 255 255 / 0.03)',
              color: 'rgb(255 255 255 / 0.8)',
            },
            thead: {
              borderBottomColor: 'rgb(255 255 255 / 0.1)',
            },
            'tbody tr': {
              borderBottomColor: 'rgb(255 255 255 / 0.05)',
            },
          },
        },
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require('@tailwindcss/typography'),
    plugin(function({ addUtilities, matchUtilities, theme }) {
      addUtilities({
        ".glow-sm": {
          "--glow-size": "15rem",
        },
        ".glow-md": {
          "--glow-size": "25rem",
        },
        ".glow-lg": {
          "--glow-size": "35rem",
        },
      })

      // Add glow variants
      matchUtilities(
        {
          glow: (value) => ({
            "--glow-opacity": value,
          }),
        },
        { values: theme("opacity") }
      )
    }),
  ],
} satisfies Config;
