/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',
        primary_600: '#1D4ED8',
        accent: '#FBBF24',
        success: '#16A34A',
        danger: '#DC2626',
        warning: '#F59E0B',
        background_light: '#FFFFFF',
        background_dark: '#1E293B',
        text_light: '#F9FAFB',
        text_dark: '#111827',
        neutral_100: '#F3F4F6',
        neutral_900: '#111827',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', "'Segoe UI'", 'Roboto', "'Helvetica Neue'", 'Arial'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace'],
      },
      fontSize: {
        h1: ['32px', { lineHeight: '1.2' }],
        h2: ['24px', { lineHeight: '1.2' }],
        h3: ['20px', { lineHeight: '1.2' }],
        body: ['16px', { lineHeight: '1.5' }],
        small: ['13px', { lineHeight: '1.5' }],
      },
      spacing: {
        4: '4px',
        8: '8px',
        12: '12px',
        16: '16px',
        20: '20px',
        24: '24px',
        32: '32px',
        40: '40px',
        48: '48px',
      },
      borderRadius: {
        small: '6px',
        default: '8px',
        large: '16px',
      },
      boxShadow: {
        sm: '0 1px 3px rgba(0,0,0,0.08)',
        md: '0 4px 12px rgba(0,0,0,0.12)',
        lg: '0 10px 30px rgba(0,0,0,0.18)',
      },
      animation: {
        fast: '120ms',
        normal: '300ms',
        slow: '500ms',
        confetti: '1500ms',
      },
      transitionTimingFunction: {
        standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
        accelerate: 'cubic-bezier(0.2, 0, 0, 1)',
        decelerate: 'cubic-bezier(0, 0, 0.2, 1)',
      },
      micro_interactions: {
        hover_lift: { scale: 1.02, duration: 120 },
        click_ripple: { duration: 200 },
        toast_slide: { duration: 300 },
        modal_open: { duration: 300, easing: 'standard' },
      },
      screens: {
        mobile: '0px',
        tablet: '768px',
        desktop: '1024px',
        wide: '1440px',
      },
      accessibility_tokens: {
        focus_ring: { width: '3px', color: '#2563EB', offset: '2px' },
        min_contrast_ratio_text: 4.5,
        min_contrast_ratio_ui: 3.0,
      },
    },
  },
  plugins: [],
};