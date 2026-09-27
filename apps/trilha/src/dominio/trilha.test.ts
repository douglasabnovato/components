/*
 * Testes das regras da Trilha: integridade do conteúdo (R1), duração (R2),
 * "continuar" (R3), filtros (R4) e cruzamento com a stack.
 */
import { describe, expect, it } from 'vitest'
import { categorias, tecnologias } from '../dados/stack'
import { aprendizados, modulos } from '../dados/trilha'
import { aplicacoes } from './aplicacoes'
import { formatarMinutos, minutosPorExtenso, paraMinutos } from './duracao'
import { filtrar, filtrosVazios, lerFiltros, paraParametros } from './filtros'
import { contarStack, filtrarTecnologias, lerFiltrosStack } from './stack'
import { esquemaAprendizado, esquemaModulo, esquemaTecnologia } from './tipos'
import {
  aprendizadosDoModulo,
  normalizarTexto,
  problemasDaTrilha,
  proximoPendente,
  resumir,
  tecnologiasDoAprendizado,
  vizinhos,
} from './trilha'

describe('R1 · integridade da trilha', () => {
  it('tem 12 módulos e 116 aprendizados válidos, numerados de 1 a 116', () => {
    expect(modulos).toHaveLength(12)
    expect(aprendizados).toHaveLength(116)
    modulos.forEach((m) => esquemaModulo.parse(m))
    aprendizados.forEach((a) => esquemaAprendizado.parse(a))
    expect(problemasDaTrilha()).toEqual([])
  })

  it('tem 10 aprendizados por módulo, exceto o último com 6', () => {
    expect(modulos.map((m) => aprendizadosDoModulo(m.numero).length)).toEqual([
      10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 6,
    ])
  })

  it('detecta buracos, módulo inexistente e vídeo repetido', () => {
    const [a1, a2] = aprendizados as [(typeof aprendizados)[0], (typeof aprendizados)[0]]
    const quebrada = [a1, { ...a2, numero: 5, modulo: 99, youtubeId: a1.youtubeId }]
    expect(problemasDaTrilha(quebrada, modulos.slice(0, 1), 2)).toEqual([
      'Esperado aprendizado 2, veio 5',
      'Aprendizado 5 aponta para módulo inexistente 99',
      'Há vídeos repetidos na trilha',
    ])
  })

  it('marca históricos, vídeos em inglês e autores', () => {
    expect(aprendizados.filter((a) => a.historico)).toHaveLength(16)
    expect(aprendizados.filter((a) => a.idioma === 'en').map((a) => a.numero)).toEqual([11, 33])
    expect(aprendizados.find((a) => a.numero === 34)?.autor).toBe('Will Dev')
  })
})

describe('R1 · stack', () => {
  it('tem 93 tecnologias válidas em 13 categorias, apontando para aprendizados existentes', () => {
    expect(categorias).toHaveLength(13)
    expect(tecnologias).toHaveLength(93)
    tecnologias.forEach((t) => esquemaTecnologia.parse(t))
    const numeros = new Set(aprendizados.map((a) => a.numero))
    for (const t of tecnologias) for (const n of t.aprendizados) expect(numeros.has(n)).toBe(true)
  })

  it('expande intervalos como 98–100 e 21–36', () => {
    expect(tecnologias.find((t) => t.numero === 27)?.aprendizados).toEqual([98, 99, 100])
    expect(tecnologias.find((t) => t.numero === 85)?.aprendizados).toHaveLength(16)
  })

  it('só aplica tecnologias existentes em projetos existentes', () => {
    const existentes = new Set(tecnologias.map((t) => t.numero))
    for (const [numero, destino] of Object.entries(aplicacoes)) {
      expect(existentes.has(Number(numero))).toBe(true)
      if (destino !== 'todos') destino.forEach((p) => expect(p).toBeLessThanOrEqual(8))
    }
  })

  it('conta por status e filtra por status, busca e hub', () => {
    const c = contarStack()
    expect(c.atual + c.transicao + c.historico).toBe(93)
    expect(c.historico).toBe(7)
    const zod = filtrarTecnologias(lerFiltrosStack(new URLSearchParams('busca=zod')))
    expect(zod.map((t) => t.nome)).toContain('Zod')
    const historicasNoHub = filtrarTecnologias(
      lerFiltrosStack(new URLSearchParams('status=historico&hub=sim')),
    )
    expect(historicasNoHub.map((t) => t.numero)).toEqual([20])
  })
})

describe('R2 · duração derivada', () => {
  it('converte o texto em minutos e formata de volta', () => {
    expect(paraMinutos('46 min')).toBe(46)
    expect(paraMinutos('2h34')).toBe(154)
    expect(paraMinutos('1h05')).toBe(65)
    expect(() => paraMinutos('uma hora')).toThrow('Duração inválida')
    expect(formatarMinutos(45)).toBe('45 min')
    expect(formatarMinutos(120)).toBe('2h')
    expect(formatarMinutos(125)).toBe('2h05')
    expect(minutosPorExtenso(61)).toBe('1 hora e 1 minuto')
    expect(minutosPorExtenso(0)).toBe('0 minutos')
  })

  it('soma o módulo e desconta o que já foi assistido', () => {
    const modulo1 = aprendizadosDoModulo(1)
    const total = resumir(modulo1, new Set())
    expect(total.minutos).toBe(46 + 20 + 13 + 22 + 9 + 5 + 6 + 9 + 5 + 4)
    const parcial = resumir(modulo1, new Set([1, 2]))
    expect(parcial.assistidos).toBe(2)
    expect(parcial.minutosRestantes).toBe(total.minutos - 66)
    expect(parcial.percentual).toBe(20)
  })
})

describe('R3 · continuar', () => {
  it('aponta para o primeiro não assistido na ordem da trilha', () => {
    expect(proximoPendente(new Set())?.numero).toBe(1)
    expect(proximoPendente(new Set([1, 2, 4]))?.numero).toBe(3)
    expect(proximoPendente(new Set(aprendizados.map((a) => a.numero)))).toBeNull()
  })

  it('encontra anterior e próximo', () => {
    expect(vizinhos(1).anterior).toBeNull()
    expect(vizinhos(1).proximo?.numero).toBe(2)
    expect(vizinhos(116).proximo).toBeNull()
  })
})

describe('R4 · filtros na URL', () => {
  it('lê, ignora valores inválidos e escreve só o que difere do padrão', () => {
    const filtros = lerFiltros(
      new URLSearchParams('modulo=3&situacao=pendentes&historicos=ocultar'),
    )
    expect(filtros).toEqual({ modulo: 3, situacao: 'pendentes', busca: '', semHistoricos: true })
    expect(lerFiltros(new URLSearchParams('modulo=99&situacao=xyz'))).toEqual(filtrosVazios)
    expect(paraParametros(filtros).toString()).toBe(
      'modulo=3&situacao=pendentes&historicos=ocultar',
    )
    expect(paraParametros(filtrosVazios).toString()).toBe('')
  })

  it('filtra por módulo, situação, históricos e busca sem acentos', () => {
    const assistidos = new Set([21, 22])
    const pendentes3 = filtrar(
      aprendizados,
      { ...filtrosVazios, modulo: 3, situacao: 'pendentes' },
      assistidos,
    )
    expect(pendentes3).toHaveLength(8)
    const semHistoricos = filtrar(
      aprendizados,
      { ...filtrosVazios, semHistoricos: true },
      assistidos,
    )
    expect(semHistoricos).toHaveLength(116 - 16)
    const busca = filtrar(
      aprendizados,
      { ...filtrosVazios, busca: 'ESTRUTURA DE PASTAS' },
      assistidos,
    )
    expect(busca.map((a) => a.numero)).toEqual([1, 11, 17, 89])
    expect(normalizarTexto('  Ação ')).toBe('acao')
  })
})

describe('cruzamento com a stack', () => {
  it('lista as tecnologias de um aprendizado', () => {
    expect(tecnologiasDoAprendizado(14).map((t) => t.nome)).toEqual(['Estado derivado'])
  })
})
/* Fim dos testes das regras da trilha. */
