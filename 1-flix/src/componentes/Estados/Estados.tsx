/*
 * Estados de tela do Flix: carregando, erro e vazio (com ações de saída).
 */
import type { ReactNode } from 'react'
import styles from './Estados.module.css'

/* Indicador de carregamento anunciado ao leitor de tela. */
export function Carregando() {
  return (
    <p className={styles.estado} role="status">
      Carregando o catálogo…
    </p>
  )
}

/* Bloco de estado vazio ou de erro com título, texto e ações. */
export function EstadoVazio({
  titulo,
  children,
  acoes,
}: {
  titulo: string
  children?: ReactNode
  acoes?: ReactNode
}) {
  return (
    <section className={styles.vazio}>
      <h1 className={styles.titulo}>{titulo}</h1>
      {children ? <div className={styles.texto}>{children}</div> : null}
      {acoes ? <div className={styles.acoes}>{acoes}</div> : null}
    </section>
  )
}
/* Fim dos estados de tela. */
