/*
 * SecoesProjetos: as 8 seções de projeto e a de arquitetura num só módulo.
 * O App carrega este módulo sob demanda (React.lazy), para que o pacote
 * inicial leve só o topo e o cabeçalho e o LCP não espere as demos (#23).
 * O MotionConfig fica aqui: só as seções usam o Motion, e o movimento
 * reduzido do sistema vale para todas as animações delas.
 */
import { MotionConfig } from 'motion/react'
import { useEffect } from 'react'
import { SecaoArquitetura } from './Arquitetura/SecaoArquitetura'
import { SecaoCadastro } from './Cadastro/SecaoCadastro'
import { SecaoFlix } from './Flix/SecaoFlix'
import { SecaoHerois } from './Herois/SecaoHerois'
import { SecaoLaboratorio } from './Laboratorio/SecaoLaboratorio'
import { SecaoPelada } from './Pelada/SecaoPelada'
import { SecaoServidor } from './Servidor/SecaoServidor'
import { SecaoTarefas } from './Tarefas/SecaoTarefas'
import { SecaoTrilha } from './Trilha/SecaoTrilha'

type Props = { aoMontar?: () => void }

/* Renderiza as seções e avisa o App quando elas já estão no documento. */
export default function SecoesProjetos({ aoMontar }: Props) {
  useEffect(() => {
    aoMontar?.()
  }, [aoMontar])

  return (
    <MotionConfig reducedMotion="user">
      <SecaoFlix />
      <SecaoCadastro />
      <SecaoHerois />
      <SecaoServidor />
      <SecaoTarefas />
      <SecaoPelada />
      <SecaoLaboratorio />
      <SecaoTrilha />
      <SecaoArquitetura />
    </MotionConfig>
  )
}
/* Fim das seções de projeto. */
