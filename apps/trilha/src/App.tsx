/*
 * App da Trilha: provedor do progresso e mapa de rotas. O roteador fica fora
 * (main.tsx), o que permite testar com MemoryRouter e um armazém próprio.
 */
import { useState } from 'react'
import { Route, Routes } from 'react-router'
import { Layout } from './componentes/Layout/Layout'
import { criarArmazemProgresso, ProgressoContexto, type ArmazemProgresso } from './dados/progresso'
import { Aprendizado } from './paginas/Aprendizado/Aprendizado'
import { Inicio } from './paginas/Inicio/Inicio'
import { NaoEncontrado } from './paginas/NaoEncontrado/NaoEncontrado'
import { Stack } from './paginas/Stack/Stack'

type Props = { armazem?: ArmazemProgresso }

/* Cria o armazém uma vez e declara as rotas. */
export function App({ armazem }: Props) {
  const [valor] = useState(() => armazem ?? criarArmazemProgresso())

  return (
    <ProgressoContexto.Provider value={valor}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Inicio />} />
          <Route path="aprendizado/:numero" element={<Aprendizado />} />
          <Route path="stack" element={<Stack />} />
          <Route path="*" element={<NaoEncontrado />} />
        </Route>
      </Routes>
    </ProgressoContexto.Provider>
  )
}
/* Fim do App. */
