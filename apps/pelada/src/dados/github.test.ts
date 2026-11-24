/*
 * Testes da busca do perfil no GitHub, sem rede: o fetch é injetado.
 * O e2e de navegação simula a API (packages/testes-e2e/suporte/teste.ts);
 * aqui ficam as respostas que ele não cobre: 404, 403, sem rede, cancelamento e o cache.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  buscarPerfil,
  ehLimite,
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

describe('mensagem do limite com a hora em que libera (R19 do #69)', () => {
  const agora = new Date(2026, 10, 24, 14, 0, 0)
  const comCabecalhos = (h: Record<string, string>) =>
    new Response('{}', { status: 403, headers: h })
  const horaLocal = (d: Date) =>
    `${String(d.getHours()).padStart(2, '0')}h${String(d.getMinutes()).padStart(2, '0')}`

  it('usa o X-RateLimit-Reset', () => {
    const libera = new Date(2026, 10, 24, 14, 32, 0)
    const r = comCabecalhos({ 'X-RateLimit-Reset': String(libera.getTime() / 1000) })
    expect(mensagemDeLimite(r, agora)).toBe(
      `O GitHub limitou as consultas. Tente de novo depois das ${horaLocal(libera)}.`,
    )
  })

  it('usa o Retry-After quando não há X-RateLimit-Reset', () => {
    const r = comCabecalhos({ 'Retry-After': '600' })
    expect(mensagemDeLimite(r, agora)).toBe(
      `O GitHub limitou as consultas. Tente de novo depois das ${horaLocal(new Date(agora.getTime() + 600_000))}.`,
    )
  })

  it('sem cabeçalho, ou com hora que já passou, fica a frase genérica', () => {
    expect(mensagemDeLimite(comCabecalhos({}), agora)).toBe(MENSAGEM_LIMITE)
    const passado = String(new Date(2026, 10, 24, 13, 0, 0).getTime() / 1000)
    expect(mensagemDeLimite(comCabecalhos({ 'X-RateLimit-Reset': passado }), agora)).toBe(
      MENSAGEM_LIMITE,
    )
  })

  it('reconhece as 2 frases de limite', () => {
    expect(ehLimite(MENSAGEM_LIMITE)).toBe(true)
    expect(ehLimite('O GitHub limitou as consultas. Tente de novo depois das 14h32.')).toBe(true)
    expect(ehLimite('Sem conexão. Confira a internet e tente de novo.')).toBe(false)
  })
})
