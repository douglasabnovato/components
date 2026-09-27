/*
 * Filtros da Trilha guardados na URL (R4): módulo, situação, busca e
 * históricos. A URL é a fonte da verdade; o componente só lê e escreve nela.
 */
import { normalizarTexto } from './trilha'
import type { Aprendizado } from './tipos'

export type Situacao = 'todos' | 'pendentes' | 'assistidos'

export type Filtros = {
  modulo: number | null
  situacao: Situacao
  busca: string
  semHistoricos: boolean
}

export const filtrosVazios: Filtros = {
  modulo: null,
  situacao: 'todos',
  busca: '',
  semHistoricos: false,
}

const SITUACOES: Situacao[] = ['todos', 'pendentes', 'assistidos']

/* Lê os filtros dos parâmetros da URL, ignorando valores inválidos. */
export function lerFiltros(parametros: URLSearchParams, totalModulos = 12): Filtros {
  const modulo = Number(parametros.get('modulo'))
  const situacao = parametros.get('situacao') as Situacao | null
  return {
    modulo: Number.isInteger(modulo) && modulo >= 1 && modulo <= totalModulos ? modulo : null,
    situacao: situacao && SITUACOES.includes(situacao) ? situacao : 'todos',
    busca: parametros.get('busca')?.trim() ?? '',
    semHistoricos: parametros.get('historicos') === 'ocultar',
  }
}

/* Converte filtros em parâmetros, omitindo os valores padrão (URL limpa). */
export function paraParametros(filtros: Filtros): URLSearchParams {
  const p = new URLSearchParams()
  if (filtros.modulo) p.set('modulo', String(filtros.modulo))
  if (filtros.situacao !== 'todos') p.set('situacao', filtros.situacao)
  if (filtros.busca) p.set('busca', filtros.busca)
  if (filtros.semHistoricos) p.set('historicos', 'ocultar')
  return p
}

/* Diz se algum filtro está ativo. */
export function temFiltro(filtros: Filtros) {
  return paraParametros(filtros).size > 0
}

/* Aplica os filtros a uma lista de aprendizados. */
export function filtrar(
  lista: Aprendizado[],
  filtros: Filtros,
  assistidos: ReadonlySet<number>,
): Aprendizado[] {
  const termo = normalizarTexto(filtros.busca)
  return lista.filter((a) => {
    if (filtros.modulo && a.modulo !== filtros.modulo) return false
    if (filtros.semHistoricos && a.historico) return false
    if (filtros.situacao === 'pendentes' && assistidos.has(a.numero)) return false
    if (filtros.situacao === 'assistidos' && !assistidos.has(a.numero)) return false
    if (!termo) return true
    const texto = normalizarTexto(`${a.numero} ${a.titulo} ${a.descricao} ${a.autor ?? ''}`)
    return texto.includes(termo)
  })
}
/* Fim dos filtros. */
