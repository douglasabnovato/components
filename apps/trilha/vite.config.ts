/*
 * Configuração do Vite da Trilha: em desenvolvimento roda na porta 5178 na raiz;
 * no build e no preview, fica sob /trilha/, como será publicado ao lado do hub.
 */
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig(({ command, isPreview }) => ({
  base: command === 'build' || isPreview ? '/trilha/' : '/',
  plugins: [react()],
  server: { port: 5178, strictPort: true },
  preview: { port: 4178 },
  test: {
    environment: 'jsdom',
        testTimeout: 20_000,
    hookTimeout: 30_000,
    globals: true,
    setupFiles: ['./src/testes/setup.ts'],
    css: { modules: { classNameStrategy: 'non-scoped' } },
  },
}))
/* Fim da configuração do Vite. */
