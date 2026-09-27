/*
 * Preparação dos testes do Laboratório: reaproveita o setup do pacote de UI
 * e limpa o localStorage entre testes.
 */
import '@testing-library/jest-dom/vitest'
import '@components/ui/testes/setup'
import { afterEach } from 'vitest'

afterEach(() => {
  window.localStorage.clear()
})
/* Fim da preparação dos testes do Laboratório. */
