import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Это то, что мы писали ранее
    port: 5173
  },
  // ВОТ ЭТА НАСТРОЙКА РЕШАЕТ НАШУ ПРОБЛЕМУ С MUI:
  optimizeDeps: {
    include: ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled']
  }
})
