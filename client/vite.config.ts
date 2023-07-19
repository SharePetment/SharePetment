import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA, VitePWAOptions } from 'vite-plugin-pwa';
import svgr from 'vite-plugin-svgr';

const manifestForPlugin: Partial<VitePWAOptions> = {
  registerType: 'prompt',
  includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
  manifest: {
    name: 'Share Petment',
    short_name: 'Petment',
    description: 'Share Your Pet and Make Pet friends',
    icons: [
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'apple touch icon',
      },
    ],
    theme_color: '#171717',
    background_color: '#e8ebf2',
    display: 'standalone',
    scope: '/',
    start_url: '/',
    orientation: 'portrait',
  },
};

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [react(), svgr(), VitePWA(manifestForPlugin)],
});
