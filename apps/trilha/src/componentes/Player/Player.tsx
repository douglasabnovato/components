/*
 * Player leve: mostra a capa com um botão de play e só carrega o YouTube
 * (versão sem cookies) quando a pessoa clica. Recriado a cada aprendizado.
 */
import { useState } from 'react'
import { capaDoVideo, playerDoVideo } from '../../dominio/youtube'
import styles from './Player.module.css'

type Props = { youtubeId: string; titulo: string }

/* Troca a capa pelo iframe depois do clique. */
export function Player({ youtubeId, titulo }: Props) {
  const [ativo, setAtivo] = useState(false)

  if (ativo) {
    return (
      <div className={styles.moldura}>
        <iframe
          className={styles.iframe}
          src={playerDoVideo(youtubeId)}
          title={`Vídeo: ${titulo}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }

  return (
    <button
      type="button"
      className={[styles.moldura, styles.capa].join(' ')}
      onClick={() => setAtivo(true)}
      aria-label={`Reproduzir ${titulo}`}
    >
      <img
        src={capaDoVideo(youtubeId)}
        alt=""
        width="480"
        height="360"
        onError={(e) => {
          e.currentTarget.style.visibility = 'hidden'
        }}
      />
      <span className={styles.play} aria-hidden="true">
        <svg viewBox="0 0 24 24" width="36" height="36">
          <path d="M8 5v14l11-7z" fill="currentColor" />
        </svg>
      </span>
    </button>
  )
}
/* Fim do Player. */
