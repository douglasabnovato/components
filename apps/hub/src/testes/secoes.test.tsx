/*
 * Testes da pré-carga das seções no tempo ocioso (#34): o módulo é pedido uma
 * vez só, o pedido espera o tempo ocioso (com prazo) e, sem a API, o hub
 * segue montando as seções.
 */
import { cleanup, render, waitFor } from '@testing-library/react'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { App } from '../App'
import { PRAZO_OCIOSO_MS, pedirSecoes, quandoOcioso } from '../secoes/pedirSecoes'

/* Baixa o módulo das seções uma vez, para o tempo de transformação não cair no teste. */
beforeAll(async () => {
  await pedirSecoes()
}, 120_000)

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

describe('Pedido das seções', () => {
  it('devolve a mesma promessa em toda chamada (um pedido só)', () => {
    expect(pedirSecoes()).toBe(pedirSecoes())
  })

  it('usa o requestIdleCallback com prazo quando existe', () => {
    const pedir = vi.fn<typeof window.requestIdleCallback>(() => 7)
    const cancelar = vi.fn()
    vi.stubGlobal('requestIdleCallback', pedir)
    vi.stubGlobal('cancelIdleCallback', cancelar)
    const fazer = vi.fn()
    const parar = quandoOcioso(fazer)
    expect(pedir).toHaveBeenCalledTimes(1)
    expect(pedir.mock.calls[0]?.[1]).toEqual({ timeout: PRAZO_OCIOSO_MS })
    parar()
    expect(cancelar).toHaveBeenCalledWith(7)
  })

  it('cai no setTimeout quando o navegador não tem requestIdleCallback', async () => {
    vi.stubGlobal('requestIdleCallback', undefined)
    const fazer = vi.fn()
    quandoOcioso(fazer)
    await waitFor(() => expect(fazer).toHaveBeenCalledTimes(1))
  })
})

describe('App com pré-carga no tempo ocioso', () => {
  it('só monta as seções depois do tempo ocioso, com um pedido de tempo ocioso só', async () => {
    const pendentes: IdleRequestCallback[] = []
    const pedir = vi.fn((fazer: IdleRequestCallback) => pendentes.push(fazer))
    vi.stubGlobal('requestIdleCallback', pedir)
    vi.stubGlobal('cancelIdleCallback', vi.fn())

    render(<App />)
    await waitFor(() => expect(pedir).toHaveBeenCalledTimes(1))
    expect(document.getElementById('arquitetura')).toBeNull()

    pendentes[0]?.({ didTimeout: false, timeRemaining: () => 50 })
    await waitFor(() => expect(document.getElementById('arquitetura')).not.toBeNull(), {
      timeout: 15_000,
    })
    expect(pedir).toHaveBeenCalledTimes(1)
  })
})
/* Fim dos testes da pré-carga das seções. */
