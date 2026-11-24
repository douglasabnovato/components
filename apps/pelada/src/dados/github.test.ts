/*
 * Testes da busca do perfil no GitHub, sem rede: o fetch é injetado.
 * O e2e de navegação simula a API (packages/testes-e2e/suporte/teste.ts);
 * aqui ficam as respostas que ele não cobre: 404, 403, sem rede, cancelamento e o cache.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  buscarPerfil,
  ErroDoPerfil,
  limparCachePerfis,
  MENSAGEM_LIMITE,
  mensagemDeLimite,
} from './github'

const resposta = (status: number, corpo: unknown = {}) =>
  new Response(JSON.stringify(corpo), { status, headers: { 'Content-Type': 'application/json' } })

const perfilFicticio = {
  login: 'pessoa-ficticia',
  name: 'Pessoa Fictícia',
  avatar_url: 'https://avatars.githubusercontent.com/u/0',
  html_url: 'https://github.com/pessoa-ficticia',
}

describe('buscarPerfil', () => {
  beforeEach(() => limparCachePerfis())

  it('devolve o perfil quando a API responde 200', async () => {
    const buscar = vi.fn().mockResolvedValue(resposta(200, perfilFicticio))
    await expect(buscarPerfil('pessoa-ficticia', undefined, buscar)).resolves.toEqual({
      usuario: 'pessoa-ficticia',
      nome: 'Pessoa Fictícia',
      avatar: 'https://avatars.githubusercontent.com/u/0',
      url: 'https://github.com/pessoa-ficticia',
    })
    expect(buscar).toHaveBeenCalledWith(
      'https://api.github.com/users/pessoa-ficticia',
      expect.anything(),
    )
  })

  it('usa o login quando o perfil não tem nome', async () => {
    const buscar = vi.fn().mockResolvedValue(resposta(200, { ...perfilFicticio, name: null }))
    await expect(buscarPerfil('pessoa-ficticia', undefined, buscar)).resolves.toMatchObject({
      nome: 'pessoa-ficticia',
    })
  })

  it('diz que o usuário não existe quando a API responde 404', async () => {
    const buscar = vi.fn().mockResolvedValue(resposta(404))
    await expect(buscarPerfil('ninguem', undefined, buscar)).rejects.toThrow(
      'O usuário @ninguem não existe no GitHub.',
    )
  })

  it('avisa do limite quando a API recusa (403, sem token) (#68)', async () => {
    const buscar = vi.fn().mockResolvedValue(resposta(403, { message: 'API rate limit exceeded' }))
    await expect(buscarPerfil('pessoa-ficticia', undefined, buscar)).rejects.toThrow(
      'O GitHub limitou as consultas. Tente daqui a alguns minutos.',
    )
  })

  it('não repete a busca do mesmo usuário (cache sem diferença de maiúsculas)', async () => {
    const buscar = vi.fn().mockResolvedValue(resposta(200, perfilFicticio))
    await buscarPerfil('pessoa-ficticia', undefined, buscar)
    await buscarPerfil('Pessoa-Ficticia', undefined, buscar)
    expect(buscar).toHaveBeenCalledTimes(1)
  })

  it('sem rede, troca o "Failed to fetch" por "Sem conexão" (#66, #68)', async () => {
    const buscar = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'))
    await expect(buscarPerfil('pessoa-ficticia', undefined, buscar)).rejects.toThrow(
      'Sem conexão. Confira a internet e tente de novo.',
    )
  })

  it('deixa o cancelamento seguir como AbortError, para o hook ignorar', async () => {
    const buscar = vi.fn().mockRejectedValue(new DOMException('cancelado', 'AbortError'))
    await expect(buscarPerfil('pessoa-ficticia', undefined, buscar)).rejects.toMatchObject({
      name: 'AbortError',
    })
  })

  it('com 5xx, diz que não conseguiu falar com o GitHub (#68)', async () => {
    const buscar = vi.fn().mockResolvedValue(resposta(502))
    await expect(buscarPerfil('pessoa-ficticia', undefined, buscar)).rejects.toThrow(
      'Não foi possível falar com o GitHub agora.',
    )
  })
})
/* Fim dos testes do perfil do GitHub. */

describe('mensagem do limite com a hora em que libera (R19 do #69 e do #70)', () => {
  const agora = new Date(2026, 10, 24, 14, 0, 0)
  const comCabecalhos = (h: Record<string, string>) =>
    new Response('{}', { status: 403, headers: h })
  const horaLocal = (d: Date) => {
    const r = new Date(Math.ceil(d.getTime() / 60_000) * 60_000)
    return `${String(r.getHours()).padStart(2, '0')}h${String(r.getMinutes()).padStart(2, '0')}`
  }
  const seg = (d: Date) => String(d.getTime() / 1000)

  it('usa primeiro o Retry-After, mesmo com o X-RateLimit-Reset', () => {
    const r = comCabecalhos({
      'Retry-After': '600',
      'X-RateLimit-Remaining': '0',
      'X-RateLimit-Reset': seg(new Date(2026, 10, 24, 15, 0, 0)),
    })
    expect(mensagemDeLimite(r, agora)).toBe(
      `O GitHub limitou as consultas. Tente de novo depois das ${horaLocal(new Date(agora.getTime() + 600_000))}.`,
    )
  })

  it('usa o X-RateLimit-Reset só com X-RateLimit-Remaining em 0', () => {
    const libera = new Date(2026, 10, 24, 14, 32, 0)
    const r = comCabecalhos({ 'X-RateLimit-Remaining': '0', 'X-RateLimit-Reset': seg(libera) })
    expect(mensagemDeLimite(r, agora)).toBe(
      `O GitHub limitou as consultas. Tente de novo depois das ${horaLocal(libera)}.`,
    )
  })

  it('ignora o X-RateLimit-Reset quando ainda restam consultas (403 que não é do limite por hora)', () => {
    const r = comCabecalhos({
      'X-RateLimit-Remaining': '42',
      'X-RateLimit-Reset': seg(new Date(2026, 10, 24, 14, 32, 0)),
    })
    expect(mensagemDeLimite(r, agora)).toBe(MENSAGEM_LIMITE)
  })

  it('arredonda para o minuto seguinte: libera às 14:32:40, diz 14h33', () => {
    const r = comCabecalhos({
      'X-RateLimit-Remaining': '0',
      'X-RateLimit-Reset': seg(new Date(2026, 10, 24, 14, 32, 40)),
    })
    expect(mensagemDeLimite(r, agora)).toBe(
      `O GitHub limitou as consultas. Tente de novo depois das ${horaLocal(new Date(2026, 10, 24, 14, 33, 0))}.`,
    )
  })

  it('sem cabeçalho, ou com hora que já passou, fica a frase genérica', () => {
    expect(mensagemDeLimite(comCabecalhos({}), agora)).toBe(MENSAGEM_LIMITE)
    const passado = seg(new Date(2026, 10, 24, 13, 0, 0))
    expect(
      mensagemDeLimite(
        comCabecalhos({ 'X-RateLimit-Remaining': '0', 'X-RateLimit-Reset': passado }),
        agora,
      ),
    ).toBe(MENSAGEM_LIMITE)
  })

  it('cada erro leva a causa, e o estilo do botão não depende do texto (nota 0 da R19 do #70)', async () => {
    const causa = async (buscar: typeof fetch) => {
      limparCachePerfis()
      try {
        await buscarPerfil('pessoa-ficticia', undefined, buscar)
      } catch (e) {
        return e instanceof ErroDoPerfil ? e.causa : 'não é ErroDoPerfil'
      }
      return 'sem erro'
    }
    expect(await causa(vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))).toBe('rede')
    expect(await causa(vi.fn().mockResolvedValue(comCabecalhos({})))).toBe('limite')
    expect(await causa(vi.fn().mockResolvedValue(new Response('{}', { status: 429 })))).toBe(
      'limite',
    )
    expect(await causa(vi.fn().mockResolvedValue(new Response('{}', { status: 404 })))).toBe(
      'inexistente',
    )
    expect(await causa(vi.fn().mockResolvedValue(new Response('{}', { status: 502 })))).toBe('api')
  })
})
