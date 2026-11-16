// @vitest-environment node
/*
 * Roda a mesma bateria de contrato nas duas implementações: memória e API
 * (Hono + PGlite em memória, chamada por app.request no lugar do fetch).
 * O PGlite abre uma vez só e volta ao estado inicial a cada teste.
 */
import { abrirBanco, criarApp, reiniciarBanco } from '@components/api'
import { describe, expect, it } from 'vitest'
import { testarContratoRepositorio } from './contrato'
import { ErroRepositorio } from './repositorio'
import { criarRepositorioHttp } from './repositorioHttp'
import { criarRepositorioMemoria } from './repositorioMemoria'

testarContratoRepositorio('memória', async () => criarRepositorioMemoria())

const bancoDaApi = abrirBanco()

testarContratoRepositorio('API', async () => {
  const { banco, cliente } = await bancoDaApi
  await reiniciarBanco(cliente)
  const app = criarApp(banco)
  return criarRepositorioHttp('', (url, init) => Promise.resolve(app.request(url, init)))
})

describe('repositório via API', () => {
  it('traduz falha de rede em "indisponível"', async () => {
    const repo = criarRepositorioHttp('http://localhost:1', () =>
      Promise.reject(new TypeError('Failed to fetch')),
    )
    const erro = await repo.listar().catch((e: unknown) => e)
    expect(erro).toBeInstanceOf(ErroRepositorio)
    expect((erro as ErroRepositorio).tipo).toBe('indisponivel')
  })

  it('cancela o pedido que passa do prazo e o trata como "indisponível"', async () => {
    let cancelado = false
    const repo = criarRepositorioHttp(
      '',
      (_url, init) =>
        new Promise<Response>(() => {
          init?.signal?.addEventListener('abort', () => {
            cancelado = true
          })
        }),
      20,
    )
    const erro = await repo.listar().catch((e: unknown) => e)
    expect((erro as ErroRepositorio).tipo).toBe('indisponivel')
    expect(cancelado).toBe(true)
  })

  it.each([502, 503, 504])('trata o %i do encaminhamento como "indisponível"', async (status) => {
    const repo = criarRepositorioHttp('', () =>
      Promise.resolve(new Response('<html>erro</html>', { status })),
    )
    const erro = await repo.listar().catch((e: unknown) => e)
    expect((erro as ErroRepositorio).tipo).toBe('indisponivel')
    expect((erro as ErroRepositorio).message).toBe('A API não respondeu.')
  })
})
/* Fim dos testes dos repositórios. */
