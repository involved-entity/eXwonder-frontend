import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const localIp = 'localhost'

export default defineConfig({
  plugins: [vue()],
  server: {
    host: localIp,
    port: 80
  }
})
