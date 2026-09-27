/*
 * Testes das regras do Portal de Heróis.
 */
import { describe, expect, it } from 'vitest'
import {
  comparar,
  equipesDoUniverso,
  filtrarHerois,
  forcaTotal,
  heroiPorSlug,
  lerFiltros,
  paraParametros,
  problemasDoUniverso,
  universoDoHeroi,
} from './herois'
import { esquemaEquipe, esquemaHeroi, esquemaUniverso } from './tipos'
import { equipes, herois, universos } from './universo'

describe('universo', () => {
  it('é válido e consistente: 2 universos, 3 equipes, 12 heróis', () => {
    universos.forEach((u) => esquemaUniverso.parse(u))
    equipes.forEach((e) => esquemaEquipe.parse(e))
    herois.forEach((h) => esquemaHeroi.parse(h))
    expect([universos.length, equipes.length, herois.length]).toEqual([2, 3, 12])
    expect(problemasDoUniverso()).toEqual([])
  })

  it('aponta problemas de slug repetido e equipe inexistente', () => {
    const [a] = herois
    expect(problemasDoUniverso([a!, { ...a!, equipe: 'x' }])).toEqual(
      expect.arrayContaining(['Slug repetido', 'Maré Alta: equipe inexistente']),
    )
  })

  it('liga herói, equipe e universo', () => {
    expect(universoDoHeroi(heroiPorSlug('eco')!)?.nome).toBe('Cidade Circuito')
    expect(heroiPorSlug('nao-existe')).toBeNull()
  })
})

describe('filtros', () => {
  it('lê da URL ignorando valores inexistentes e escreve só o necessário', () => {
    expect(lerFiltros(new URLSearchParams('universo=terra-firme&equipe=xyz&busca=luz'))).toEqual({
      universo: 'terra-firme',
      equipe: '',
      busca: 'luz',
    })
    expect(paraParametros({ universo: '', equipe: 'liga-do-cerrado', busca: ' ' }).toString()).toBe(
      'equipe=liga-do-cerrado',
    )
  })

  it('filtra por universo, equipe e busca (inclusive poderes, sem acento)', () => {
    expect(filtrarHerois({ universo: 'cidade-circuito', equipe: '', busca: '' })).toHaveLength(4)
    expect(filtrarHerois({ universo: '', equipe: 'liga-do-cerrado', busca: '' })).toHaveLength(4)
    expect(filtrarHerois({ universo: '', equipe: '', busca: 'NEVOA' }).map((h) => h.slug)).toEqual([
      'neblina',
    ])
    expect(equipesDoUniverso('terra-firme')).toHaveLength(2)
  })
})

describe('comparação', () => {
  it('compara atributo a atributo e no total', () => {
    const siriema = heroiPorSlug('siriema')!
    const ipe = heroiPorSlug('ipe')!
    const r = comparar(siriema, ipe)
    expect(r.linhas.find((l) => l.chave === 'agilidade')?.vence).toBe('siriema')
    expect(r.linhas.find((l) => l.chave === 'forca')?.vence).toBe('ipe')
    expect([r.totalA, r.totalB]).toEqual([forcaTotal(siriema), forcaTotal(ipe)])
    expect(comparar(siriema, siriema).vence).toBeNull()
  })
})
/* Fim dos testes. */
