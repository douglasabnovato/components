/*
 * App do Flix: provedores (dados, cache e avisos) e mapa de rotas.
 * O roteador fica fora (main.tsx), o que permite testar com MemoryRouter.
 */
import { ProvedorAvisos } from '@components/ui'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { Route, Routes } from 'react-router'
import { Layout } from './componentes/Layout/Layout'
import { RepositorioContexto } from './dados/consultas'
import type { RepositorioCatalogo } from './dados/repositorio'
import { criarRepositorioLocal } from './dados/repositorioLocal'
import { Assistir } from './paginas/Assistir/Assistir'
import { FormularioVideo } from './paginas/FormularioVideo/FormularioVideo'
import { Inicio } from './paginas/Inicio/Inicio'
import { NaoEncontrado } from './paginas/NaoEncontrado/NaoEncontrado'
import { Painel } from './paginas/Painel/Painel'

type Props = { repositorio?: RepositorioCatalogo }

/* Monta os provedores uma vez e declara as rotas. */
export function App({ repositorio }: Props) {
  const [cliente] = useState(() => new QueryClient())
  const [repo] = useState(() => repositorio ?? criarRepositorioLocal())

  return (
    <QueryClientProvider client={cliente}>
      <RepositorioContexto.Provider value={repo}>
        <ProvedorAvisos>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Inicio />} />
              <Route path="assistir/:id" element={<Assistir />} />
              <Route path="painel" element={<Painel />} />
              <Route path="painel/videos/novo" element={<FormularioVideo />} />
              <Route path="painel/videos/:id/editar" element={<FormularioVideo />} />
              <Route path="*" element={<NaoEncontrado />} />
            </Route>
          </Routes>
        </ProvedorAvisos>
      </RepositorioContexto.Provider>
    </QueryClientProvider>
  )
}
/* Fim do App. */
