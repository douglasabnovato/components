/*
 * Testes da busca do perfil no GitHub, sem rede: o fetch é injetado.
 * O e2e de navegação simula a API (packages/testes-e2e/suporte/teste.ts);
 * aqui ficam as respostas que ele não cobre: 404, 403 e o cache.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { buscarPerfil, limparCachePerfis } from './github'

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
    expect(buscar).toHaveBeenCalledWith('https://api.github.com/users/pessoa-ficticia', expect.anything())
  })

  it('usa o login quando o perfil não tem nome', async () => {
    const buscar = vi.fn().mockResolvedValue(resposta(200, { ...perfilFicticio, name: null }))
    await expect(buscarPerfil('pessoa-ficticia', undefined, buscar)).resolves.toMatchObject({ nome: 'pessoa-ficticia' })
  })

  it('diz que o usuário não existe quando a API responde 404', async () => {
    const buscar = vi.fn().mockResolvedValue(resposta(404))
    await expect(buscarPerfil('ninguem', undefined, buscar)).rejects.toThrow('O usuário @ninguem não existe no GitHub.')
  })

  it('dá a mensagem amigável quando a API recusa (403, limite sem token)', async () => {
    const buscar = vi.fn().mockResolvedValue(resposta(403, { message: 'API rate limit exceeded' }))
    await expect(buscarPerfil('pessoa-ficticia', undefined, buscar)).rejects.toThrow('Não foi possível falar com o GitHub agora.')
  })

  it('não repete a busca do mesmo usuário (cache sem diferença de maiúsculas)', async () => {
    const buscar = vi.fn().mockResolvedValue(resposta(200, perfilFicticio))
    await buscarPerfil('pessoa-ficticia', undefined, buscar)
    await buscarPerfil('Pessoa-Ficticia', undefined, buscar)
    expect(buscar).toHaveBeenCalledTimes(1)
  })
})
/* Fim dos testes do perfil do GitHub. */
