import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const localIp = '0.0.0.0'

export default defineConfig({
  plugins: [vue()],
  server: {
    host: localIp,
    port: 3000
  }
})
