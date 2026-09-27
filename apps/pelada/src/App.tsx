/*
 * App da Pelada: estado persistido (useReducer + localStorage), relógio e
 * gerador de ids injetáveis (para testes previsíveis), avisos e rotas.
 */
import { ProvedorAvisos } from '@components/ui'
import { useMemo } from 'react'
import { Route, Routes } from 'react-router'
import { Layout } from './componentes/Layout/Layout'
import { PeladaContexto, usePeladaPersistente } from './dados/estado'
import { Inicio } from './paginas/Inicio/Inicio'
import { Jogo } from './paginas/Jogo/Jogo'
import { NaoEncontrado } from './paginas/NaoEncontrado/NaoEncontrado'
import { NovoJogo } from './paginas/NovoJogo/NovoJogo'

type Props = {
  agora?: () => Date
  novoId?: () => string
}

/* Gera ids curtos e únicos no navegador. */
function idAleatorio() {
  return crypto.randomUUID().slice(0, 8)
}

/* Monta o provedor do estado e declara as rotas. */
export function App({ agora = () => new Date(), novoId = idAleatorio }: Props) {
  const [estado, despachar] = usePeladaPersistente()
  const valor = useMemo(
    () => ({ estado, despachar, agora, novoId }),
    [estado, despachar, agora, novoId],
  )

  return (
    <PeladaContexto.Provider value={valor}>
      <ProvedorAvisos>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Inicio />} />
            <Route path="novo" element={<NovoJogo />} />
            <Route path="jogo/:id" element={<Jogo />} />
            <Route path="*" element={<NaoEncontrado />} />
          </Route>
        </Routes>
      </ProvedorAvisos>
    </PeladaContexto.Provider>
  )
}
/* Fim do App. */
