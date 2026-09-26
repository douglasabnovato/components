/*
 * IconeProjeto: selo com o número do projeto na cor de acento dele,
 * usado no megamenu, na linha do tempo e no mosaico do topo.
 */
import type { Projeto } from '../dados/projetos'
import { doisDigitos } from '../dados/projetos'

type Props = { projeto: Projeto; tamanho?: number }

/* Desenha o selo com o número em dois dígitos. */
export function IconeProjeto({ projeto, tamanho = 40 }: Props) {
  return (
    <svg viewBox="0 0 40 40" width={tamanho} height={tamanho} aria-hidden="true">
      <rect width="40" height="40" rx="10" fill={projeto.acento} />
      <text
        x="20"
        y="25.5"
        textAnchor="middle"
        fontFamily="var(--fonte-titulo)"
        fontSize="15"
        fontWeight="700"
        fill={projeto.sobreAcento}
      >
        {doisDigitos(projeto.numero)}
      </text>
    </svg>
  )
}
/* Fim do IconeProjeto. */
