import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

const isProd = process.env.NODE_ENV === 'production'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // Workbox service worker generation is failing in this environment.
      // Disabling it for production builds keeps deploy builds reliable.
      disable: isProd,
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'logo.png', 'splash.png'],
      manifest: {
        name: 'Confier International',
        short_name: 'Confier',
        description: 'Premium shrimp feed supplements and biotechnology for sustainable aquaculture.',
        theme_color: '#005f73',
        background_color: '#005f73',
        display: 'standalone',
        icons: [
          {
            src: 'logo.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'logo.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})
