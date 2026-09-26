/*
 * BotaoPausa: controle para pausar e retomar animações automáticas
 * (critério WCAG 2.2.2). O rótulo acessível muda com o estado.
 */
import styles from './BotaoPausa.module.css'

type Props = {
  pausado: boolean
  aoAlternar: () => void
  className?: string
}

/* Renderiza o ícone de pausa ou de reprodução conforme o estado. */
export function BotaoPausa({ pausado, aoAlternar, className }: Props) {
  return (
    <button
      type="button"
      className={[styles.botao, className].filter(Boolean).join(' ')}
      onClick={aoAlternar}
      aria-label={pausado ? 'Retomar animação' : 'Pausar animação'}
    >
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        {pausado ? (
          <path d="M8 5v14l11-7z" fill="currentColor" />
        ) : (
          <path d="M7 5h4v14H7zM13 5h4v14h-4z" fill="currentColor" />
        )}
      </svg>
    </button>
  )
}
/* Fim do BotaoPausa. */
