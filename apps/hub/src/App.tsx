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
const soTopo = ['topo']
const acentoPadrao = '#c4f042'

/* Espaço reservado enquanto as seções carregam, sem texto para leitor de tela. */
function CarregandoSecoes() {
  return <div aria-busy="true" style={{ minHeight: '100vh' }} />
}

/* Liga depois da primeira pintura: o requestAnimationFrame roda antes dela e
   o setTimeout, logo depois. Assim o módulo das seções (e as fontes e demos
   que ele puxa) só é pedido com o título já na tela (#36). Começar em false
   também faz o primeiro render bater com o HTML pré-renderizado, que traz
   só o espaço reservado das seções. */
function useDepoisDaPrimeiraPintura() {
  const [pronto, setPronto] = useState(false)
  useEffect(() => {
    let espera: ReturnType<typeof setTimeout> | undefined
    const quadro = requestAnimationFrame(() => {
      espera = setTimeout(() => setPronto(true), 0)
    })
    return () => {
      cancelAnimationFrame(quadro)
      clearTimeout(espera)
    }
  }, [])
  return pronto
}

/* Renderiza a página e atualiza --acento-ativo conforme a rolagem. */
export function App() {
  const carregarSecoes = useDepoisDaPrimeiraPintura()
  const [secoesProntas, setSecoesProntas] = useState(false)
  const ativa = useSecaoAtiva(secoesProntas ? todosIds : soTopo)

  /* Quando as seções entram no documento, leva até a âncora do endereço,
     se a pessoa ainda não rolou a página enquanto elas carregavam. */
  const aoMontarSecoes = useCallback(() => {
    setSecoesProntas(true)
    const alvo = window.location.hash.slice(1)
    if (alvo && window.scrollY === 0)
      document.getElementById(decodeURIComponent(alvo))?.scrollIntoView()
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
          {carregarSecoes ? <SecoesProjetos aoMontar={aoMontarSecoes} /> : <CarregandoSecoes />}
        </Suspense>
      </main>
      <Rodape />
    </>
  )
}
/* Fim do App. */
