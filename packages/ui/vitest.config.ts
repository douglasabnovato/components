/*
 * Configuração de testes do pacote de UI (jsdom + Testing Library).
 */
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/testes/setup.ts'],
    css: { modules: { classNameStrategy: 'non-scoped' } },
  },
})
/* Fim da configuração de testes. */
