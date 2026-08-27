import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Code splitting configuration
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'vendor-react';
            }
            if (id.includes('three') || id.includes('@react-three')) {
              return 'vendor-three';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-lucide';
            }
            return 'vendor';
          }

          // Feature chunks - loaded on demand
          if (id.includes('ProductViewer')) {
            return 'product-viewer';
          }
          if (id.includes('Checkout')) {
            return 'checkout';
          }
          if (id.includes('Auth')) {
            return 'auth';
          }
          if (id.includes('Account')) {
            return 'account';
          }
          if (id.includes('ProductDetail')) {
            return 'product-detail';
          }
        },
      },
    },
    // CSS code splitting
    cssCodeSplit: true,
    // Source maps for production debugging
    sourcemap: false,
    // Module preload polyfill
    modulePreload: {
      polyfill: true,
    },
    // Use default minifier (rolldown)
    // minify: 'esbuild', // requires esbuild package
  },
  // Optimize deps
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'lucide-react'],
    exclude: ['@react-three/fiber', '@react-three/drei', 'three'],
  },
  // Server config for development
  server: {
    port: 5173,
    host: true,
  },
  // Preview server
  preview: {
    port: 4173,
    host: true,
  },
})