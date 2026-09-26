/*
 * SeletorPilula: alternância controlada entre duas ou mais vistas, com um
 * indicador que desliza até a opção escolhida. Usa botões com aria-pressed.
 */
import type { CSSProperties } from 'react'
import styles from './SeletorPilula.module.css'

export type OpcaoSeletor<T extends string> = {
  valor: T
  rotulo: string
}

type Props<T extends string> = {
  opcoes: OpcaoSeletor<T>[]
  valor: T
  aoMudar: (valor: T) => void
  rotulo: string
  controla?: string
}

/* Renderiza as opções e posiciona o indicador pela opção ativa. */
export function SeletorPilula<T extends string>({
  opcoes,
  valor,
  aoMudar,
  rotulo,
  controla,
}: Props<T>) {
  const indice = Math.max(
    0,
    opcoes.findIndex((o) => o.valor === valor),
  )
  const estilo = {
    '--total': opcoes.length,
    '--indice': indice,
  } as CSSProperties

  return (
    <div className={styles.seletor} role="group" aria-label={rotulo} style={estilo}>
      <span className={styles.indicador} aria-hidden="true" />
      {opcoes.map((opcao) => (
        <button
          key={opcao.valor}
          type="button"
          className={styles.opcao}
          aria-pressed={opcao.valor === valor}
          aria-controls={controla}
          onClick={() => aoMudar(opcao.valor)}
        >
          {opcao.rotulo}
        </button>
      ))}
    </div>
  )
}
/* Fim do SeletorPilula. */
