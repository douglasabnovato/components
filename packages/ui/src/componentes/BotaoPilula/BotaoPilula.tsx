/*
 * BotaoPilula: botão ou link em formato de pílula, nas variantes preenchido
 * (cor de acento), vazado (contorno) e claro (fundo branco). Com href vira <a>.
 */
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import styles from './BotaoPilula.module.css'

type Base = {
  variante?: 'preenchido' | 'vazado' | 'claro'
  tamanho?: 'm' | 'g'
  icone?: ReactNode
  children: ReactNode
}

type ComoLink = Base & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }
type ComoBotao = Base & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined }

export type BotaoPilulaProps = ComoLink | ComoBotao

/* Monta as classes e decide entre <a> e <button>. */
export function BotaoPilula(props: BotaoPilulaProps) {
  const { variante = 'preenchido', tamanho = 'm', icone, children, className, ...resto } = props
  const classes = [styles.pilula, styles[variante], styles[tamanho], className]
    .filter(Boolean)
    .join(' ')
  const conteudo = (
    <>
      {icone ? (
        <span className={styles.icone} aria-hidden="true">
          {icone}
        </span>
      ) : null}
      <span>{children}</span>
    </>
  )

  if (typeof resto.href === 'string') {
    return (
      <a className={classes} {...(resto as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {conteudo}
      </a>
    )
  }

  const { type = 'button', ...botao } = resto as ButtonHTMLAttributes<HTMLButtonElement>
  return (
    <button className={classes} type={type} {...botao}>
      {conteudo}
    </button>
  )
}
/* Fim do BotaoPilula. */
