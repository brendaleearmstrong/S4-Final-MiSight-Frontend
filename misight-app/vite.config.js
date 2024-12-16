import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html')
      },
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor'
            }
            if (id.includes('@tanstack/react-query')) {
              return 'query-vendor'
            }
            if (id.includes('recharts')) {
              return 'chart-vendor'
            }
            if (id.includes('lucide-react')) {
              return 'ui-vendor'
            }
            return 'vendor'
          }
          if (id.includes('pages/dashboards')) {
            return 'dashboards'
          }
          if (id.includes('pages/Home')) {
            return 'home'
          }
        }
      }
    },
    sourcemap: true
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    include: ['src/**/*.{test,spec}.{js,jsx}']
  }
});