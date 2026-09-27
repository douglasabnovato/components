/*
 * Configuração do Vite do Laboratório: MDX com tabelas (remark-gfm) para o
 * texto das lições, antes do plugin do React; porta 5177 em desenvolvimento
 * e pasta /laboratorio/ no build.
 */
import mdx from '@mdx-js/rollup'
import react from '@vitejs/plugin-react'
import remarkGfm from 'remark-gfm'
import { defineConfig } from 'vitest/config'

export default defineConfig(({ command, isPreview }) => ({
  base: command === 'build' || isPreview ? '/laboratorio/' : '/',
  plugins: [
    { enforce: 'pre', ...mdx({ remarkPlugins: [remarkGfm] }) },
    react({ include: /\.(mdx|tsx|ts)$/ }),
  ],
  server: { port: 5177, strictPort: true },
  preview: { port: 4177 },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/testes/setup.ts'],
    css: { modules: { classNameStrategy: 'non-scoped' } },
  },
}))
/* Fim da configuração do Vite. */
