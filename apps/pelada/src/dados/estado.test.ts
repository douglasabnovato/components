/*
 * Testes do reducer e da leitura do estado salvo.
 */
import { describe, expect, it } from 'vitest'
import { estadoInicial } from '../dominio/seed'
import { lerEstado, reducer } from './estado'

const inicial = estadoInicial(new Date('2026-09-26T12:00:00'))

describe('reducer', () => {
  it('exclui e restaura na mesma posição', () => {
    const jogo = inicial.jogos[1]!
    const semJogo = reducer(inicial, { tipo: 'excluir', id: jogo.id })
    expect(semJogo.jogos.map((j) => j.id)).not.toContain(jogo.id)
    const volta = reducer(semJogo, { tipo: 'restaurar', jogo, posicao: 1 })
    expect(volta.jogos.map((j) => j.id)).toEqual(inicial.jogos.map((j) => j.id))
  })

  it('limpa o @ do organizador', () => {
    expect(reducer(inicial, { tipo: 'organizador', usuario: ' @octocat ' }).organizador).toBe(
      'octocat',
    )
  })
})

describe('lerEstado', () => {
  it('aceita estado válido e recusa corrompido', () => {
    expect(lerEstado(JSON.stringify(inicial))).toEqual(inicial)
    expect(lerEstado('{')).toBeNull()
    expect(lerEstado(JSON.stringify({ versao: 1, jogos: 'x' }))).toBeNull()
  })
})
/* Fim dos testes do estado. */
