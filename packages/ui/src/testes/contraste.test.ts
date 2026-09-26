/*
 * Testes dos utilitários de contraste com valores de referência da WCAG.
 */
import { describe, expect, it } from 'vitest'
import { corDoTextoSobre, nivelWcag, razaoContraste } from '../utilitarios/contraste'

describe('contraste', () => {
  it('calcula 21:1 entre preto e branco', () => {
    expect(razaoContraste('#000', '#fff')).toBeCloseTo(21, 5)
  })

  it('escolhe texto escuro em fundo claro e claro em fundo escuro', () => {
    expect(corDoTextoSobre('#2ac3c9')).toBe('#0B0C10')
    expect(corDoTextoSobre('#a50f16')).toBe('#FFFFFF')
  })

  it('classifica os níveis', () => {
    expect(nivelWcag(7.2)).toBe('AAA')
    expect(nivelWcag(4.6)).toBe('AA')
    expect(nivelWcag(3)).toBe('Insuficiente')
  })

  it('rejeita cor inválida', () => {
    expect(() => razaoContraste('azul', '#fff')).toThrow('Cor inválida')
  })
})
/* Fim dos testes de contraste. */
