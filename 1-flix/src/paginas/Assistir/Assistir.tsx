/*
 * Assistir: player leve, dados do vídeo, ações (abrir no YouTube, editar)
 * e mais vídeos da mesma categoria.
 */
import { useParams } from 'react-router'
import { CardVideo } from '../../componentes/CardVideo/CardVideo'
import { Carregando } from '../../componentes/Estados/Estados'
import { LinkPilula } from '../../componentes/LinkPilula/LinkPilula'
import { Player } from '../../componentes/Player/Player'
import { RotuloCategoria } from '../../componentes/RotuloCategoria/RotuloCategoria'
import { useCatalogo } from '../../dados/consultas'
import { destaqueDaCategoria, videosDaCategoria } from '../../dominio/catalogo'
import { linkDoVideo } from '../../dominio/youtube'
import { NaoEncontrado } from '../NaoEncontrado/NaoEncontrado'
import styles from './Assistir.module.css'

/* Encontra o vídeo pelo id da URL e monta a página. */
export function Assistir() {
  const { id } = useParams()
  const { data: catalogo, isPending } = useCatalogo()

  if (isPending || !catalogo) return <Carregando />
  const video = catalogo.videos.find((v) => v.id === id)
  if (!video) return <NaoEncontrado titulo="Vídeo não encontrado" />

  const categoria = catalogo.categorias.find((c) => c.id === video.categoriaId)
  const outros = videosDaCategoria(catalogo, video.categoriaId).filter((v) => v.id !== video.id)
  const ehDestaque = categoria
    ? destaqueDaCategoria(catalogo, categoria.id)?.id === video.id
    : false

  return (
    <article className={styles.pagina} key={video.id}>
      <Player video={video} />
      <div className={styles.info}>
        <div className={styles.rotulos}>
          {categoria ? <RotuloCategoria categoria={categoria} tamanho="g" /> : null}
          {ehDestaque ? <span className={styles.selo}>Destaque da categoria</span> : null}
        </div>
        <h1 className={styles.titulo}>{video.titulo}</h1>
        {video.canal ? <p className={styles.canal}>Canal: {video.canal}</p> : null}
        {video.descricao ? <p className={styles.descricao}>{video.descricao}</p> : null}
        <div className={styles.acoes}>
          <a
            className={styles.externo}
            href={linkDoVideo(video.youtubeId)}
            target="_blank"
            rel="noreferrer"
          >
            Abrir no YouTube <span aria-hidden="true">↗</span>{' '}
            <span className="visualmente-oculto">(abre em nova aba)</span>
          </a>
          <LinkPilula to={`/painel/videos/${video.id}/editar`} variante="vazado">
            Editar vídeo
          </LinkPilula>
        </div>
      </div>
      {outros.length > 0 && categoria ? (
        <section aria-labelledby="titulo-mais" className={styles.mais}>
          <h2 id="titulo-mais" className={styles.subtitulo}>
            Mais de {categoria.nome}
          </h2>
          <ul className={styles.grade}>
            {outros.map((v) => (
              <li key={v.id}>
                <CardVideo video={v} categoria={categoria} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  )
}
/* Fim da página Assistir. */
