/*
 * Configuração dos testes (Vitest) sem o plugin do React Router: as regras e
 * as actions rodam em Node e as telas em jsdom (createRoutesStub).
 */
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['testes/**/*.test.{ts,tsx}'],
    setupFiles: ['./testes/setup.ts'],
  },
})
/* Fim da configuração dos testes. */
