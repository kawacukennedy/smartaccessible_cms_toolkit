export const colors = {
  primary: '#2563EB',
  primary600: '#1D4ED8',
  accent: '#FBBF24',
  success: '#16A34A',
  danger: '#DC2626',
  warning: '#F59E0B',
  neutral100: '#F3F4F6',
  neutral900: '#111827',
};

export const typography = {
  fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
  sizes: {
    h1: 32,
    h2: 24,
    h3: 20,
    body: 16,
    small: 13,
  },
  lineHeights: {
    body: 1.5,
    headings: 1.2,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
  massive: 48,
};

export const borderRadius = {
  small: 6,
  default: 8,
  large: 16,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 30,
    elevation: 10,
  },
};

export const animations = {
  durations: {
    fast: 120,
    normal: 300,
    slow: 500,
    confetti: 1500,
  },
  easing: {
    standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
    accelerate: 'cubic-bezier(0.2, 0, 0, 1)',
    decelerate: 'cubic-bezier(0, 0, 0.2, 1)',
  },
  microInteractions: {
    hoverLift: { scale: 1.02, duration: 120 },
    clickRipple: { duration: 200 },
    toastSlide: { duration: 300 },
    modalOpen: { duration: 300, easing: 'standard' },
  },
};

export const accessibility = {
  focusRing: {
    width: 3,
    color: '#2563EB',
    offset: 2,
  },
  minContrastRatio: {
    text: 4.5,
    ui: 3.0,
  },
};

export const grid = {
  columns: 12,
  gutter: '16px',
  maxWidth: '1400px',
};