/*
 * App das Tarefas: cria a store do Redux (com a API do RTK Query), entrega a
 * API por contexto e mostra a página. O fetch pode ser injetado nos testes.
 */
import { ProvedorAvisos } from '@components/ui'
import { useState } from 'react'
import { Provider } from 'react-redux'
import { URL_API } from './config'
import { Tarefas } from './paginas/Tarefas/Tarefas'
import { ApiContexto } from './store/contexto'
import { criarStore } from './store/store'

type Props = { base?: string; fetchFn?: typeof fetch }

/* Cria store e API uma vez por App. */
export function App({ base = URL_API, fetchFn }: Props) {
  const [{ store, api }] = useState(() => criarStore(base, fetchFn))
  return (
    <Provider store={store}>
      <ApiContexto.Provider value={api}>
        <ProvedorAvisos>
          <Tarefas />
        </ProvedorAvisos>
      </ApiContexto.Provider>
    </Provider>
  )
}
/* Fim do App. */
