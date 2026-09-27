/*
 * Preparação dos testes das Tarefas: no navegador simulado (jsdom), reaproveita
 * o setup do pacote de UI; nos testes de contrato (ambiente Node), só registra
 * os matchers.
 */
import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'

if (typeof window !== 'undefined') {
  await import('@components/ui/testes/setup')
  afterEach(() => {
    window.localStorage.clear()
  })
}
/* Fim da preparação dos testes das Tarefas. */
