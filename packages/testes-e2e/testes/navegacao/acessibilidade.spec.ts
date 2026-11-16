/*
 * Acessibilidade no navegador (critério 8 do docs/MVP.md): o axe completo
 * (regras WCAG 2.0, 2.1 e 2.2 nível A e AA) roda no hub e nos 8 filhos, com os
 * dados reais de cada projeto e em largura de desktop. O hub também é
 * conferido em largura de celular. Os projetos não seguem o tema do sistema
 * (sem prefers-color-scheme): cada um tem tema fixo, então não há teste de
 * "modo escuro" à parte. Funciona em desenvolvimento e publicado (URL_BASE).
 */
import AxeBuilder from '@axe-core/playwright'
import { ecossistema, enderecoDoProjeto } from '@components/ui/ecossistema'
import type { Page } from '@playwright/test'
import { expect, test } from '../../suporte/teste'

/* As seções do hub chegam depois da pintura e do tempo ocioso; no dev, a primeira visita ainda transforma o módulo. */
const ESPERA_SECOES_MS = 30_000

const REGRAS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']

/* Endereço do projeto: pasta no site (URL_BASE) ou porta própria em desenvolvimento. */
function endereco(numero: number) {
  return enderecoDoProjeto(numero, '', !process.env.URL_BASE)
}

/* Roda o axe na página inteira e devolve um resumo legível de cada violação. */
async function violacoes(page: Page) {
  const resultado = await new AxeBuilder({ page }).withTags(REGRAS).analyze()
  return resultado.violations.map(
    (v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`,
  )
}

/* Abre o projeto e espera o conteúdo principal e a rede pararem. */
async function abrir(page: Page, numero: number) {
  await page.goto(endereco(numero))
  await expect(page.locator('main').first()).toBeVisible()
  if (numero === 0)
    await expect(page.locator('#filho-8')).toBeAttached({ timeout: ESPERA_SECOES_MS })
  await page.waitForLoadState('networkidle')
}

for (const { numero, nome } of ecossistema) {
  test(`${String(numero).padStart(2, '0')} · ${nome}: axe sem violações (desktop)`, async ({
    page,
  }) => {
    await abrir(page, numero)
    expect(await violacoes(page), `Violações do axe em ${nome}`).toEqual([])
  })
}

test('00 · Hub: axe sem violações (celular, 412 px)', async ({ page }) => {
  await page.setViewportSize({ width: 412, height: 915 })
  await abrir(page, 0)
  expect(await violacoes(page), 'Violações do axe no hub em 412 px').toEqual([])
})
/* Fim do teste de acessibilidade. */
