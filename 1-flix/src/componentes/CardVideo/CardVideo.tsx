/*
 * CardVideo: capa, título e canal de um vídeo, com a borda na cor da
 * categoria. O card inteiro leva à página Assistir.
 */
import { Link } from 'react-router'
import type { Categoria, Video } from '../../dominio/tipos'
import { capaDoVideo } from '../../dominio/youtube'
import { RotuloCategoria } from '../RotuloCategoria/RotuloCategoria'
import { ocultarSeFalhar } from '../imagem'
import styles from './CardVideo.module.css'

type Props = {
  video: Video
  categoria?: Categoria
  mostrarCategoria?: boolean
  nivel?: 'h2' | 'h3' | 'h4'
}

/* Renderiza o card com link para o vídeo. */
export function CardVideo({
  video,
  categoria,
  mostrarCategoria = false,
  nivel: Titulo = 'h3',
}: Props) {
  return (
    <article
      className={styles.card}
      style={{ ['--cor-categoria' as string]: categoria?.cor ?? 'var(--borda)' }}
    >
      <div className={styles.capa}>
        <img
          onError={ocultarSeFalhar}
          src={capaDoVideo(video.youtubeId)}
          alt=""
          loading="lazy"
          width="480"
          height="360"
        />
        <span className={styles.play} aria-hidden="true">
          <svg viewBox="0 0 24 24" width="22" height="22">
            <path d="M8 5v14l11-7z" fill="currentColor" />
          </svg>
        </span>
      </div>
      <div className={styles.corpo}>
        {mostrarCategoria && categoria ? <RotuloCategoria categoria={categoria} /> : null}
        <Titulo className={styles.titulo}>
          <Link to={`/assistir/${video.id}`} className={styles.link}>
            {video.titulo}
          </Link>
        </Titulo>
        {video.canal ? <p className={styles.canal}>{video.canal}</p> : null}
      </div>
    </article>
  )
}
/* Fim do CardVideo. */
