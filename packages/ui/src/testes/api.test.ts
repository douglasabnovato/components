/*
 * Testes das regras comuns da API: status de servidor fora do ar e o texto
 * que explica a falha em desenvolvimento e no site publicado.
 */
import { describe, expect, it } from 'vitest'
import { explicacaoApiFora, PRAZO_API_MS, statusForaDoAr } from '../utilitarios/api'

describe('statusForaDoAr', () => {
  it('reconhece 502, 503 e 504 do encaminhamento', () => {
    expect([502, 503, 504].map(statusForaDoAr)).toEqual([true, true, true])
  })

  it('não confunde erro da própria API nem falha de rede com servidor fora do ar', () => {
    expect([400, 404, 409, 500].map(statusForaDoAr)).toEqual([false, false, false, false])
    expect(statusForaDoAr('FETCH_ERROR')).toBe(false)
  })
})

describe('explicacaoApiFora', () => {
  it('ensina a ligar a API em desenvolvimento', () => {
    expect(explicacaoApiFora(true)).toContain('pnpm dev:api')
  })

  it('no site publicado diz que o servidor está fora do ar, sem comando', () => {
    const texto = explicacaoApiFora(false)
    expect(texto).toContain('fora do ar')
    expect(texto).not.toContain('pnpm')
  })

  it('espera no máximo 15 s', () => {
    expect(PRAZO_API_MS).toBe(15_000)
  })
})
/* Fim dos testes das regras da API. */
