import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/social-media-app2/',
  plugins: [react()],
  server: {
    port: 5137,
    open: true,
  },
});
