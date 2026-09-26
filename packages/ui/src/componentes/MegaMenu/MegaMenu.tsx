/*
 * MegaMenu: botão de divulgação (disclosure) que abre um painel com itens
 * de ícone, título e descrição. Fecha com Esc, clique fora ou ao escolher.
 * MegaMenuGrade pode ser usada sozinha como índice visual.
 */
import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import styles from './MegaMenu.module.css'

export type ItemMegaMenu = {
  href: string
  titulo: string
  descricao: string
  icone: ReactNode
  destaque?: string
}

type GradeProps = {
  itens: ItemMegaMenu[]
  aoEscolher?: () => void
  className?: string
}

/* Lista de links com ícone, título e descrição. */
export function MegaMenuGrade({ itens, aoEscolher, className }: GradeProps) {
  return (
    <ul className={[styles.grade, className].filter(Boolean).join(' ')}>
      {itens.map((item) => (
        <li key={item.href}>
          <a className={styles.item} href={item.href} onClick={aoEscolher}>
            <span className={styles.icone} aria-hidden="true">
              {item.icone}
            </span>
            <span className={styles.textos}>
              <span className={styles.titulo}>
                {item.titulo}
                {item.destaque ? <span className={styles.destaque}>{item.destaque}</span> : null}
              </span>
              <span className={styles.descricao}>{item.descricao}</span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  )
}

type Props = {
  rotulo: string
  itens: ItemMegaMenu[]
  className?: string
}

/* Controla abertura, fechamento e foco do painel. */
export function MegaMenu({ rotulo, itens, className }: Props) {
  const [aberto, setAberto] = useState(false)
  const id = useId()
  const raiz = useRef<HTMLDivElement>(null)
  const botao = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!aberto) return

    /* Fecha com Esc e devolve o foco ao botão. */
    function aoTeclar(evento: KeyboardEvent) {
      if (evento.key === 'Escape') {
        setAberto(false)
        botao.current?.focus()
      }
    }

    /* Fecha quando o clique acontece fora do componente. */
    function aoClicarFora(evento: MouseEvent) {
      if (!raiz.current?.contains(evento.target as Node)) setAberto(false)
    }

    document.addEventListener('keydown', aoTeclar)
    document.addEventListener('mousedown', aoClicarFora)
    return () => {
      document.removeEventListener('keydown', aoTeclar)
      document.removeEventListener('mousedown', aoClicarFora)
    }
  }, [aberto])

  return (
    <div className={[styles.megamenu, className].filter(Boolean).join(' ')} ref={raiz}>
      <button
        ref={botao}
        type="button"
        className={styles.gatilho}
        aria-expanded={aberto}
        aria-controls={id}
        onClick={() => setAberto((v) => !v)}
      >
        {rotulo}
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          aria-hidden="true"
          className={styles.chevron}
        >
          <path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      </button>
      <div id={id} className={styles.painel} hidden={!aberto}>
        <MegaMenuGrade itens={itens} aoEscolher={() => setAberto(false)} />
      </div>
    </div>
  )
}
/* Fim do MegaMenu. */
