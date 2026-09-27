/*
 * Seções usadas dentro do MDX das lições. Cada uma só renderiza os filhos
 * quando a aba ativa é a dela; assim um único arquivo MDX guarda os três tempos.
 */
import { useContext, type ReactNode } from 'react'
import { AbaContexto, type Aba } from './contexto'
import estilos from './Secoes.module.css'

/* Mostra os filhos só na aba informada. */
function Secao({ aba, children }: { aba: Aba; children: ReactNode }) {
  const ativa = useContext(AbaContexto)
  if (ativa !== aba) return null
  return <div className={estilos.texto}>{children}</div>
}

/* Primeiro tempo: o problema. */
export function Desafio({ children }: { children: ReactNode }) {
  return <Secao aba="desafio">{children}</Secao>
}

/* Segundo tempo: o conceito. */
export function Conteudo({ children }: { children: ReactNode }) {
  return <Secao aba="conteudo">{children}</Secao>
}

/* Terceiro tempo: o processo de solução em etapas. */
export function Solucao({ children }: { children: ReactNode }) {
  return <Secao aba="solucao">{children}</Secao>
}
/* Fim das seções. */
