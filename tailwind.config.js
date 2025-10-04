/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
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
      colors: {
        border: "var(--color-border)", /* slate-400/20 */
        input: "var(--color-input)", /* white */
        ring: "var(--color-ring)", /* blue-400 */
        background: "var(--color-background)", /* cream */
        foreground: "var(--color-foreground)", /* slate-900 */
        primary: {
          DEFAULT: "var(--color-primary)", /* blue-400 */
          foreground: "var(--color-primary-foreground)", /* white */
        },
        secondary: {
          DEFAULT: "var(--color-secondary)", /* violet-600 */
          foreground: "var(--color-secondary-foreground)", /* white */
        },
        destructive: {
          DEFAULT: "var(--color-destructive)", /* red-500 */
          foreground: "var(--color-destructive-foreground)", /* white */
        },
        muted: {
          DEFAULT: "var(--color-muted)", /* white/10 */
          foreground: "var(--color-muted-foreground)", /* slate-600 */
        },
        accent: {
          DEFAULT: "var(--color-accent)", /* yellow-300 */
          foreground: "var(--color-accent-foreground)", /* slate-900 */
        },
        popover: {
          DEFAULT: "var(--color-popover)", /* white */
          foreground: "var(--color-popover-foreground)", /* slate-900 */
        },
        card: {
          DEFAULT: "var(--color-card)", /* white */
          foreground: "var(--color-card-foreground)", /* slate-900 */
        },
        success: {
          DEFAULT: "var(--color-success)", /* emerald-500 */
          foreground: "var(--color-success-foreground)", /* white */
        },
        warning: {
          DEFAULT: "var(--color-warning)", /* amber-500 */
          foreground: "var(--color-warning-foreground)", /* white */
        },
        error: {
          DEFAULT: "var(--color-error)", /* red-500 */
          foreground: "var(--color-error-foreground)", /* white */
        },
      },
      fontFamily: {
        'heading': ['Nunito', 'sans-serif'], /* friendly rounded letterforms */
        'body': ['Inter', 'sans-serif'], /* optimized screen reading */
        'caption': ['Poppins', 'sans-serif'], /* geometric clarity */
        'mono': ['JetBrains Mono', 'monospace'], /* data alignment */
      },
      borderRadius: {
        lg: "12px", /* cards */
        md: "8px", /* buttons */
        sm: "6px", /* form inputs */
      },
      boxShadow: {
        'soft': '0 1px 3px rgba(0,0,0,0.1)', /* cards */
        'medium': '0 4px 6px rgba(0,0,0,0.1)', /* modals */
        'floating': '0 10px 15px rgba(0,0,0,0.1)', /* floating elements */
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.2s ease-out",
        "slide-in": "slide-in 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        "bounce-gentle": "bounce-gentle 0.6s ease-in-out",
        "spin-slow": "spin 3s linear infinite",
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
        "fade-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
        "bounce-gentle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      spacing: {
        '18': '4.5rem', /* 72px */
        '88': '22rem', /* 352px */
      },
      minHeight: {
        '44': '44px', /* touch target minimum */
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
}