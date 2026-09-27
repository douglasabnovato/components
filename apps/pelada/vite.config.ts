/*
 * Configuração do Vite da Pelada: em desenvolvimento roda na porta 5176 na raiz;
 * no build e no preview, fica sob /pelada/, como será publicado ao lado do hub.
 */
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig(({ command, isPreview }) => ({
  base: command === 'build' || isPreview ? '/pelada/' : '/',
  plugins: [react()],
  server: { port: 5176, strictPort: true },
  preview: { port: 4176 },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/testes/setup.ts'],
    css: { modules: { classNameStrategy: 'non-scoped' } },
  },
}))
/* Fim da configuração do Vite. */
