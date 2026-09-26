/*
 * Testes das regras de negócio do Flix (R1 a R11) e da regressão de cada
 * bug encontrado no projeto original (B1, B2, B3, B5, B6).
 */
import { describe, expect, it } from 'vitest'
import {
  adicionarCategoria,
  adicionarVideo,
  buscarVideos,
  catalogoVazio,
  categoriasComVideos,
  definirBanner,
  definirDestaque,
  destaqueDaCategoria,
  editarCategoria,
  editarVideo,
  excluirCategoria,
  excluirVideo,
  normalizar,
} from './catalogo'
import { catalogoInicial } from './seed'
import { ErroDominio, type Catalogo } from './tipos'

/* Gerador de ids previsível para os testes. */
function sequencia(prefixo: string) {
  let n = 0
  return () => `${prefixo}${++n}`
}

/* Catálogo com duas categorias e três vídeos para os cenários. */
function montar(): Catalogo {
  const id = sequencia('id')
  let c = catalogoVazio()
  c = adicionarCategoria(c, { nome: 'Front End', cor: '#E8A33D' }, id).catalogo
  c = adicionarCategoria(c, { nome: 'Back End', cor: '#1F4FD6' }, id).catalogo
  c = adicionarVideo(
    c,
    { titulo: 'A', descricao: '', youtubeId: 'aaaaaaaaaaa', categoriaId: 'id1' },
    id,
  ).catalogo
  c = adicionarVideo(
    c,
    { titulo: 'B', descricao: '', youtubeId: 'bbbbbbbbbbb', categoriaId: 'id1' },
    id,
  ).catalogo
  c = adicionarVideo(
    c,
    { titulo: 'C', descricao: '', youtubeId: 'ccccccccccc', categoriaId: 'id2' },
    id,
  ).catalogo
  return c
}

describe('regras do catálogo', () => {
  it('R1 · o primeiro vídeo da categoria vira destaque', () => {
    const c = montar()
    expect(destaqueDaCategoria(c, 'id1')?.titulo).toBe('A')
    expect(destaqueDaCategoria(c, 'id2')?.titulo).toBe('C')
  })

  it('R2/R5 · o banner vai para a primeira categoria com vídeos', () => {
    let c = catalogoVazio()
    c = adicionarCategoria(c, { nome: 'Vazia', cor: '#111111' }, () => 'v').catalogo
    expect(c.categoriaBannerId).toBeNull()
    c = adicionarCategoria(c, { nome: 'Com vídeo', cor: '#222222' }, () => 'x').catalogo
    c = adicionarVideo(
      c,
      { titulo: 'X', descricao: '', youtubeId: 'xxxxxxxxxxx', categoriaId: 'x' },
      () => 'vx',
    ).catalogo
    expect(c.categoriaBannerId).toBe('x')
  })

  it('R4 · excluir categoria exclui os vídeos e passa o banner adiante', () => {
    const c = excluirCategoria(montar(), 'id1')
    expect(c.videos.map((v) => v.titulo)).toEqual(['C'])
    expect(c.categoriaBannerId).toBe('id2')
  })

  it('R5 · excluir o destaque promove o próximo da categoria', () => {
    const c = excluirVideo(montar(), 'id3')
    expect(destaqueDaCategoria(c, 'id1')?.titulo).toBe('B')
  })

  it('R5 · categoria que esvazia perde o banner', () => {
    let c = montar()
    c = excluirVideo(c, 'id3')
    c = excluirVideo(c, 'id4')
    expect(c.categoriaBannerId).toBe('id2')
    expect(c.destaquePorCategoria.id1).toBeUndefined()
  })

  it('R6 · nome repetido é recusado ignorando maiúsculas e acentos', () => {
    expect(() => adicionarCategoria(montar(), { nome: '  front end ', cor: '#000000' })).toThrow(
      ErroDominio,
    )
    let c = adicionarCategoria(catalogoVazio(), { nome: 'Vídeos', cor: '#000000' }).catalogo
    expect(() => adicionarCategoria(c, { nome: 'VIDEOS', cor: '#000000' })).toThrow(
      'Já existe uma categoria chamada "VIDEOS".',
    )
    c = adicionarCategoria(c, { nome: 'Outra', cor: '#000000' }).catalogo
    expect(c.categorias).toHaveLength(2)
  })

  it('R11 · editar mantém id e destaque na mesma categoria', () => {
    const c = editarVideo(montar(), 'id3', {
      titulo: 'A editado',
      descricao: 'nova',
      youtubeId: 'aaaaaaaaaaa',
      categoriaId: 'id1',
    })
    expect(destaqueDaCategoria(c, 'id1')).toMatchObject({ id: 'id3', titulo: 'A editado' })
  })

  it('define banner e destaque só com dados coerentes', () => {
    const c = montar()
    expect(definirBanner(c, 'id2').categoriaBannerId).toBe('id2')
    expect(destaqueDaCategoria(definirDestaque(c, 'id1', 'id4'), 'id1')?.titulo).toBe('B')
    expect(() => definirDestaque(c, 'id1', 'id5')).toThrow(ErroDominio)
    const vazia = adicionarCategoria(c, { nome: 'Vazia', cor: '#000000' }, () => 'z').catalogo
    expect(() => definirBanner(vazia, 'z')).toThrow('Só uma categoria com vídeos')
  })

  it('lista categorias com vídeos com o banner primeiro', () => {
    const c = definirBanner(montar(), 'id2')
    expect(categoriasComVideos(c).map((x) => x.id)).toEqual(['id2', 'id1'])
  })

  it('busca ignorando acentos e maiúsculas', () => {
    const c = catalogoInicial()
    expect(buscarVideos(c, 'REACT').map((v) => v.id)).toContain('react-100')
    expect(buscarVideos(c, 'contêineres').map((v) => v.id)).toEqual(['docker-100'])
    expect(buscarVideos(c, '   ')).toEqual([])
  })
})

describe('regressões do projeto original', () => {
  it('B1 · catálogo inconsistente é corrigido e a Início sempre tem banner válido', () => {
    const quebrado: Catalogo = {
      ...montar(),
      categoriaBannerId: 'nao-existe',
      destaquePorCategoria: { id1: 'video-apagado' },
    }
    const c = normalizar(quebrado)
    expect(c.categoriaBannerId).toBe('id1')
    expect(destaqueDaCategoria(c, 'id1')?.titulo).toBe('B')
    expect(destaqueDaCategoria(c, 'id2')?.titulo).toBe('C')
  })

  it('B2 · mover o destaque para outra categoria não cria dois destaques', () => {
    const c = editarVideo(montar(), 'id3', {
      titulo: 'A',
      descricao: '',
      youtubeId: 'aaaaaaaaaaa',
      categoriaId: 'id2',
    })
    expect(destaqueDaCategoria(c, 'id1')?.titulo).toBe('B')
    expect(destaqueDaCategoria(c, 'id2')?.titulo).toBe('C')
  })

  it('B3 · editar preserva o vídeo (player e capa derivam do youtubeId)', () => {
    const c = editarVideo(montar(), 'id4', {
      titulo: 'B2',
      descricao: '',
      youtubeId: 'bbbbbbbbbbb',
      categoriaId: 'id1',
    })
    expect(c.videos.find((v) => v.id === 'id4')?.youtubeId).toBe('bbbbbbbbbbb')
  })

  it('B5 · nenhuma operação altera o catálogo original', () => {
    const original = montar()
    const copia = structuredClone(original)
    editarCategoria(original, 'id1', { nome: 'Front', cor: '#FFFFFF' })
    excluirCategoria(original, 'id2')
    excluirVideo(original, 'id3')
    expect(original).toEqual(copia)
  })

  it('B6 · renomear categoria mantém os vídeos ligados', () => {
    const c = editarCategoria(montar(), 'id1', { nome: 'Interfaces', cor: '#e8a33d' })
    expect(c.categorias[0]).toMatchObject({ nome: 'Interfaces', cor: '#E8A33D' })
    expect(c.videos.filter((v) => v.categoriaId === 'id1')).toHaveLength(2)
  })
})

describe('catálogo inicial', () => {
  it('tem 4 categorias, todas com vídeos e destaque, e banner em Front End', () => {
    const c = catalogoInicial()
    expect(c.categorias).toHaveLength(4)
    expect(Object.keys(c.destaquePorCategoria)).toHaveLength(4)
    expect(c.categoriaBannerId).toBe('front-end')
    expect(new Set(c.videos.map((v) => v.youtubeId)).size).toBe(c.videos.length)
  })
})
/* Fim dos testes das regras. */
