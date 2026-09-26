/*
 * Player leve: mostra a capa com um botão de play e só carrega o YouTube
 * (versão sem cookies) quando a pessoa clica. Economiza peso e rastreio.
 */
import { useState } from 'react'
import type { Video } from '../../dominio/tipos'
import { capaDoVideo, playerDoVideo } from '../../dominio/youtube'
import { ocultarSeFalhar } from '../imagem'
import styles from './Player.module.css'

/* Troca a capa pelo iframe depois do clique. */
export function Player({ video }: { video: Video }) {
  const [ativo, setAtivo] = useState(false)

  if (ativo) {
    return (
      <div className={styles.moldura}>
        <iframe
          className={styles.iframe}
          src={playerDoVideo(video.youtubeId)}
          title={`Vídeo: ${video.titulo}`}
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
      aria-label={`Reproduzir ${video.titulo}`}
    >
      <img
        onError={ocultarSeFalhar}
        src={capaDoVideo(video.youtubeId)}
        alt=""
        width="480"
        height="360"
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
