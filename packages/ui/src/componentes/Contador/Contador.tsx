/*
 * Contador: campo numérico com botões − e + (padrão de reserva de ingresso),
 * limitado por mínimo e máximo. O valor é anunciado a leitores de tela.
 */
import { useId } from 'react'
import styles from './Contador.module.css'

type Props = {
  rotulo: string
  valor: number
  aoMudar: (valor: number) => void
  min?: number
  max?: number
  passo?: number
  unidade?: string
}

/* Renderiza rótulo, botões e valor, respeitando os limites. */
export function Contador({ rotulo, valor, aoMudar, min = 0, max = 99, passo = 1, unidade }: Props) {
  const id = useId()

  /* Soma o passo informado sem ultrapassar os limites. */
  function mudar(delta: number) {
    aoMudar(Math.min(max, Math.max(min, valor + delta)))
  }

  return (
    <div className={styles.contador} role="group" aria-labelledby={id}>
      <span id={id} className={styles.rotulo}>
        {rotulo}
      </span>
      <div className={styles.controles}>
        <button
          type="button"
          className={styles.botao}
          onClick={() => mudar(-passo)}
          disabled={valor <= min}
          aria-label={`Diminuir ${rotulo.toLowerCase()}`}
        >
          −
        </button>
        <output className={styles.valor} aria-live="polite">
          {valor}
          {unidade ? <span className={styles.unidade}> {unidade}</span> : null}
        </output>
        <button
          type="button"
          className={styles.botao}
          onClick={() => mudar(passo)}
          disabled={valor >= max}
          aria-label={`Aumentar ${rotulo.toLowerCase()}`}
        >
          +
        </button>
      </div>
    </div>
  )
}
/* Fim do Contador. */
