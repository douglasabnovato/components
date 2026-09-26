/*
 * LinkSeta: link de texto com seta que avança no hover ("Assistir →").
 */
import type { AnchorHTMLAttributes, ReactNode } from 'react'
import styles from './LinkSeta.module.css'

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { children: ReactNode }

/* Renderiza o link com a seta decorativa. */
export function LinkSeta({ children, className, ...resto }: Props) {
  return (
    <a className={[styles.link, className].filter(Boolean).join(' ')} {...resto}>
      <span>{children}</span>
      <span className={styles.seta} aria-hidden="true">
        →
      </span>
    </a>
  )
}
/* Fim do LinkSeta. */
