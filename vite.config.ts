import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Base path matches the GitHub Pages repo: github.com/ChristopherList-lab/AVL_Copilot_UI
// In dev it uses "/", in build it uses "/AVL_Copilot_UI/".
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? '/AVL_Copilot_UI/' : '/',
}))
