import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  return {
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY || env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY || env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@components': path.resolve(__dirname, 'src/components'),
        '@services': path.resolve(__dirname, 'src/services'),
        '@hooks': path.resolve(__dirname, 'src/hooks'),
        '@types': path.resolve(__dirname, 'src/types'),
        '@constants': path.resolve(__dirname, 'src/constants'),
        '@styles': path.resolve(__dirname, 'src/styles'),
      }
    },
    server: {
      proxy: {
        '/api': 'http://localhost:3001'
      }
    }
  }
})
