import type { Config } from 'tailwindcss';

const tailwindTheme = {
  colors: {
    background: '#06070a',
    surface: '#0d0f14',
    card: '#111318',
    border: 'rgba(255, 255, 255, 0.07)',
    foreground: '#f0f2f7',
    muted: '#8892a4',
    
    primary: {
      light: '#3b82f6', // blue
      cyan: '#06b6d4',
      green: '#10d98a',
      purple: '#7C3AED',
      purpleDark: '#6D28D9',
    },
    
    success: '#10d98a',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
  
  spacing: {
    0: '0',
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    7: '28px',
    8: '32px',
    9: '36px',
    10: '40px',
    12: '48px',
    14: '56px',
    16: '64px',
    20: '80px',
    24: '96px',
    28: '112px',
    32: '128px',
    36: '144px',
    40: '160px',
    44: '176px',
    48: '192px',
    52: '208px',
    56: '224px',
    60: '240px',
    64: '256px',
    72: '288px',
    80: '320px',
    96: '384px',
  },
  
  borderRadius: {
    none: '0',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    '2xl': '20px',
    '3xl': '24px',
    full: '9999px',
  },
  
  extend: {
    boxShadow: {
      none: 'none',
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
      glow: {
        purple: '0 0 15px rgba(124, 58, 237, 0.3)',
        blue: '0 0 15px rgba(59, 130, 246, 0.3)',
        cyan: '0 0 15px rgba(6, 182, 212, 0.3)',
        green: '0 0 15px rgba(16, 217, 138, 0.3)',
      },
      cardHover: '0 20px 30px rgba(0, 0, 0, 0.2)',
    },
    zIndex: {
      hide: -1,
      base: 0,
      dropdown: 1000,
      sticky: 1100,
      fixed: 1200,
      backdrop: 1300,
      offcanvas: 1400,
      modal: 1500,
      popover: 1600,
      tooltip: 1700,
      notification: 1800,
      noise: 9999,
    },
  },
};

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  
  theme: {
    extend: tailwindTheme.extend,
    colors: tailwindTheme.colors,
    spacing: tailwindTheme.spacing,
    borderRadius: tailwindTheme.borderRadius,
  },
  
  plugins: [],
};

export default config;
