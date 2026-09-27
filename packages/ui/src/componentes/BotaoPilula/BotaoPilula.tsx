/*
 * BotaoPilula: botão ou link em formato de pílula, nas variantes preenchido
 * (cor de acento), vazado (contorno) e claro (fundo branco). Com href vira <a>.
 * Com comoFilho (padrão asChild), empresta o visual ao elemento filho, por
 * exemplo um <Link> do React Router, sem criar um elemento a mais.
 */
import {
  cloneElement,
  isValidElement,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type ReactElement,
  type ReactNode,
} from 'react'
import styles from './BotaoPilula.module.css'

type Base = {
  variante?: 'preenchido' | 'vazado' | 'claro'
  tamanho?: 'm' | 'g'
  icone?: ReactNode
  comoFilho?: boolean
  children: ReactNode
}

type PropsDoFilho = { className?: string; children?: ReactNode }

type ComoLink = Base & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }
type ComoBotao = Base & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined }

export type BotaoPilulaProps = ComoLink | ComoBotao

/* Monta as classes e decide entre <a> e <button>. */
export function BotaoPilula(props: BotaoPilulaProps) {
  const {
    variante = 'preenchido',
    tamanho = 'm',
    icone,
    comoFilho = false,
    children,
    className,
    ...resto
  } = props
  const classes = [styles.pilula, styles[variante], styles[tamanho], className]
    .filter(Boolean)
    .join(' ')

  /* Envolve o texto com o ícone opcional. */
  const montar = (texto: ReactNode) => (
    <>
      {icone ? (
        <span className={styles.icone} aria-hidden="true">
          {icone}
        </span>
      ) : null}
      <span>{texto}</span>
    </>
  )

  if (comoFilho && isValidElement(children)) {
    const filho = children as ReactElement<PropsDoFilho>
    return cloneElement(
      filho,
      { className: [classes, filho.props.className].filter(Boolean).join(' ') },
      montar(filho.props.children),
    )
  }

  const conteudo = montar(children)

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
