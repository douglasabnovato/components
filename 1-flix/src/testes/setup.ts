/*
 * Preparação dos testes do Flix: reaproveita o setup do pacote de UI,
 * registra os matchers do jest-dom e limpa o localStorage entre testes.
 */
import '@testing-library/jest-dom/vitest'
import '@components/ui/testes/setup'
import { afterEach } from 'vitest'

afterEach(() => {
  window.localStorage.clear()
})
/* Fim da preparação dos testes do Flix. */
