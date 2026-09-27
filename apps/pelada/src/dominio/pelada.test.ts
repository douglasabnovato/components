/*
 * Testes das regras da Pelada: confirmação (P1, P2), desistência com
 * promoção da espera (P3, P4), sorteio equilibrado (P5), texto (P6) e a
 * limpeza do sorteio quando a lista muda (P7).
 */
import { describe, expect, it } from 'vitest'
import {
  confirmar,
  desistir,
  forcaDoTime,
  formatarData,
  normalizarNome,
  situacaoDoJogo,
  sortearTimes,
  textoParaCompartilhar,
  timesDoSorteio,
  validarDataFutura,
} from './pelada'
import { jogosIniciais } from './seed'
import { esquemaEstado, esquemaNovoJogo, type Jogo } from './tipos'

const agora = new Date('2026-09-26T12:00:00')
const [society, rachao, futsal] = jogosIniciais(agora) as [Jogo, Jogo, Jogo]

/* Gerador pseudoaleatório previsível para o sorteio. */
function sequencia(semente = 7) {
  let x = semente
  return () => {
    x = (x * 16807) % 2147483647
    return (x - 1) / 2147483646
  }
}

describe('jogos iniciais', () => {
  it('são válidos e têm datas futuras relativas a hoje', () => {
    esquemaEstado.parse({ versao: 1, organizador: 'x', jogos: jogosIniciais(agora) })
    expect(society.data).toBe('2026-09-28T19:00')
    expect(futsal.data).toBe('2026-10-03T20:30')
    expect(situacaoDoJogo(society, agora)).toBe('aberto')
    expect(situacaoDoJogo(futsal, agora)).toBe('lotado')
    expect(situacaoDoJogo(society, new Date('2026-10-01T00:00'))).toBe('encerrado')
  })
})

describe('P1 e P2 · confirmar', () => {
  it('entra nos confirmados enquanto houver vaga', () => {
    const r = confirmar(society, { nome: '  Maria   Clara ', nivel: 4 }, 'm1', agora)
    expect(r.ok && r.valor.destino).toBe('confirmados')
    if (!r.ok) return
    expect(r.valor.jogo.confirmados.at(-1)).toMatchObject({
      id: 'm1',
      nome: 'Maria Clara',
      nivel: 4,
    })
    expect(society.confirmados).toHaveLength(10)
  })

  it('vai para a espera quando a lista está cheia', () => {
    const r = confirmar(futsal, { nome: 'Nova', nivel: 2 }, 'n1', agora)
    expect(r.ok && r.valor.destino).toBe('espera')
    expect(r.ok && r.valor.jogo.espera.map((j) => j.nome)).toEqual(['Ana Luiza', 'Bruno', 'Nova'])
  })

  it('recusa nome repetido (sem acento e sem caixa), curto e jogo encerrado', () => {
    expect(confirmar(society, { nome: 'ana luíza', nivel: 3 }, 'x', agora)).toEqual({
      ok: false,
      erro: 'ana luíza já está na lista deste jogo.',
    })
    expect(confirmar(futsal, { nome: 'DANI', nivel: 3 }, 'x', agora).ok).toBe(false)
    expect(confirmar(society, { nome: 'A', nivel: 3 }, 'x', agora)).toEqual({
      ok: false,
      erro: 'Informe um nome entre 2 e 40 letras.',
    })
    expect(confirmar(society, { nome: 'Zé', nivel: 3 }, 'x', new Date('2027-01-01')).ok).toBe(false)
    expect(normalizarNome(' Ána  Luíza ')).toBe('ana luiza')
  })
})

describe('P3 e P4 · desistir', () => {
  it('o primeiro da espera sobe quando um confirmado sai', () => {
    const saiu = futsal.confirmados[0]!
    const { jogo, promovido } = desistir(futsal, saiu.id)
    expect(promovido?.nome).toBe('Ana Luiza')
    expect(jogo.confirmados).toHaveLength(10)
    expect(jogo.confirmados.at(-1)?.nome).toBe('Ana Luiza')
    expect(jogo.espera.map((j) => j.nome)).toEqual(['Bruno'])
  })

  it('sair da espera não mexe nos confirmados', () => {
    const { jogo, promovido } = desistir(futsal, futsal.espera[0]!.id)
    expect(promovido).toBeNull()
    expect(jogo.confirmados).toEqual(futsal.confirmados)
    expect(jogo.espera.map((j) => j.nome)).toEqual(['Bruno'])
  })
})

describe('P5 · sorteio equilibrado', () => {
  it('explica quantos jogadores faltam', () => {
    const treze = confirmar(society, { nome: 'Treze', nivel: 3 }, 't', agora)
    if (!treze.ok) throw new Error(treze.erro)
    const doze = {
      ...society,
      confirmados: [...society.confirmados, ...jogosIniciais(agora)[1]!.confirmados.slice(0, 3)],
    }
    expect(sortearTimes(doze, agora)).toEqual({
      ok: false,
      erro: 'Faltam 1 jogador para formar 2 times de 7.',
    })
    const falta4 = sortearTimes(society, agora)
    expect(falta4).toEqual({ ok: false, erro: 'Faltam 4 jogadores para formar 2 times de 7.' })
  })

  it('forma times completos, deixa reservas pela ordem e equilibra as forças', () => {
    const r = sortearTimes(rachao, agora, sequencia())
    expect(r.ok).toBe(false)
    const cheio = confirmar(rachao, { nome: 'Último', nivel: 1 }, 'u1', agora)
    if (!cheio.ok) throw new Error(cheio.erro)
    const sorteado = sortearTimes(cheio.valor.jogo, agora, sequencia())
    if (!sorteado.ok) throw new Error(sorteado.erro)
    const exibicao = timesDoSorteio(sorteado.valor)!
    expect(exibicao.times).toHaveLength(2)
    expect(exibicao.times.every((t) => t.length === 11)).toBe(true)
    expect(exibicao.reservas).toEqual([])
    const [a, b] = exibicao.times.map(forcaDoTime) as [number, number]
    expect(Math.abs(a - b)).toBeLessThanOrEqual(4)
  })

  it('manda para reserva quem confirmou por último', () => {
    const doze = {
      ...futsal,
      vagas: 12,
      confirmados: [...futsal.confirmados, ...futsal.espera],
      espera: [],
    }
    const r = sortearTimes(doze, agora, sequencia(3))
    if (!r.ok) throw new Error(r.erro)
    expect(timesDoSorteio(r.valor)!.reservas.map((j) => j.nome)).toEqual(['Ana Luiza', 'Bruno'])
  })

  it('P7 · qualquer mudança na lista apaga o sorteio', () => {
    const r = sortearTimes(futsal, agora, sequencia())
    if (!r.ok) throw new Error(r.erro)
    expect(r.valor.sorteio).not.toBeNull()
    expect(desistir(r.valor, r.valor.espera[0]!.id).jogo.sorteio).toBeNull()
    const nova = confirmar(r.valor, { nome: 'Outra', nivel: 3 }, 'o', agora)
    expect(nova.ok && nova.valor.jogo.sorteio).toBeNull()
  })
})

describe('P6 · texto e datas', () => {
  it('formata a data e monta o texto para o grupo', () => {
    expect(formatarData('2026-10-03T09:00')).toBe('Sáb, 03 out · 9h')
    expect(formatarData('2026-10-03T20:30')).toBe('Sáb, 03 out · 20h30')
    const texto = textoParaCompartilhar(futsal)
    expect(texto).toContain('⚽ Futsal da firma')
    expect(texto).toContain('Confirmados (10/10):')
    expect(texto).toContain('Lista de espera:\n1. Ana Luiza\n2. Bruno')
    expect(textoParaCompartilhar(society)).toContain('Vagas abertas: 4')
  })
})

describe('novo jogo', () => {
  it('valida os campos e exige vagas para 2 times e data futura', () => {
    const base = {
      titulo: 'Jogo',
      modalidade: 'Futsal',
      data: '2026-10-10T20:00',
      local: 'Ginásio',
      vagas: 10,
      porTime: 5,
    }
    expect(esquemaNovoJogo.safeParse(base).success).toBe(true)
    const r = esquemaNovoJogo.safeParse({ ...base, vagas: 8 })
    expect(r.success).toBe(false)
    expect(r.error?.issues[0]?.message).toBe('As vagas precisam formar pelo menos 2 times.')
    expect(validarDataFutura('2026-01-01T10:00', agora)).toBe('Escolha uma data no futuro.')
    expect(validarDataFutura(base.data, agora)).toBeNull()
  })
})
/* Fim dos testes das regras da Pelada. */
