/*
 * App: monta o hub na ordem das seções (topo, 8 projetos, arquitetura e
 * créditos), liga o acento global à seção visível e define o comportamento
 * de movimento reduzido para todas as animações do Motion.
 */
import { SkipLink, useSecaoAtiva } from '@components/ui'
import { MotionConfig } from 'motion/react'
import { useEffect } from 'react'
import { Cabecalho } from './componentes/Cabecalho/Cabecalho'
import { Topo } from './componentes/Topo/Topo'
import { projetos } from './dados/projetos'
import { SecaoArquitetura } from './secoes/Arquitetura/SecaoArquitetura'
import { SecaoCadastro } from './secoes/Cadastro/SecaoCadastro'
import { SecaoFlix } from './secoes/Flix/SecaoFlix'
import { SecaoHerois } from './secoes/Herois/SecaoHerois'
import { SecaoLaboratorio } from './secoes/Laboratorio/SecaoLaboratorio'
import { SecaoPelada } from './secoes/Pelada/SecaoPelada'
import { Rodape } from './secoes/Rodape/Rodape'
import { SecaoServidor } from './secoes/Servidor/SecaoServidor'
import { SecaoTarefas } from './secoes/Tarefas/SecaoTarefas'
import { SecaoTrilha } from './secoes/Trilha/SecaoTrilha'

const ids = ['topo', ...projetos.map((p) => p.id), 'arquitetura']
const acentoPadrao = '#c4f042'

/* Renderiza a página e atualiza --acento-ativo conforme a rolagem. */
export function App() {
  const ativa = useSecaoAtiva(ids)

  useEffect(() => {
    const cor = projetos.find((p) => p.id === ativa)?.acento ?? acentoPadrao
    document.documentElement.style.setProperty('--acento-ativo', cor)
  }, [ativa])

  return (
    <MotionConfig reducedMotion="user">
      <SkipLink />
      <Cabecalho ativo={ativa} />
      <main id="conteudo" tabIndex={-1}>
        <Topo />
        <SecaoFlix />
        <SecaoCadastro />
        <SecaoHerois />
        <SecaoServidor />
        <SecaoTarefas />
        <SecaoPelada />
        <SecaoLaboratorio />
        <SecaoTrilha />
        <SecaoArquitetura />
      </main>
      <Rodape />
    </MotionConfig>
  )
}
/* Fim do App. */
