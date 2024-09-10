import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const API_URL ='https://mern-todo-backend-nine-sigma.vercel.app' 
 


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