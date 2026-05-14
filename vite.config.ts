import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import netlify from '@netlify/vite-plugin-tanstack-start'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  base: "/",
  plugins: [
    tsconfigPaths(),
    tanstackStart(),
    netlify(),
  ],
})