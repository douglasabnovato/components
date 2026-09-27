/*
 * Configuração dos testes da API: ambiente Node, sem navegador.
 */
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    testTimeout: 20_000,
    hookTimeout: 30_000,
    globals: true,
  },
})
/* Fim da configuração dos testes. */
