
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api-health/product': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: () => '/actuator/health',
      },
      '/api-health/inventory': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        rewrite: () => '/actuator/health',
      },

      '/api-health/recommendation': {
        target: 'http://localhost:8082',
        changeOrigin: true,
        rewrite: () => '/actuator/health',
      },

      '/api-monitoring': {
        target: 'http://localhost:8083',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-monitoring/, '/api/monitoring'),
      },

      '/api-prometheus': {
        target: 'http://localhost:9090',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-prometheus/, ''),
      },


      '/api-recommendation': {
        target: 'http://localhost:8082',
        changeOrigin: true,
        rewrite: (path) =>
          path.replace(/^\/api-recommendation/, ''),
      },


    },
  },
})
