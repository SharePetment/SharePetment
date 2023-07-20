import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [react(), svgr()],
  server: {
    proxy: {
      '/proxy': {
        target: 'http://43.202.86.53:8080/',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/proxy/, ''),
        secure: false,
        ws: true,
      },
    },
  },
});
