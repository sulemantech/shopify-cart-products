import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: 'https://cart-share.vercel.app/', // 👈 This is the fix
  plugins: [react()],
})