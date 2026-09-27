/*
 * Regras da página Stack: filtros por status, busca e aplicação no hub, e a
 * contagem por status (sempre derivada da lista de tecnologias).
 */
import { tecnologias as todas } from '../dados/stack'
import { projetosDaTecnologia } from './aplicacoes'
import type { StatusTecnologia, Tecnologia } from './tipos'
import { normalizarTexto } from './trilha'

export type FiltroStatus = StatusTecnologia | 'todas'

export type FiltrosStack = {
  status: FiltroStatus
  busca: string
  soNoHub: boolean
}

const STATUS: FiltroStatus[] = ['todas', 'atual', 'transicao', 'historico']

/* Lê os filtros da Stack a partir da URL. */
export function lerFiltrosStack(parametros: URLSearchParams): FiltrosStack {
  const status = parametros.get('status') as FiltroStatus | null
  return {
    status: status && STATUS.includes(status) ? status : 'todas',
    busca: parametros.get('busca')?.trim() ?? '',
    soNoHub: parametros.get('hub') === 'sim',
  }
}

/* Converte os filtros em parâmetros, omitindo os padrões. */
export function paraParametrosStack(filtros: FiltrosStack) {
  const p = new URLSearchParams()
  if (filtros.status !== 'todas') p.set('status', filtros.status)
  if (filtros.busca) p.set('busca', filtros.busca)
  if (filtros.soNoHub) p.set('hub', 'sim')
  return p
}

/* Diz se a tecnologia é aplicada em algum projeto do hub. */
export function aplicadaNoHub(tecnologia: Tecnologia) {
  const { todos, projetos } = projetosDaTecnologia(tecnologia)
  return todos || projetos.length > 0
}

/* Aplica os filtros da Stack. */
export function filtrarTecnologias(filtros: FiltrosStack, lista: Tecnologia[] = todas) {
  const termo = normalizarTexto(filtros.busca)
  return lista.filter((t) => {
    if (filtros.status !== 'todas' && t.status !== filtros.status) return false
    if (filtros.soNoHub && !aplicadaNoHub(t)) return false
    if (!termo) return true
    return normalizarTexto(`${t.nome} ${t.oQueE} ${t.paraQue}`).includes(termo)
  })
}

/* Conta as tecnologias por status e quantas são aplicadas no hub. */
export function contarStack(lista: Tecnologia[] = todas) {
  return {
    total: lista.length,
    atual: lista.filter((t) => t.status === 'atual').length,
    transicao: lista.filter((t) => t.status === 'transicao').length,
    historico: lista.filter((t) => t.status === 'historico').length,
    noHub: lista.filter(aplicadaNoHub).length,
  }
}
/* Fim das regras da Stack. */
