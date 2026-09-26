/*
 * Dialogo: janela modal acessível sobre o <dialog> nativo. O navegador cuida
 * do foco preso, do Esc e do fundo inerte; o componente só sincroniza o estado.
 */
import { useEffect, useId, useRef, type ReactNode } from 'react'
import styles from './Dialogo.module.css'

type Props = {
  aberto: boolean
  titulo: string
  aoFechar: () => void
  children: ReactNode
  acoes?: ReactNode
}

/* Abre e fecha o <dialog> conforme a prop aberto. */
export function Dialogo({ aberto, titulo, aoFechar, children, acoes }: Props) {
  const ref = useRef<HTMLDialogElement>(null)
  const idTitulo = useId()

  useEffect(() => {
    const dialogo = ref.current
    if (!dialogo) return
    if (aberto && !dialogo.open) {
      if (typeof dialogo.showModal === 'function') dialogo.showModal()
      else dialogo.setAttribute('open', '')
    }
    if (!aberto && dialogo.open) {
      if (typeof dialogo.close === 'function') dialogo.close()
      else dialogo.removeAttribute('open')
    }
  }, [aberto])

  return (
    <dialog
      ref={ref}
      className={styles.dialogo}
      aria-labelledby={idTitulo}
      onClose={aoFechar}
      onCancel={(e) => {
        e.preventDefault()
        aoFechar()
      }}
    >
      <h2 id={idTitulo} className={styles.titulo}>
        {titulo}
      </h2>
      <div className={styles.corpo}>{children}</div>
      {acoes ? <div className={styles.acoes}>{acoes}</div> : null}
    </dialog>
  )
}
/* Fim do Dialogo. */
