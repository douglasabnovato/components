/*
 * Teste base do ecossistema: todo teste falha se a página registrar erro de
 * console ou exceção não tratada, mesmo que as asserções passem. Ruídos
 * conhecidos e inofensivos entram em IGNORADOS, sempre com o motivo.
 */
import { expect, test as base } from '@playwright/test'

/* Padrões de mensagens que não indicam defeito (vazio por enquanto). */
const IGNORADOS: RegExp[] = []

export const test = base.extend<{ errosDaPagina: string[] }>({
  errosDaPagina: [
    async ({ page }, usar) => {
      const erros: string[] = []
      const registrar = (texto: string) => {
        if (IGNORADOS.some((padrao) => padrao.test(texto))) return
        erros.push(`${texto} (em ${page.url()})`)
      }
      page.on('console', (mensagem) => {
        if (mensagem.type() === 'error') registrar(`[console] ${mensagem.text()}`)
      })
      page.on('pageerror', (falha) => registrar(`[exceção] ${falha.message}`))
      await usar(erros)
      expect(erros, 'A página registrou erros de console ou exceções').toEqual([])
    },
    { auto: true },
  ],
})

export { expect }
/* Fim do teste base. */
