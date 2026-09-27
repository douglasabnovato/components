/*
 * Testes das regras de exibição das Tarefas.
 */
import type { Tarefa } from '@components/contratos'
import { describe, expect, it } from 'vitest'
import { comandoDaTecla, contar, destacar, filtrarPorSituacao } from './tarefas'
import { buscar, interfaceSlice, limpar, textoMudou } from '../store/interface'

const tarefas: Tarefa[] = [
  { id: '1', descricao: 'Comprar pão', concluida: true, criadaEm: '2026-09-26T10:00:00Z' },
  { id: '2', descricao: 'Estudar Redux', concluida: false, criadaEm: '2026-09-26T11:00:00Z' },
  { id: '3', descricao: 'Comprar café', concluida: false, criadaEm: '2026-09-26T12:00:00Z' },
]

describe('situação e contagem', () => {
  it('filtra e conta sem guardar estado', () => {
    expect(filtrarPorSituacao(tarefas, 'pendentes').map((t) => t.id)).toEqual(['2', '3'])
    expect(filtrarPorSituacao(tarefas, 'concluidas').map((t) => t.id)).toEqual(['1'])
    expect(contar(tarefas)).toEqual({ total: 3, concluidas: 1, pendentes: 2 })
  })
})

describe('destaque da busca', () => {
  it('marca todos os trechos que casam, sem diferenciar maiúsculas', () => {
    expect(destacar('Comprar café e comprar pão', 'compr\\w+')).toEqual([
      { texto: 'Comprar', destaque: true },
      { texto: ' café e ', destaque: false },
      { texto: 'comprar', destaque: true },
      { texto: ' pão', destaque: false },
    ])
  })

  it('ignora padrão vazio, inválido ou que casa com vazio', () => {
    expect(destacar('abc', '')).toEqual([{ texto: 'abc', destaque: false }])
    expect(destacar('abc', '(')).toEqual([{ texto: 'abc', destaque: false }])
    expect(destacar('abc', 'x*')).toEqual([{ texto: 'abc', destaque: false }])
  })
})

describe('atalhos', () => {
  it('Enter adiciona, Shift+Enter busca e Esc limpa', () => {
    expect(comandoDaTecla('Enter', false)).toBe('adicionar')
    expect(comandoDaTecla('Enter', true)).toBe('buscar')
    expect(comandoDaTecla('Escape', false)).toBe('limpar')
    expect(comandoDaTecla('a', false)).toBeNull()
  })
})

describe('fatia de interface', () => {
  it('aplica a busca só com padrão válido e limpa tudo', () => {
    const r = interfaceSlice.reducer
    let estado = r(undefined, textoMudou('^compr'))
    estado = r(estado, buscar())
    expect(estado.busca).toBe('^compr')
    estado = r(estado, textoMudou('('))
    estado = r(estado, buscar())
    expect(estado).toMatchObject({ busca: '^compr', erroBusca: 'Expressão regular inválida.' })
    expect(r(estado, limpar())).toEqual({ texto: '', busca: '', situacao: 'todas', erroBusca: '' })
  })
})
/* Fim dos testes das regras. */
