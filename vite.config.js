import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path' // 新增导入

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { // 新增 resolve 配置
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
