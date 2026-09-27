/*
 * EstadoVazio: bloco de estado vazio ou de erro com título, texto e ações.
 */
import type { ReactNode } from 'react'
import styles from './Estados.module.css'

type Props = {
  titulo: string
  nivel?: 'h1' | 'h2'
  children?: ReactNode
  acoes?: ReactNode
}

/* Renderiza o bloco centralizado. */
export function EstadoVazio({ titulo, nivel: Titulo = 'h2', children, acoes }: Props) {
  return (
    <section className={styles.vazio}>
      <Titulo className={styles.titulo}>{titulo}</Titulo>
      {children ? <div className={styles.texto}>{children}</div> : null}
      {acoes ? <div className={styles.acoes}>{acoes}</div> : null}
    </section>
  )
}
/* Fim do EstadoVazio. */
