/*
 * App do Laboratório: mapa de rotas. O roteador fica fora (main.tsx), o que
 * permite testar com MemoryRouter.
 */
import { Route, Routes } from 'react-router'
import { Layout } from './componentes/Layout/Layout'
import { Indice } from './paginas/Indice/Indice'
import { Licao } from './paginas/Licao/Licao'
import { NaoEncontrado } from './paginas/NaoEncontrado/NaoEncontrado'

/* Declara as rotas dentro do Layout. */
export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Indice />} />
        <Route path="licao/:id" element={<Licao />} />
        <Route path="*" element={<NaoEncontrado />} />
      </Route>
    </Routes>
  )
}
/* Fim do App. */
