/*
 * LinkPilula: link interno (React Router) com o visual de pílula do
 * ecossistema, para navegar sem recarregar a página.
 */
import type { ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router'
import styles from './LinkPilula.module.css'

type Props = LinkProps & {
  variante?: 'preenchido' | 'vazado' | 'claro'
  icone?: ReactNode
}

/* Renderiza o Link com as classes da variante escolhida. */
export function LinkPilula({
  variante = 'preenchido',
  icone,
  children,
  className,
  ...resto
}: Props) {
  return (
    <Link
      className={[styles.pilula, styles[variante], className].filter(Boolean).join(' ')}
      {...resto}
    >
      {icone ? (
        <span className={styles.icone} aria-hidden="true">
          {icone}
        </span>
      ) : null}
      <span>{children}</span>
    </Link>
  )
}
/* Fim do LinkPilula. */
