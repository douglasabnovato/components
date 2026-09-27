/*
 * Configuração do Vite do hub: MDX (as lições do Laboratório aparecem na
 * seção 07), plugin React, porta fixa e testes com jsdom. O limite de aviso do
 * pacote sobe porque o hub carrega as demos reais de todos os filhos.
 */
import mdx from '@mdx-js/rollup'
import react from '@vitejs/plugin-react'
import remarkGfm from 'remark-gfm'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [
    { enforce: 'pre', ...mdx({ remarkPlugins: [remarkGfm] }) },
    react({ include: /\.(mdx|tsx|ts)$/ }),
  ],
  server: { port: 5170, open: true },
  preview: { port: 4170 },
  build: { chunkSizeWarningLimit: 900 },
  test: {
    environment: 'jsdom',
        testTimeout: 20_000,
    hookTimeout: 30_000,
    globals: true,
    setupFiles: ['./src/testes/setup.ts'],
    css: { modules: { classNameStrategy: 'non-scoped' } },
  },
})
/* Fim da configuração do Vite. */
