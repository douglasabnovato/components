/*
 * Teste base do ecossistema: todo teste falha se a página registrar erro de
 * console ou exceção não tratada, mesmo que as asserções passem. Ruídos
 * conhecidos e inofensivos entram em IGNORADOS, sempre com o motivo.
 */
import { expect, test as base } from '@playwright/test'

/* Padrões de mensagens que não indicam defeito (vazio por enquanto). */
const IGNORADOS: RegExp[] = []

/*
 * A Lista da Pelada busca o perfil do organizador em api.github.com. Sem token,
 * a API limita a 60 pedidos por hora por IP, e o runner do CI às vezes recebe
 * 403: a página registra o erro de recurso e o teste falha sem defeito no app.
 * Nos testes, a API e os avatares respondem com um perfil fictício e fixo,
 * também na fumaça em produção (URL_BASE), que sai do mesmo runner. Para
 * conferir com a API real, rode com API_GITHUB_REAL=1. A rota fica no
 * contexto, para valer também em páginas novas e popups.
 */
const PIXEL_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
  'base64',
)

export const test = base.extend<{ apiDoGitHubSimulada: void; errosDaPagina: string[] }>({
  apiDoGitHubSimulada: [
    async ({ context }, usar) => {
      if (process.env.API_GITHUB_REAL === '1') return usar()
      await context.route('https://api.github.com/users/**', (rota) => {
        /* /users/<login>: o login é o 3º trecho do caminho. */
        const usuario = decodeURIComponent(
          new URL(rota.request().url()).pathname.split('/')[2] ?? 'pessoa',
        )
        return rota.fulfill({
          json: {
            login: usuario,
            name: 'Pessoa Fictícia',
            avatar_url: 'https://avatars.githubusercontent.com/u/0',
            html_url: `https://github.com/${usuario}`,
          },
        })
      })
      await context.route('https://avatars.githubusercontent.com/**', (rota) =>
        rota.fulfill({ contentType: 'image/png', body: PIXEL_PNG }),
      )
      await usar()
    },
    { auto: true },
  ],
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
