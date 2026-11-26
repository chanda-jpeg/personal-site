import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Extra hostnames (a tunnel or preview proxy) can be supplied per-process, e.g.
//   DEV_ALLOWED_HOSTS=abc.example.com npm run dev
// Kept as exact hostnames — never a wildcard — and empty by default.
const allowedHosts = (process.env.DEV_ALLOWED_HOSTS ?? '')
  .split(',')
  .map((host) => host.trim())
  .filter(Boolean)

// `base: './'` keeps asset URLs relative, so the same build works on
// user.github.io/repo-name/ (GitHub Pages), a custom domain, or localhost.
export default defineConfig({
  base: './',
  plugins: [react()],
  ...(allowedHosts.length ? { server: { allowedHosts } } : {}),
})
