/*
 * Configuração do Vite do Flix: em desenvolvimento roda na porta 5171 na raiz;
 * no build e no preview, fica sob /flix/, como será publicado ao lado do hub.
 */
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig(({ command, isPreview }) => ({
  base: command === 'build' || isPreview ? '/flix/' : '/',
  plugins: [react()],
  server: { port: 5171, strictPort: true },
  preview: { port: 4171 },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/testes/setup.ts'],
    css: { modules: { classNameStrategy: 'non-scoped' } },
  },
}))
/* Fim da configuração do Vite. */
