/*
 * BarraProgresso: barra nativa <progress> com rótulo acessível e o
 * percentual visível ao lado.
 */
import styles from './BarraProgresso.module.css'

type Props = {
  valor: number
  maximo: number
  rotulo: string
  compacta?: boolean
}

/* Renderiza a barra e o percentual arredondado. */
export function BarraProgresso({ valor, maximo, rotulo, compacta = false }: Props) {
  const percentual = maximo ? Math.round((valor / maximo) * 100) : 0
  return (
    <div className={[styles.barra, compacta ? styles.compacta : ''].join(' ')}>
      <progress value={valor} max={maximo} aria-label={rotulo} />
      <span className={styles.percentual} aria-hidden="true">
        {percentual}%
      </span>
    </div>
  )
}
/* Fim da BarraProgresso. */
