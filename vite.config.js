import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) return 'react';
            if (id.includes('@rainbow-me') || id.includes('wagmi') || id.includes('viem')) return 'wallet';
            if (id.includes('tailwind')) return 'tailwind';
            if (id.includes('dexscreener') || id.includes('coingecko')) return 'api';
            return 'vendor';
          }
        }
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom']
  }
})
