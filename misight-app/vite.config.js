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
  server: {
    port: 5173,
    open: true,
  },
  optimizeDeps: {
    include: ['react', 'react-dom']
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html')
    }
  },
  // Add test configuration
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.cjs',
    css: true,
    deps: {
      inline: ['vitest-canvas-mock'],
    },
    include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
  }
})