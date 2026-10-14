import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss()
  ],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8083",
        changeOrigin: true,
      },
      "/products": {
        target: "http://localhost:8083",
        changeOrigin: true,
      },
      "/inventory": {
        target: "http://localhost:8083",
        changeOrigin: true,
      },
      "/recommendations": {
        target: "http://localhost:8083",
        changeOrigin: true,
      },
      "/actuator": {
        target: "http://localhost:8083",
        changeOrigin: true,
      },
    },
  },
})
