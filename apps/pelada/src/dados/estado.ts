/*
 * Estado da Pelada com hooks puros: um reducer para as ações sobre os jogos
 * e um hook que o persiste no localStorage (useReducer + useEffect), numa
 * chave exclusiva. Dados inválidos no navegador voltam ao estado inicial.
 */
import { createContext, useContext, useEffect, useReducer, type Dispatch } from 'react'
import { estadoInicial } from '../dominio/seed'
import { esquemaEstado, type EstadoPelada, type Jogo } from '../dominio/tipos'

export const CHAVE_PELADA = 'components:pelada:estado:v1'

export type Acao =
  | { tipo: 'criar'; jogo: Jogo }
  | { tipo: 'atualizar'; jogo: Jogo }
  | { tipo: 'excluir'; id: string }
  | { tipo: 'restaurar'; jogo: Jogo; posicao: number }
  | { tipo: 'organizador'; usuario: string }
  | { tipo: 'reiniciar'; estado: EstadoPelada }

/* Reducer puro: recebe o estado e uma ação, devolve o estado novo. */
export function reducer(estado: EstadoPelada, acao: Acao): EstadoPelada {
  switch (acao.tipo) {
    case 'criar':
      return { ...estado, jogos: [...estado.jogos, acao.jogo] }
    case 'atualizar':
      return {
        ...estado,
        jogos: estado.jogos.map((j) => (j.id === acao.jogo.id ? acao.jogo : j)),
      }
    case 'excluir':
      return { ...estado, jogos: estado.jogos.filter((j) => j.id !== acao.id) }
    case 'restaurar': {
      const jogos = [...estado.jogos]
      jogos.splice(Math.min(acao.posicao, jogos.length), 0, acao.jogo)
      return { ...estado, jogos }
    }
    case 'organizador':
      return { ...estado, organizador: acao.usuario.trim().replace(/^@/, '') }
    case 'reiniciar':
      return acao.estado
  }
}

/* Lê o estado salvo; qualquer problema devolve null. */
export function lerEstado(texto: string | null): EstadoPelada | null {
  if (!texto) return null
  try {
    const resultado = esquemaEstado.safeParse(JSON.parse(texto))
    return resultado.success ? resultado.data : null
  } catch {
    return null
  }
}

/* useReducer com carga preguiçosa do localStorage e gravação a cada mudança. */
export function usePeladaPersistente(armazenamento: Storage = window.localStorage) {
  const [estado, despachar] = useReducer(
    reducer,
    armazenamento,
    (a) => lerEstado(a.getItem(CHAVE_PELADA)) ?? estadoInicial(),
  )

  useEffect(() => {
    armazenamento.setItem(CHAVE_PELADA, JSON.stringify(estado))
  }, [estado, armazenamento])

  return [estado, despachar] as const
}

type ContextoPelada = {
  estado: EstadoPelada
  despachar: Dispatch<Acao>
  agora: () => Date
  novoId: () => string
}

export const PeladaContexto = createContext<ContextoPelada | null>(null)

/* Devolve estado, despacho e utilitários; exige o provedor no App. */
export function usePelada() {
  const valor = useContext(PeladaContexto)
  if (!valor) throw new Error('usePelada precisa de um PeladaContexto.Provider')
  return valor
}
/* Fim do estado da Pelada. */
