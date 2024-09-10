import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import {env} from 'node:process'

const targetUrl = env.NODE_ENV === 'production'
  ? 'https://mern-todo-backend-nine-sigma.vercel.app/'
  : 'http://localhost:3000/'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
      server: {
      proxy: {
        '/api': {
          target:targetUrl,
              changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    }
})
