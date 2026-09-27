/*
 * Configuração do Vite da Cadastro: em desenvolvimento roda na porta 5172 na raiz;
 * no build e no preview, fica sob /cadastro/, como será publicado ao lado do hub.
 * O caminho /api é encaminhado para a API compartilhada (porta 3333).
 */
import { proxyDaApi } from '@components/ui/ecossistema'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig(({ command, isPreview }) => ({
  base: command === 'build' || isPreview ? '/cadastro/' : '/',
  plugins: [react()],
  server: { port: 5172, strictPort: true, proxy: proxyDaApi() },
  preview: { port: 4172, proxy: proxyDaApi() },
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
