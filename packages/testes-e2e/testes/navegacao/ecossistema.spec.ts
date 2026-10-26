/*
 * T-01 · Navegação do ecossistema: o hub carrega sem erros, toda âncora
 * interna tem destino, há link para os 8 filhos e cada filho abre pelo hub e
 * volta para a sua seção. O gabarito é o mapa do ecossistema (@components/ui).
 * Funciona em desenvolvimento (uma porta por projeto) e publicado (pastas).
 */
import { ecossistema } from '@components/ui/ecossistema'
import type { Page } from '@playwright/test'
import { expect, test } from '../../suporte/teste'

const filhos = ecossistema.filter((p) => p.numero > 0)

/* Link "Abrir <nome>" dentro da seção do filho no hub. */
function linkDoFilho(page: Page, numero: number, nome: string) {
  return page.locator(`#filho-${numero}`).getByRole('link', { name: `Abrir ${nome}` })
}

test.describe('hub', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('#filho-1')).toBeAttached()
  })

  test('carrega sem erros de console', async ({ page }) => {
    await page.waitForLoadState('load')
  })

  test('toda âncora interna tem destino', async ({ page }) => {
    const orfas = await page.evaluate(() =>
      Array.from(document.querySelectorAll('a[href^="#"]'))
        .map((ancora) => (ancora.getAttribute('href') ?? '').slice(1))
        .filter((id) => id !== '' && !document.getElementById(decodeURIComponent(id))),
    )
    expect(orfas, 'Âncoras sem elemento de destino').toEqual([])
  })

  test(`tem link para os ${filhos.length} filhos`, async ({ page }) => {
    for (const { numero, nome } of filhos) {
      const link = linkDoFilho(page, numero, nome)
      await expect(link, `Link para ${nome}`).toBeVisible()
      await expect(link).toHaveAttribute('href', /.+/)
    }
  })
})

test.describe('filhos', () => {
  for (const { numero, nome } of filhos) {
    test(`${String(numero).padStart(2, '0')} · ${nome} abre pelo hub e volta`, async ({ page }) => {
      await page.goto('/')
      const hub = new URL('/', page.url())

      const link = linkDoFilho(page, numero, nome)
      const destino = new URL((await link.getAttribute('href')) ?? '', page.url()).href
      await link.click()
      await page.waitForURL((url) => url.href.startsWith(destino))

      const voltar = page.getByRole('link', { name: 'Hub', exact: true }).first()
      await expect(voltar).toBeVisible()
      await voltar.click()

      await expect(page).toHaveURL(`${hub.origin}/#filho-${numero}`)
      await expect(page.locator(`#filho-${numero}`)).toBeAttached()
    })
  }
})
/* Fim do T-01. */
