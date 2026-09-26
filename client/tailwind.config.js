/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        polar: {
          950: '#050B16',
          900: '#091325',
          850: '#0D1A33',
          800: '#122345',
          700: '#1B315B',
          600: '#264377',
          500: '#355998',
          400: '#527BBF',
          300: '#7B9FE0',
          200: '#AEC7F6',
          100: '#DCE7FC',
          50:  '#F0F5FE'
        },
        ice: {
          cyan: '#00E5FF',
          glow: '#38BDF8',
          deep: '#0284C7',
          light: '#E0F2FE',
          subtle: 'rgba(0, 229, 255, 0.08)'
        },
        alarm: {
          critical: '#EF4444',
          high: '#F97316',
          medium: '#F59E0B',
          low: '#3B82F6',
          nominal: '#10B981'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace']
      },
      boxShadow: {
        'polar-card': '0 4px 20px -2px rgba(2, 6, 23, 0.6), 0 0 0 1px rgba(56, 189, 248, 0.1)',
        'polar-glow': '0 0 15px rgba(0, 229, 255, 0.25)',
        'alert-glow': '0 0 15px rgba(239, 68, 68, 0.35)',
      }
    },
  },
  plugins: [],
}
