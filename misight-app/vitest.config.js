// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/setupTests.js',
        include: ['src/**/*.{test,spec}.{js,jsx}'],
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
});