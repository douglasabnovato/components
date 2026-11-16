/*
 * Teclado nos 8 aplicativos internos (issue #25). Para cada filho:
 * 1. Varredura: as primeiras paradas de Tab têm nome e foco visível, e o foco
 *    sempre sai do lugar (sem armadilha).
 * 2. Fluxo principal: só com Tab, Enter e digitação, chega ao resultado
 *    principal do aplicativo (abrir um vídeo, uma ficha, um jogo etc.).
 * Funciona em desenvolvimento (uma porta por projeto) e publicado (pastas).
 */
import { enderecoDoProjeto } from '@components/ui/ecossistema'
import type { Page } from '@playwright/test'
import { expect, test } from '../../suporte/teste'

const PARADAS = 25
const LIMITE_PARA_ACHAR = 120

/* Endereço do filho: pasta no site (URL_BASE) ou porta própria em desenvolvimento. */
function enderecoDoFilho(numero: number, caminho = '') {
  return enderecoDoProjeto(numero, caminho, !process.env.URL_BASE)
}

type Parada = {
  descricao: string
  href: string
  nome: string
  focoVisivel: boolean
  mesmoQueAnterior: boolean
}

/* Lê o elemento focado: descrição curta, nome acessível aproximado e foco visível. */
function lerFoco(page: Page) {
  return page.evaluate((): Parada | null => {
    const el = document.activeElement as HTMLElement | null
    const memoria = window as unknown as { __ultimoFoco?: Element | null }
    if (!el || el === document.body) {
      memoria.__ultimoFoco = null
      return null
    }
    const mesmoQueAnterior = memoria.__ultimoFoco === el
    memoria.__ultimoFoco = el
    const porId = (ids: string | null) =>
      (ids ?? '')
        .split(/\s+/)
        .map((id) => document.getElementById(id)?.textContent ?? '')
        .join(' ')
    const rotulo = (el as HTMLInputElement).labels?.[0]?.textContent ?? ''
    const imagem = el.querySelector('img[alt]')?.getAttribute('alt') ?? ''
    const nome = [
      el.getAttribute('aria-label'),
      porId(el.getAttribute('aria-labelledby')),
      rotulo,
      el.textContent,
      el.getAttribute('title'),
      imagem,
      (el as HTMLInputElement).placeholder,
    ]
      .map((t) => (t ?? '').replace(/\s+/g, ' ').trim())
      .find(Boolean)
    /* O foco pode aparecer no próprio elemento ou num contêiner próximo
       (:focus-within, :has(:focus-visible)), como na busca e nos cartões do Flix.
       Só conta o contorno ou a sombra que aparece com o foco: compara com o
       elemento sem foco, para não aceitar a sombra fixa de um cartão. */
    const alvos: Element[] = []
    for (let alvo: Element | null = el; alvo && alvos.length < 4; alvo = alvo.parentElement)
      alvos.push(alvo)
    const indicador = (alvo: Element) => {
      const estilo = getComputedStyle(alvo)
      const contorno =
        estilo.outlineStyle !== 'none' && parseFloat(estilo.outlineWidth) > 0
          ? `${estilo.outlineStyle} ${estilo.outlineWidth} ${estilo.outlineColor}`
          : ''
      const sombra = estilo.boxShadow !== 'none' ? estilo.boxShadow : ''
      return `${contorno}|${sombra}`
    }
    const comFoco = alvos.map(indicador)
    el.blur()
    const semFoco = alvos.map(indicador)
    el.focus()
    const focoVisivel = comFoco.some((v, i) => v !== '|' && v !== semFoco[i])
    const href = el.getAttribute('href') ?? ''
    return {
      descricao: `${el.tagName.toLowerCase()}${href ? `[href=${href}]` : ''}`,
      href,
      nome: nome ?? '',
      focoVisivel,
      mesmoQueAnterior,
    }
  })
}

/* Aperta Tab até o elemento focado satisfazer o teste, ou falha no limite. */
async function tabularAte(page: Page, descricao: string, achou: (p: Parada) => boolean) {
  for (let i = 0; i < LIMITE_PARA_ACHAR; i++) {
    await page.keyboard.press('Tab')
    const parada = await lerFoco(page)
    if (parada && achou(parada)) return parada
  }
  throw new Error(`Tab não chegou a: ${descricao}`)
}

type Filho = {
  numero: number
  nome: string
  /* Fluxo principal só com teclado; termina com a asserção do resultado. */
  fluxo: (page: Page) => Promise<void>
}

/*
 * Tab até o primeiro link cujo endereço casa com o padrão, Enter e confere a URL.
 * Em desenvolvimento, o Vite pode recarregar a página na primeira visita (otimização
 * de dependências do Formulários) e desfazer o percurso; nesse caso, recomeça do início.
 */
function abrirPorLink(padrao: RegExp) {
  return async (page: Page) => {
    const inicio = page.url()
    let tentativa = 0
    await expect(async () => {
      if (tentativa++ > 0) await page.goto(inicio)
      await page.waitForLoadState('networkidle')
      await tabularAte(page, `link ${padrao}`, (p) => padrao.test(p.href))
      await page.keyboard.press('Enter')
      await expect(page).toHaveURL(padrao, { timeout: 5_000 })
    }).toPass({ timeout: 45_000 })
  }
}

const filhos: Filho[] = [
  { numero: 1, nome: 'Flix', fluxo: abrirPorLink(/\/assistir\//) },
  {
    numero: 2,
    nome: 'Cadastro',
    fluxo: async (page) => {
      await tabularAte(page, 'Novo cliente', (p) => p.nome.includes('Novo cliente'))
      await page.keyboard.press('Enter')
      await tabularAte(page, 'campo Nome', (p) => p.descricao === 'input' && /Nome/.test(p.nome))
      await page.keyboard.type('Teclado Silva')
      await page.keyboard.press('Tab')
      await page.keyboard.type(`teclado${Date.now()}@exemplo.com`)
      await page.keyboard.press('Tab')
      await page.keyboard.type('30')
      await page.keyboard.press('Enter')
      await expect(page.getByText('Teclado Silva cadastrado.')).toBeVisible()
    },
  },
  { numero: 3, nome: 'Portal de Heróis', fluxo: abrirPorLink(/\/heroi\//) },
  { numero: 4, nome: 'Formulários no Servidor', fluxo: abrirPorLink(/\/contato$/) },
  {
    numero: 5,
    nome: 'Tarefas',
    fluxo: async (page) => {
      const descricao = `Tarefa pelo teclado ${Date.now()}`
      await tabularAte(
        page,
        'campo da tarefa',
        (p) => p.descricao === 'input' && p.nome.includes('Tarefa ou padrão'),
      )
      await page.keyboard.type(descricao)
      await page.keyboard.press('Enter')
      await expect(page.getByRole('list', { name: 'Tarefas' })).toContainText(descricao)
    },
  },
  { numero: 6, nome: 'Lista da Pelada', fluxo: abrirPorLink(/\/jogo\//) },
  { numero: 7, nome: 'Laboratório', fluxo: abrirPorLink(/\/licao\//) },
  { numero: 8, nome: 'Trilha React', fluxo: abrirPorLink(/\/aprendizado\//) },
]

for (const { numero, nome, fluxo } of filhos) {
  test.describe(`${String(numero).padStart(2, '0')} · ${nome} pelo teclado`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(enderecoDoFilho(numero))
      /* Espera a hidratação (o Formulários vem do servidor): sem isso, o Enter
         num link podia cair entre o HTML e o React e não navegar (instável no CI). */
      await page.waitForLoadState('networkidle')
    })

    test('as primeiras paradas de Tab têm nome e foco visível', async ({ page }) => {
      const falhas: string[] = []
      for (let i = 1; i <= PARADAS; i++) {
        await page.keyboard.press('Tab')
        const parada = await lerFoco(page)
        if (!parada) continue
        if (parada.mesmoQueAnterior) falhas.push(`parada ${i}: foco preso em ${parada.descricao}`)
        if (!parada.nome) falhas.push(`parada ${i}: ${parada.descricao} sem nome`)
        if (!parada.focoVisivel)
          falhas.push(`parada ${i}: ${parada.descricao} "${parada.nome}" sem foco visível`)
      }
      expect(falhas).toEqual([])
    })

    test('o fluxo principal é concluído só com o teclado', async ({ page }) => {
      await fluxo(page)
    })
  })
}
/* Fim do teste de teclado. */
