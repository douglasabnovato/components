/*
 * App: monta o hub na ordem das seções (topo, 8 projetos, arquitetura e
 * créditos) e liga o acento global à seção visível. As seções de projeto,
 * com o Motion e as demos, vêm de um módulo carregado sob demanda, fora do
 * pacote inicial (#23).
 */
import { SkipLink, useSecaoAtiva } from '@components/ui'
import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { Cabecalho } from './componentes/Cabecalho/Cabecalho'
import { Topo } from './componentes/Topo/Topo'
import { projetos } from './dados/projetos'
import { Rodape } from './secoes/Rodape/Rodape'

const SecoesProjetos = lazy(() => import('./secoes/SecoesProjetos'))

const todosIds = ['topo', ...projetos.map((p) => p.id), 'arquitetura']
const acentoPadrao = '#c4f042'

/* Espaço reservado enquanto as seções carregam, sem texto para leitor de tela. */
function CarregandoSecoes() {
  return <div aria-busy="true" style={{ minHeight: '100vh' }} />
}

/* Renderiza a página e atualiza --acento-ativo conforme a rolagem. */
export function App() {
  const [secoesProntas, setSecoesProntas] = useState(false)
  const ativa = useSecaoAtiva(secoesProntas ? todosIds : ['topo'])

  /* Quando as seções entram no documento, leva até a âncora do endereço. */
  const aoMontarSecoes = useCallback(() => {
    setSecoesProntas(true)
    const alvo = window.location.hash.slice(1)
    if (alvo) document.getElementById(decodeURIComponent(alvo))?.scrollIntoView()
  }, [])

  useEffect(() => {
    const cor = projetos.find((p) => p.id === ativa)?.acento ?? acentoPadrao
    document.documentElement.style.setProperty('--acento-ativo', cor)
  }, [ativa])

  return (
    <>
      <SkipLink />
      <Cabecalho ativo={ativa} />
      <main id="conteudo" tabIndex={-1}>
        <Topo />
        <Suspense fallback={<CarregandoSecoes />}>
          <SecoesProjetos aoMontar={aoMontarSecoes} />
        </Suspense>
      </main>
      <Rodape />
    </>
  )
}
/* Fim do App. */
