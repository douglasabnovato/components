/*
 * Store do Redux: junta a fatia de interface e o cache do RTK Query.
 * Cada App cria o seu (fetch injetável nos testes).
 */
import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { useDispatch, useSelector } from 'react-redux'
import { criarApiTarefas, type ApiTarefas } from './api'
import { interfaceSlice } from './interface'

/* Cria store e API juntos. */
export function criarStore(base: string, fetchFn?: typeof fetch) {
  const api = criarApiTarefas(base, fetchFn)
  const store = configureStore({
    reducer: {
      interface: interfaceSlice.reducer,
      [api.reducerPath]: api.reducer,
    },
    middleware: (padrao) => padrao().concat(api.middleware),
  })
  setupListeners(store.dispatch)
  return { store, api }
}

type Store = ReturnType<typeof criarStore>['store']
export type EstadoRaiz = ReturnType<Store['getState']>
export type Despacho = Store['dispatch']

export const useDespacho = useDispatch.withTypes<Despacho>()
export const useSeletor = useSelector.withTypes<EstadoRaiz>()
export type { ApiTarefas }
/* Fim da store. */
