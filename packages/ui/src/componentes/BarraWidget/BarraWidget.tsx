/*
 * BarraWidget: formulário em barra que sobrepõe a mídia do topo (padrão de
 * reserva). Campo agrupa rótulo e controle com o mesmo visual.
 */
import type { FormEvent, ReactNode } from 'react'
import styles from './BarraWidget.module.css'

type Props = {
  rotulo: string
  acao: string
  aoEnviar: () => void
  children: ReactNode
  className?: string
}

/* Impede o recarregamento e delega o envio. */
export function BarraWidget({ rotulo, acao, aoEnviar, children, className }: Props) {
  /* Trata o envio do formulário. */
  function enviar(evento: FormEvent) {
    evento.preventDefault()
    aoEnviar()
  }

  return (
    <form
      className={[styles.barra, className].filter(Boolean).join(' ')}
      aria-label={rotulo}
      onSubmit={enviar}
    >
      <div className={styles.campos}>{children}</div>
      <button type="submit" className={styles.enviar}>
        {acao}
      </button>
    </form>
  )
}

type CampoProps = {
  rotulo: string
  htmlFor: string
  children: ReactNode
  erro?: string
}

/* Rótulo acima do controle, com mensagem de erro opcional. */
export function Campo({ rotulo, htmlFor, children, erro }: CampoProps) {
  return (
    <div className={styles.campo}>
      <label className={styles.rotulo} htmlFor={htmlFor}>
        {rotulo}
      </label>
      {children}
      {erro ? (
        <p className={styles.erro} id={`${htmlFor}-erro`} role="alert">
          {erro}
        </p>
      ) : null}
    </div>
  )
}
/* Fim do BarraWidget. */
