import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/Cinescope/",
  define: {
    'import.meta.env.VITE_TMDB_KEY': JSON.stringify('c330e2d33885226a7f12eca02aeefcd8'),
  },
})
