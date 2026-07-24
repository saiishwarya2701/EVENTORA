import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  build: {
    // disable CSS minification to avoid lightningcss parsing errors in CI/local
    cssMinify: false,
  },
})
