import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import {env} from 'node:process'

const isProd = env.NODE_ENV === 'production'
const targetUrl = isProd
  ? 'https://mern-todo-backend-nine-sigma.vercel.app/'
  : 'http://localhost:5173/'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: targetUrl,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
