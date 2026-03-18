import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // or vue, etc.

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: true, // This tells Vite to allow the tunnel address
  }
})