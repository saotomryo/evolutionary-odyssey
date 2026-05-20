import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const repository = process.env.GITHUB_REPOSITORY?.split('/')[1]
const base = process.env.GITHUB_ACTIONS && repository ? `/${repository}/` : './'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base,
})
