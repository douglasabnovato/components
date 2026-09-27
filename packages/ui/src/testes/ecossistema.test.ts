/*
 * Testes do mapa do ecossistema: unicidade e endereços em desenvolvimento e publicado.
 */
import { describe, expect, it } from 'vitest'
import {
  ecossistema,
  enderecoDaApi,
  enderecoDoHub,
  enderecoDoProjeto,
  proxyDaApi,
} from '../utilitarios/ecossistema'

describe('ecossistema', () => {
  it('tem números, pastas e portas únicos', () => {
    expect(new Set(ecossistema.map((p) => p.numero)).size).toBe(ecossistema.length)
    expect(new Set(ecossistema.map((p) => p.slug)).size).toBe(ecossistema.length)
    expect(new Set(ecossistema.map((p) => p.porta)).size).toBe(ecossistema.length)
  })

  it('monta endereços de desenvolvimento e publicados', () => {
    expect(enderecoDoProjeto(8, '/stack', true)).toBe('http://localhost:5178/stack')
    expect(enderecoDoProjeto(8, 'stack', false)).toBe('/trilha/stack')
    expect(enderecoDoProjeto(4, 'contato', true)).toBe('http://localhost:5174/formularios/contato')
    expect(enderecoDoHub(6, false)).toBe('/#filho-6')
    expect(enderecoDoHub(undefined, true)).toBe('http://localhost:5170/')
    expect(enderecoDaApi()).toBe('/api')
    expect(proxyDaApi()['/api'].rewrite('/api/clientes')).toBe('/clientes')
  })

  it('recusa projeto inexistente', () => {
    expect(() => enderecoDoProjeto(42)).toThrow('não existe')
  })
})
/* Fim dos testes do ecossistema. */
