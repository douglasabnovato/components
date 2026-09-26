/*
 * CardEvento: card de evento com data, local e categoria no corpo e uma
 * faixa de status no rodapé (ex.: confirmados de uma pelada).
 */
import type { ReactNode } from 'react'
import styles from './CardEvento.module.css'

type Props = {
  titulo: string
  data: string
  dataIso: string
  local: string
  categoria: string
  status: { atual: number; total: number; rotulo: string }
  children?: ReactNode
}

/* Renderiza os metadados do evento e a barra de progresso do status. */
export function CardEvento({ titulo, data, dataIso, local, categoria, status, children }: Props) {
  const lotado = status.atual >= status.total
  return (
    <article className={styles.card}>
      <div className={styles.corpo}>
        <p className={styles.categoria}>{categoria}</p>
        <h3 className={styles.titulo}>{titulo}</h3>
        <dl className={styles.meta}>
          <div>
            <dt>Data</dt>
            <dd>
              <time dateTime={dataIso}>{data}</time>
            </dd>
          </div>
          <div>
            <dt>Local</dt>
            <dd>{local}</dd>
          </div>
        </dl>
        {children}
      </div>
      <footer className={styles.rodape} data-lotado={lotado}>
        <span>
          {status.atual}/{status.total} {status.rotulo}
        </span>
        <progress
          className={styles.barra}
          value={status.atual}
          max={status.total}
          aria-label={`${status.atual} de ${status.total} ${status.rotulo}`}
        />
        <span className={styles.situacao}>{lotado ? 'Lista fechada' : 'Vagas abertas'}</span>
      </footer>
    </article>
  )
}
/* Fim do CardEvento. */
