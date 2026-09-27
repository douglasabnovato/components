/*
 * SeloStatus: etiqueta do status de uma tecnologia (atual, em transição ou
 * histórico), com símbolo e texto para não depender só da cor.
 */
import type { StatusTecnologia } from '../../dominio/tipos'
import styles from './SeloStatus.module.css'

const rotulosStatus: Record<StatusTecnologia, { simbolo: string; texto: string }> = {
  atual: { simbolo: '●', texto: 'Atual' },
  transicao: { simbolo: '◐', texto: 'Em transição' },
  historico: { simbolo: '○', texto: 'Histórico' },
}

/* Renderiza o selo com a nota opcional (ex.: "nicho"). */
export function SeloStatus({ status, nota }: { status: StatusTecnologia; nota?: string }) {
  const { simbolo, texto } = rotulosStatus[status]
  return (
    <span className={styles.selo} data-status={status}>
      <span aria-hidden="true">{simbolo}</span>
      {texto}
      {nota ? <span className={styles.nota}>· {nota}</span> : null}
    </span>
  )
}
/* Fim do SeloStatus. */
