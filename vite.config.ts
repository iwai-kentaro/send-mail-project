import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    "process.env.VITE_API_URL": JSON.stringify(
      process.env.NODE_ENV === "production"
        ? "https://send-mail-project.vercel.app/api"
        : "http://localhost:5001/api"
    ),
  },
})
