/*
 * CardEtiqueta: card com mídia no topo e etiqueta sobreposta à imagem.
 * A variante destaque ocupa mais espaço na grade (card grande + menores).
 */
import type { ReactNode } from 'react'
import styles from './CardEtiqueta.module.css'

type Props = {
  titulo: string
  etiqueta?: string
  descricao?: ReactNode
  midia: ReactNode
  destaque?: boolean
  nivel?: 'h3' | 'h4'
  children?: ReactNode
}

/* Renderiza mídia, etiqueta, título, descrição e rodapé opcional. */
export function CardEtiqueta({
  titulo,
  etiqueta,
  descricao,
  midia,
  destaque = false,
  nivel: Titulo = 'h3',
  children,
}: Props) {
  return (
    <article className={[styles.card, destaque ? styles.destaque : ''].join(' ')}>
      <div className={styles.midia}>
        {midia}
        {etiqueta ? <span className={styles.etiqueta}>{etiqueta}</span> : null}
      </div>
      <div className={styles.corpo}>
        <Titulo className={styles.titulo}>{titulo}</Titulo>
        {descricao ? <p className={styles.descricao}>{descricao}</p> : null}
        {children}
      </div>
    </article>
  )
}
/* Fim do CardEtiqueta. */
