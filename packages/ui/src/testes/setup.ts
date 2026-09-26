/*
 * Preparação comum dos testes: matchers do jest-dom e simulações de APIs
 * do navegador que o jsdom não implementa (matchMedia, observers, scroll).
 */
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => {
  cleanup()
})

/* Simula matchMedia sempre respondendo "não corresponde". */
if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList
}

/* Observador genérico que não dispara nada, usado para os dois observers. */
class ObservadorSimulado {
  root = null
  rootMargin = ''
  thresholds = []
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}

window.IntersectionObserver ??= ObservadorSimulado as unknown as typeof IntersectionObserver
window.ResizeObserver ??= ObservadorSimulado as unknown as typeof ResizeObserver
window.scrollTo ??= (() => {}) as typeof window.scrollTo
Element.prototype.scrollIntoView ??= () => {}
/* Fim da preparação dos testes. */
