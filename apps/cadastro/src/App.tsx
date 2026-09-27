/*
 * App do Cadastro: cache do TanStack Query, os dois repositórios (memória e
 * API) disponíveis por contexto, avisos e rotas. Os repositórios podem ser
 * injetados nos testes.
 */
import { ProvedorAvisos } from '@components/ui'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { Route, Routes } from 'react-router'
import { URL_API } from './config'
import { Layout } from './componentes/Layout/Layout'
import { RepositoriosContexto } from './dados/consultas'
import type { Origem, RepositorioClientes } from './dados/repositorio'
import { criarRepositorioHttp } from './dados/repositorioHttp'
import { criarRepositorioMemoria } from './dados/repositorioMemoria'
import { Clientes } from './paginas/Clientes/Clientes'
import { NaoEncontrado } from './paginas/NaoEncontrado/NaoEncontrado'

type Props = { repositorios?: Record<Origem, RepositorioClientes> }

/* Cria cache e repositórios uma vez e declara as rotas. */
export function App({ repositorios }: Props) {
  const [cliente] = useState(() => new QueryClient())
  const [repos] = useState(
    () =>
      repositorios ?? { memoria: criarRepositorioMemoria(), api: criarRepositorioHttp(URL_API) },
  )

  return (
    <QueryClientProvider client={cliente}>
      <RepositoriosContexto.Provider value={repos}>
        <ProvedorAvisos>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Clientes />} />
              <Route path="*" element={<NaoEncontrado />} />
            </Route>
          </Routes>
        </ProvedorAvisos>
      </RepositoriosContexto.Provider>
    </QueryClientProvider>
  )
}
/* Fim do App. */
