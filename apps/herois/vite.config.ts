/*
 * Configuração do Vite do Portal de Heróis: Tailwind CSS v4 pelo plugin
 * oficial, porta 5173 em desenvolvimento e pasta /herois/ no build e no preview.
 * O limite de aviso do pacote sobe para 700 kB por causa do Motion.
 */
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig(({ command, isPreview }) => ({
  base: command === 'build' || isPreview ? '/herois/' : '/',
  plugins: [react(), tailwindcss()],
  server: { port: 5173, strictPort: true },
  preview: { port: 4173 },
  build: { chunkSizeWarningLimit: 700 },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/testes/setup.ts'],
  },
}))
/* Fim da configuração do Vite. */
