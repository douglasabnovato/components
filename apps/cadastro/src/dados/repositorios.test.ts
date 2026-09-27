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
})
/* Fim dos testes dos repositórios. */
