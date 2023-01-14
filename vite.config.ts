import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Stations from './vite-plugins/stations'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Stations()
  ]
})
