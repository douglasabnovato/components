/*
 * Configuração do Vite do hub: plugin React, porta fixa e testes com jsdom.
 * O setup de testes reaproveita o do pacote de UI.
 */
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  server: { port: 5170, open: true },
  preview: { port: 4170 },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/testes/setup.ts'],
    css: { modules: { classNameStrategy: 'non-scoped' } },
  },
})
/* Fim da configuração do Vite. */
