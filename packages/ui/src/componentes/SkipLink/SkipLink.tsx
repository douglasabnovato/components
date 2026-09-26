/*
 * SkipLink: primeiro elemento focável da página. Fica escondido até receber
 * foco pelo teclado e leva direto ao conteúdo principal.
 */
import styles from './SkipLink.module.css'

type Props = {
  alvo?: string
  children?: string
}

/* Renderiza o link de salto para o conteúdo. */
export function SkipLink({ alvo = '#conteudo', children = 'Pular para o conteúdo' }: Props) {
  return (
    <a className={styles.link} href={alvo}>
      {children}
    </a>
  )
}
/* Fim do SkipLink. */
