/*
 * BotaoVoltar: link fixo que todo filho usa para retornar ao hub,
 * de preferência à seção de origem (ex.: /#filho-6).
 */
import styles from './BotaoVoltar.module.css'

type Props = {
  href?: string
  rotulo?: string
  fixo?: boolean
}

/* Renderiza o link de retorno com seta. */
export function BotaoVoltar({ href = '/', rotulo = 'Voltar ao hub', fixo = true }: Props) {
  return (
    <a className={[styles.voltar, fixo ? styles.fixo : ''].join(' ')} href={href}>
      <span aria-hidden="true">←</span>
      <span>{rotulo}</span>
    </a>
  )
}
/* Fim do BotaoVoltar. */
