/**
 * MSSquare Design Tokens
 * Single source of truth for all design system values
 * Exported for TypeScript type safety and component usage
 */

// ═══════════════════════════════════════════════════════════
// COLORS
// ═══════════════════════════════════════════════════════════

export const COLORS = {
  // Backgrounds
  background: '#06070a',
  surface: '#0d0f14',
  card: '#111318',
  
  // Text
  foreground: '#f0f2f7',
  muted: '#8892a4',
  
  // Borders
  border: 'rgba(255, 255, 255, 0.07)',
  borderLight: 'rgba(255, 255, 255, 0.12)',
  
  // Primary Colors
  primary: {
    blue: '#3b82f6',
    cyan: '#06b6d4',
    green: '#10d98a',
    purple: '#7C3AED',
    purpleDark: '#6D28D9',
  },
  
  // Status Colors
  success: '#10d98a',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  
  // Light mode (for landing page sections)
  light: {
    background: '#ffffff',
    foreground: '#1f2937',
    surface: '#f9fafb',
    border: 'rgba(0, 0, 0, 0.1)',
    text: {
      primary: '#0F172A',      // slate-950 - primary text on light backgrounds
      secondary: '#334155',    // slate-700 - secondary text/labels
      muted: '#94A3B8',        // slate-400 - muted/placeholder text
    },
  },
} as const;

// ═══════════════════════════════════════════════════════════
// TYPOGRAPHY
// ═══════════════════════════════════════════════════════════

export const TYPOGRAPHY = {
  fontFamily: {
    sans: "var(--font-urbanist), ui-sans-serif, system-ui, sans-serif",
    heading: "var(--font-urbanist), ui-sans-serif, system-ui, sans-serif",
  },
  
  fontWeight: {
    regular: 400,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },
  
  fontSize: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
    '4xl': '36px',
    '5xl': '48px',
    '6xl': '60px',
    '7xl': '72px',
  },
  
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.625,
    loose: 1.75,
  },
  
  letterSpacing: {
    tight: '-0.02em',
    normal: '0em',
    wide: '0.05em',
    wider: '0.1em',
  },
} as const;

// ═══════════════════════════════════════════════════════════
// SPACING (8px scale)
// ═══════════════════════════════════════════════════════════

export const SPACING = {
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
} as const;

// ═══════════════════════════════════════════════════════════
// BORDER RADIUS
// ═══════════════════════════════════════════════════════════

export const BORDER_RADIUS = {
  none: '0',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '20px',
  '3xl': '24px',
  full: '9999px',
} as const;

// ═══════════════════════════════════════════════════════════
// SHADOWS
// ═══════════════════════════════════════════════════════════

export const SHADOWS = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
  
  // Brand glows
  glow: {
    purple: '0 0 15px rgba(124, 58, 237, 0.3)',
    blue: '0 0 15px rgba(59, 130, 246, 0.3)',
    cyan: '0 0 15px rgba(6, 182, 212, 0.3)',
    green: '0 0 15px rgba(16, 217, 138, 0.3)',
  },
  
  // Card hover effects
  cardHover: '0 20px 30px rgba(0, 0, 0, 0.2)',
} as const;

// ═══════════════════════════════════════════════════════════
// Z-INDEX SCALE
// ═══════════════════════════════════════════════════════════

export const Z_INDEX = {
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
  noise: 9999, // Noise overlay
} as const;

// ═══════════════════════════════════════════════════════════
// ANIMATIONS & TRANSITIONS
// ═══════════════════════════════════════════════════════════

export const ANIMATIONS = {
  // Timing functions
  easing: {
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    bounce: 'cubic-bezier(0.22, 1, 0.36, 1)',
  },
  
  // Durations (ms)
  duration: {
    fast: 150,
    base: 300,
    slow: 500,
    slower: 700,
  },
  
  // Named animations (from globals.css)
  keyframes: {
    fup: 'fup 0.75s ease both',
    wrise: 'wrise 0.6s cubic-bezier(0.22, 1, 0.36, 1) both',
    accentin: 'accentin 0.7s ease both',
    gradflow: 'gradflow 5s ease infinite',
    blink: 'blink 1.8s ease-in-out infinite',
    sdown: 'sdown 1.9s ease-in-out infinite',
    barg: 'barg 1.6s ease both',
    pulseGlow: 'pulse-glow 2s ease-in-out infinite',
  },
} as const;

// ═══════════════════════════════════════════════════════════
// BREAKPOINTS
// ═══════════════════════════════════════════════════════════

export const BREAKPOINTS = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// ═══════════════════════════════════════════════════════════
// CONTAINER SIZES
// ═══════════════════════════════════════════════════════════

export const CONTAINERS = {
  xs: '320px',
  sm: '384px',
  md: '448px',
  lg: '512px',
  xl: '576px',
  '2xl': '672px',
  '3xl': '768px',
  '4xl': '896px',
  '5xl': '1024px',
  '6xl': '1152px',
  '7xl': '1280px',
  full: '100%',
} as const;

// ═══════════════════════════════════════════════════════════
// COMPONENT-SPECIFIC DEFAULTS
// ═══════════════════════════════════════════════════════════

export const COMPONENTS = {
  button: {
    borderRadius: BORDER_RADIUS['2xl'],
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    padding: {
      sm: `${SPACING[2]} ${SPACING[4]}`,
      md: `${SPACING[3]} ${SPACING[6]}`,
      lg: `${SPACING[4]} ${SPACING[8]}`,
      xl: `${SPACING[4]} ${SPACING[10]}`,
    },
  },
  
  input: {
    borderRadius: BORDER_RADIUS['2xl'],
    fontSize: TYPOGRAPHY.fontSize.base,
    padding: `${SPACING[3]} ${SPACING[4]}`,
  },
  
  card: {
    borderRadius: BORDER_RADIUS['3xl'],
    padding: SPACING[6],
    shadow: SHADOWS.lg,
  },
  
  section: {
    paddingY: SPACING[20],
    paddingX: SPACING[4],
  },
} as const;

// ═══════════════════════════════════════════════════════════
// EXPORT AS TAILWIND CONFIG
// ═══════════════════════════════════════════════════════════

export const tailwindTheme = {
  colors: {
    background: COLORS.background,
    surface: COLORS.surface,
    card: COLORS.card,
    border: COLORS.border,
    foreground: COLORS.foreground,
    muted: COLORS.muted,
    
    primary: {
      light: COLORS.primary.blue,
      cyan: COLORS.primary.cyan,
      green: COLORS.primary.green,
      purple: COLORS.primary.purple,
      purpleDark: COLORS.primary.purpleDark,
    },
    
    success: COLORS.success,
    warning: COLORS.warning,
    error: COLORS.error,
    info: COLORS.info,
    
    light: COLORS.light,
  },
  
  spacing: SPACING,
  borderRadius: BORDER_RADIUS,
  
  extend: {
    boxShadow: SHADOWS,
    zIndex: Z_INDEX,
  },
} as const;
