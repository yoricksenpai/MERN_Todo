import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const isProd = import.meta.env.PROD // Vite fournit PROD, qui est true en production
const API_URL = isProd 
  ? 'https://mern-todo-backend-nine-sigma.vercel.app' 
  : 'http://localhost:3000'


export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: API_URL,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
