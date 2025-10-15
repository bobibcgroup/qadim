import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Qadim Design System Colors
        bg: "#0E0E0C",
        card: "#1B1A17",
        ink: "#EDE7D9",
        accent: "#C2A878",
        accentSoft: "#998A63",
        official: "#5AC18E",
        claim: "#CC6655",
        muted: "#9C9887",
        
        // Legacy Next.js colors for compatibility
        background: "#0E0E0C",
        foreground: "#EDE7D9",
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      borderRadius: {
        'qadim': '18px',
      },
      transitionDuration: {
        'qadim': '150ms',
      },
      boxShadow: {
        'qadim': '0 0 20px rgba(194, 168, 120, 0.3)',
        'qadim-soft': '0 0 10px rgba(194, 168, 120, 0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.15s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glow: {
          '0%': { boxShadow: '0 0 10px rgba(194, 168, 120, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(194, 168, 120, 0.4)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
export default config;
