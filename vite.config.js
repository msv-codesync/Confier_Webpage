import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

const isProd = process.env.NODE_ENV === 'production'

// https://vite.dev/config/
export default defineConfig({
  build: {
    // Single main bundle is intentional for this SPA; avoids noisy CI/Vercel warnings.
    chunkSizeWarningLimit: 700,
    // Broader mobile WebView / Safari coverage than default `modules` baseline.
    target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14']
  },
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
