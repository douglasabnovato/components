/*
 * Seção 01 · Flix. Referência: carrossel com os slides vizinhos à mostra,
 * paginação em pílulas e abas por categoria. Os dados vêm do próprio Flix
 * (catálogo inicial e regras de destaque), então o hub mostra o produto real:
 * um destaque por categoria, a do banner primeiro, e links para assistir.
 */
import {
  capaDoVideo,
  catalogoInicial,
  categoriasComVideos,
  destaqueDaCategoria,
  videosDaCategoria,
  type Categoria,
  type Video,
} from '@components/flix/dados'
import { AbasSegmentadas, BotaoPilula, Carrossel, corDoTextoSobre } from '@components/ui'
import type { CSSProperties, SyntheticEvent } from 'react'
import { projeto } from '../../dados/projetos'
import { CabecalhoSecao, RodapeSecao, Secao } from '../../componentes/Secao/Secao'
import styles from './SecaoFlix.module.css'

const catalogo = catalogoInicial()

/* Esconde a capa se ela não carregar (sem internet), mantendo o fundo. */
const ocultarSeFalhar = (e: SyntheticEvent<HTMLImageElement>) => {
  e.currentTarget.style.visibility = 'hidden'
}
const categorias = categoriasComVideos(catalogo)

/* Etiqueta com a cor da categoria e texto escolhido por contraste. */
function Rotulo({ categoria }: { categoria: Categoria }) {
  return (
    <span
      className={styles.rotulo}
      style={{ background: categoria.cor, color: corDoTextoSobre(categoria.cor) }}
    >
      {categoria.nome}
    </span>
  )
}

/* Slide do carrossel: capa real do vídeo destaque da categoria. */
function Destaque({
  categoria,
  video,
  banner,
  base,
}: {
  categoria: Categoria
  video: Video
  banner: boolean
  base: string
}) {
  const estilo = { '--cor-categoria': categoria.cor } as CSSProperties
  return (
    <article className={styles.destaque} style={estilo}>
      <img
        onError={ocultarSeFalhar}
        className={styles.fundo}
        src={capaDoVideo(video.youtubeId)}
        alt=""
        loading="lazy"
      />
      <div className={styles.veu} />
      <div className={styles.textoDestaque}>
        <p className={styles.rotulos}>
          <Rotulo categoria={categoria} />
          {banner ? <span className={styles.selo}>Banner</span> : null}
        </p>
        <h3 className={styles.tituloDestaque}>{video.titulo}</h3>
        <BotaoPilula variante="claro" href={`${base}assistir/${video.id}`}>
          Assistir no Flix
        </BotaoPilula>
      </div>
    </article>
  )
}

/* Monta cabeçalho, carrossel de destaques, abas por categoria e rodapé. */
export function SecaoFlix() {
  const p = projeto(1)
  const abas = categorias.map((categoria) => ({
    id: categoria.id,
    rotulo: categoria.nome,
    conteudo: (
      <ul className={styles.trilho}>
        {videosDaCategoria(catalogo, categoria.id).map((video) => (
          <li
            key={video.id}
            className={styles.video}
            style={{ '--cor-categoria': categoria.cor } as CSSProperties}
          >
            <img
              onError={ocultarSeFalhar}
              className={styles.miniatura}
              src={capaDoVideo(video.youtubeId)}
              alt=""
              loading="lazy"
            />
            <h4 className={styles.tituloVideo}>
              <a href={`${p.href}assistir/${video.id}`} className={styles.linkVideo}>
                {video.titulo}
              </a>
            </h4>
            <p className={styles.canal}>{video.canal}</p>
          </li>
        ))}
      </ul>
    ),
  }))

  return (
    <Secao projeto={p}>
      <CabecalhoSecao projeto={p} />
      <Carrossel
        rotulo="Destaques do Flix, um por categoria"
        variante="espiar"
        largura="min(78%, 56rem)"
        itens={categorias.map((categoria) => {
          const video = destaqueDaCategoria(catalogo, categoria.id)
          return video ? (
            <Destaque
              key={categoria.id}
              categoria={categoria}
              video={video}
              banner={categoria.id === catalogo.categoriaBannerId}
              base={p.href}
            />
          ) : null
        })}
      />
      <div className={styles.categorias}>
        <h3 className={styles.subtitulo}>Por categoria</h3>
        <AbasSegmentadas rotulo="Categorias de vídeo do Flix" abas={abas} />
      </div>
      <RodapeSecao projeto={p} />
    </Secao>
  )
}
/* Fim da seção Flix. */
