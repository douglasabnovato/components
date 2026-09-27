/*
 * Configuração do Vite das Tarefas: em desenvolvimento roda na porta 5175 na raiz;
 * no build e no preview, fica sob /tarefas/, como será publicado ao lado do hub.
 * O caminho /api é encaminhado para a API compartilhada (porta 3333).
 */
import { proxyDaApi } from '@components/ui/ecossistema'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig(({ command, isPreview }) => ({
  base: command === 'build' || isPreview ? '/tarefas/' : '/',
  plugins: [react()],
  server: { port: 5175, strictPort: true, proxy: proxyDaApi() },
  preview: { port: 4175, proxy: proxyDaApi() },
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
