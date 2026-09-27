/*
 * Preparação dos testes dos Formulários: matchers do jest-dom e, nos testes
 * de tela (jsdom), o setup do pacote de UI.
 */
import '@testing-library/jest-dom/vitest'

if (typeof window !== 'undefined') {
  await import('@components/ui/testes/setup')
}
/* Fim da preparação dos testes. */
