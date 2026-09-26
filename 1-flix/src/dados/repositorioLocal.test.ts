/*
 * Testes do repositório local e da importação: chave exclusiva, dados
 * corrompidos (B10) e preservação dos dados de outros projetos (B4).
 */
import { beforeEach, describe, expect, it } from 'vitest'
import { excluirVideo } from '../dominio/catalogo'
import { importarCatalogo } from './arquivo'
import { CHAVE_ARMAZENAMENTO, criarRepositorioLocal } from './repositorioLocal'

describe('repositório local', () => {
  beforeEach(() => window.localStorage.clear())

  it('carrega o catálogo inicial no primeiro acesso e grava na chave do Flix', async () => {
    const repo = criarRepositorioLocal()
    const c = await repo.carregar()
    expect(c.videos.length).toBeGreaterThan(0)
    expect(window.localStorage.getItem(CHAVE_ARMAZENAMENTO)).not.toBeNull()
  })

  it('persiste alterações entre carregamentos', async () => {
    const repo = criarRepositorioLocal()
    const c = await repo.carregar()
    await repo.salvar(excluirVideo(c, 'react-100'))
    const recarregado = await criarRepositorioLocal().carregar()
    expect(recarregado.videos.some((v) => v.id === 'react-100')).toBe(false)
  })

  it('B10 · JSON corrompido volta ao catálogo inicial sem quebrar', async () => {
    window.localStorage.setItem(CHAVE_ARMAZENAMENTO, '{ quebrado')
    const c = await criarRepositorioLocal().carregar()
    expect(c.categorias).toHaveLength(4)
  })

  it('B4 · restaurar não apaga dados de outros projetos', async () => {
    window.localStorage.setItem('components:pelada:jogos', '[1]')
    await criarRepositorioLocal().restaurar()
    expect(window.localStorage.getItem('components:pelada:jogos')).toBe('[1]')
  })
})

describe('importação', () => {
  it('recusa arquivos que não são catálogo', () => {
    expect(() => importarCatalogo('nada')).toThrow('não é um JSON válido')
    expect(() => importarCatalogo('{"versao":2}')).toThrow('não é um catálogo do Flix')
  })
})
/* Fim dos testes do repositório. */
