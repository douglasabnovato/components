/*
 * Contexto que entrega a instância da API (RTK Query) criada pelo App, para
 * os componentes usarem os hooks gerados (useListarTarefasQuery etc.).
 */
import { createContext, useContext } from 'react'
import type { ApiTarefas } from './api'

export const ApiContexto = createContext<ApiTarefas | null>(null)

/* Devolve a API; exige o provedor no App. */
export function useApiTarefas() {
  const api = useContext(ApiContexto)
  if (!api) throw new Error('useApiTarefas precisa de um ApiContexto.Provider')
  return api
}
/* Fim do contexto da API. */
