/*
 * Testes do aviso de servidor fora do ar na seção 04 (#37): no site
 * publicado, o hub consulta /api/saude e avisa ao lado do link quando o
 * servidor do Formulários não responde. Em desenvolvimento, não consulta.
 */
import { act, render, renderHook, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { violacoesAxe } from '@components/ui/testes/axe'
import { SecaoServidor } from '../secoes/Servidor/SecaoServidor'
import { useServidorNoAr } from '../secoes/Servidor/useServidorNoAr'

const textoAviso = /O servidor desta demonstração está fora do ar/

function respostaJson(corpo: unknown, status = 200) {
  return new Response(JSON.stringify(corpo), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

afterEach(() => {
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
  vi.useRealTimers()
})

describe('useServidorNoAr', () => {
  it('não consulta em desenvolvimento', () => {
    const buscar = vi.fn()
    vi.stubGlobal('fetch', buscar)
    const { result } = renderHook(() => useServidorNoAr(false))
    expect(result.current).toBe('no-ar')
    expect(buscar).not.toHaveBeenCalled()
  })

  it('fica "no-ar" com /api/saude respondendo { ok: true }', async () => {
    const buscar = vi.fn().mockResolvedValue(respostaJson({ ok: true }))
    vi.stubGlobal('fetch', buscar)
    const { result } = renderHook(() => useServidorNoAr(true))
    expect(result.current).toBe('verificando')
    await waitFor(() => expect(result.current).toBe('no-ar'))
    expect(buscar).toHaveBeenCalledWith('/api/saude', expect.anything())
  })

  it('fica "fora" com 504 do encaminhamento ou falha de rede', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(respostaJson({ erro: 'x' }, 504)))
    const com504 = renderHook(() => useServidorNoAr(true))
    await waitFor(() => expect(com504.result.current).toBe('fora'))

    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))
    const semRede = renderHook(() => useServidorNoAr(true))
    await waitFor(() => expect(semRede.result.current).toBe('fora'))
  })

  it('desiste no prazo da API quando o servidor não responde', async () => {
    vi.useFakeTimers()
    vi.stubGlobal(
      'fetch',
      vi.fn(
        (_url: string, opcoes: RequestInit) =>
          new Promise((_resolver, rejeitar) => {
            opcoes.signal?.addEventListener('abort', () => rejeitar(new Error('abortado')))
          }),
      ),
    )
    const { result } = renderHook(() => useServidorNoAr(true))
    expect(result.current).toBe('verificando')
    await act(() => vi.advanceTimersByTimeAsync(15_000))
    expect(result.current).toBe('fora')
  })
})

describe('Seção 04 no site publicado', () => {
  it('avisa ao lado do link quando o servidor está fora do ar, sem violações do axe', async () => {
    vi.stubEnv('PROD', true)
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(respostaJson({}, 502)))
    const { container } = render(<SecaoServidor />)
    expect(await screen.findByText(textoAviso)).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent(textoAviso)
    expect(screen.getByRole('link', { name: 'Abrir Formulários no Servidor' })).toBeInTheDocument()
    expect(await violacoesAxe(container)).toEqual([])
  })

  it('não avisa com o servidor no ar', async () => {
    vi.stubEnv('PROD', true)
    const buscar = vi.fn().mockResolvedValue(respostaJson({ ok: true }))
    vi.stubGlobal('fetch', buscar)
    render(<SecaoServidor />)
    await waitFor(() => expect(buscar).toHaveBeenCalled())
    /* Espera a resposta e o corpo serem lidos antes de conferir. */
    await act(async () => {
      await buscar.mock.results[0]!.value
      await new Promise((resolver) => setTimeout(resolver, 0))
    })
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
  })
})
/* Fim dos testes do aviso de servidor. */
