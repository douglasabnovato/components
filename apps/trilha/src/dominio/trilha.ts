/*
 * Regras de negócio da Trilha como funções puras. Totais, progresso, tempo
 * restante e "continuar" são sempre calculados a partir do conteúdo e da lista
 * de assistidos, nunca guardados (R2, R3).
 */
import { aprendizados as todos, modulos as todosModulos } from '../dados/trilha'
import { tecnologias as todasTecnologias } from '../dados/stack'
import { paraMinutos } from './duracao'
import type { Aprendizado, Modulo, Tecnologia } from './tipos'

export type Resumo = {
  total: number
  assistidos: number
  minutos: number
  minutosAssistidos: number
  minutosRestantes: number
  percentual: number
}

/* Remove acentos e caixa para comparar textos (busca). */
export function normalizarTexto(texto: string) {
  return texto
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
}

/* Soma a duração e o progresso de uma lista de aprendizados. */
export function resumir(lista: Aprendizado[], assistidos: ReadonlySet<number>): Resumo {
  let minutos = 0
  let minutosAssistidos = 0
  let feitos = 0
  for (const a of lista) {
    const m = paraMinutos(a.duracao)
    minutos += m
    if (assistidos.has(a.numero)) {
      feitos += 1
      minutosAssistidos += m
    }
  }
  return {
    total: lista.length,
    assistidos: feitos,
    minutos,
    minutosAssistidos,
    minutosRestantes: minutos - minutosAssistidos,
    percentual: lista.length ? Math.round((feitos / lista.length) * 100) : 0,
  }
}

/* Aprendizados de um módulo, na ordem da trilha. */
export function aprendizadosDoModulo(modulo: number, lista: Aprendizado[] = todos) {
  return lista.filter((a) => a.modulo === modulo)
}

/* Primeiro aprendizado ainda não assistido, na ordem da trilha (R3). */
export function proximoPendente(
  assistidos: ReadonlySet<number>,
  lista: Aprendizado[] = todos,
): Aprendizado | null {
  return lista.find((a) => !assistidos.has(a.numero)) ?? null
}

/* Aprendizado pelo número, ou null. */
export function aprendizadoPorNumero(numero: number, lista: Aprendizado[] = todos) {
  return lista.find((a) => a.numero === numero) ?? null
}

/* Módulo pelo número, ou null. */
export function moduloPorNumero(numero: number, lista: Modulo[] = todosModulos) {
  return lista.find((m) => m.numero === numero) ?? null
}

/* Anterior e próximo na ordem da trilha. */
export function vizinhos(numero: number, lista: Aprendizado[] = todos) {
  const indice = lista.findIndex((a) => a.numero === numero)
  return {
    anterior: indice > 0 ? (lista[indice - 1] ?? null) : null,
    proximo: indice >= 0 ? (lista[indice + 1] ?? null) : null,
  }
}

/* Tecnologias ensinadas num aprendizado (cruzamento com a stack). */
export function tecnologiasDoAprendizado(
  numero: number,
  lista: Tecnologia[] = todasTecnologias,
): Tecnologia[] {
  return lista.filter((t) => t.aprendizados.includes(numero))
}

/* Verifica a integridade da trilha (R1); devolve a lista de problemas. */
export function problemasDaTrilha(
  lista: Aprendizado[] = todos,
  listaModulos: Modulo[] = todosModulos,
  tamanhoModulo = 10,
): string[] {
  const problemas: string[] = []
  lista.forEach((a, i) => {
    if (a.numero !== i + 1) problemas.push(`Esperado aprendizado ${i + 1}, veio ${a.numero}`)
    if (!listaModulos.some((m) => m.numero === a.modulo))
      problemas.push(`Aprendizado ${a.numero} aponta para módulo inexistente ${a.modulo}`)
  })
  listaModulos.forEach((m, i) => {
    const qtd = aprendizadosDoModulo(m.numero, lista).length
    const ultimo = i === listaModulos.length - 1
    if (ultimo ? qtd < 1 || qtd > tamanhoModulo : qtd !== tamanhoModulo)
      problemas.push(`Módulo ${m.numero} tem ${qtd} aprendizados`)
  })
  const ids = new Set(lista.map((a) => a.youtubeId))
  if (ids.size !== lista.length) problemas.push('Há vídeos repetidos na trilha')
  return problemas
}
/* Fim das regras da trilha. */
