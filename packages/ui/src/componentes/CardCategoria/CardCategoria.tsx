/*
 * CardCategoria: card cuja ilustração ultrapassa a borda superior,
 * usado para apresentar categorias ou modos de funcionamento.
 */
import type { ReactNode } from 'react'
import styles from './CardCategoria.module.css'

type Props = {
  titulo: string
  descricao: ReactNode
  midia: ReactNode
  children?: ReactNode
}

/* Renderiza a mídia elevada e o conteúdo do card. */
export function CardCategoria({ titulo, descricao, midia, children }: Props) {
  return (
    <article className={styles.card}>
      <div className={styles.midia} aria-hidden="true">
        {midia}
      </div>
      <h3 className={styles.titulo}>{titulo}</h3>
      <p className={styles.descricao}>{descricao}</p>
      {children}
    </article>
  )
}
/* Fim do CardCategoria. */
