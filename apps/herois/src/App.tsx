/*
 * App do Portal de Heróis: mapa de rotas. O roteador fica fora (main.tsx),
 * o que permite testar com MemoryRouter.
 */
import { Route, Routes } from 'react-router'
import { Layout } from './componentes/Layout'
import { Comparar } from './paginas/Comparar'
import { Equipes } from './paginas/Equipes'
import { Ficha } from './paginas/Ficha'
import { Inicio } from './paginas/Inicio'
import { NaoEncontrado } from './paginas/NaoEncontrado'

/* Declara as rotas dentro do Layout. */
export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Inicio />} />
        <Route path="heroi/:slug" element={<Ficha />} />
        <Route path="equipes" element={<Equipes />} />
        <Route path="comparar" element={<Comparar />} />
        <Route path="*" element={<NaoEncontrado />} />
      </Route>
    </Routes>
  )
}
/* Fim do App. */
