import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",   // 👈true: allows access via localhost, 127.0.0.1, or LAN IP
    port: 5173,   // optional, ensures consistent port
  },
})
