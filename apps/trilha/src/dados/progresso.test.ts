/*
 * Testes do armazém de progresso: gravação, anotações, dados corrompidos e avisos.
 */
import { describe, expect, it, vi } from 'vitest'
import { CHAVE_PROGRESSO, criarArmazemProgresso, lerProgresso } from './progresso'

describe('armazém de progresso', () => {
  it('marca, desmarca e mantém a lista ordenada', () => {
    const armazem = criarArmazemProgresso()
    armazem.alternarAssistido(5)
    armazem.alternarAssistido(2)
    expect(armazem.ler().assistidos).toEqual([2, 5])
    armazem.alternarAssistido(5)
    expect(armazem.ler().assistidos).toEqual([2])
    expect(JSON.parse(window.localStorage.getItem(CHAVE_PROGRESSO)!).assistidos).toEqual([2])
  })

  it('salva e apaga anotações vazias', () => {
    const armazem = criarArmazemProgresso()
    armazem.salvarNota(7, 'useEffect para buscar dados')
    expect(armazem.ler().notas).toEqual({ '7': 'useEffect para buscar dados' })
    armazem.salvarNota(7, '   ')
    expect(armazem.ler().notas).toEqual({})
  })

  it('descarta dados corrompidos ou de outra versão', () => {
    expect(lerProgresso('{quebrado').assistidos).toEqual([])
    expect(
      lerProgresso(JSON.stringify({ versao: 2, assistidos: [1], notas: {} })).assistidos,
    ).toEqual([])
  })

  it('avisa os ouvintes e para de avisar depois de cancelar', () => {
    const armazem = criarArmazemProgresso()
    const aviso = vi.fn()
    const cancelar = armazem.assinar(aviso)
    armazem.alternarAssistido(1)
    cancelar()
    armazem.reiniciar()
    expect(aviso).toHaveBeenCalledTimes(1)
    expect(armazem.ler().assistidos).toEqual([])
  })
})
/* Fim dos testes do armazém de progresso. */
