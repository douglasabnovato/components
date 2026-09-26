/*
 * Início do Flix. Carrossel com o vídeo destaque de cada categoria (a do
 * banner primeiro) e, abaixo, abas por categoria. Com ?busca= mostra os
 * resultados da busca no lugar.
 */
import { AbasSegmentadas, Carrossel, useAvisos } from '@components/ui'
import { useSearchParams } from 'react-router'
import { CardVideo } from '../../componentes/CardVideo/CardVideo'
import { Carregando, EstadoVazio } from '../../componentes/Estados/Estados'
import { LinkPilula } from '../../componentes/LinkPilula/LinkPilula'
import { RotuloCategoria } from '../../componentes/RotuloCategoria/RotuloCategoria'
import { useCatalogo, useRestaurarCatalogo } from '../../dados/consultas'
import {
  buscarVideos,
  categoriasComVideos,
  destaqueDaCategoria,
  videosDaCategoria,
} from '../../dominio/catalogo'
import type { Catalogo, Categoria } from '../../dominio/tipos'
import { capaDoVideo } from '../../dominio/youtube'
import { ocultarSeFalhar } from '../../componentes/imagem'
import styles from './Inicio.module.css'

/* Slide do carrossel: capa de fundo, categoria, título, resumo e ações. */
function SlideDestaque({
  catalogo,
  categoria,
  banner,
}: {
  catalogo: Catalogo
  categoria: Categoria
  banner: boolean
}) {
  const video = destaqueDaCategoria(catalogo, categoria.id)
  if (!video) return null
  return (
    <article className={styles.slide} style={{ ['--cor-categoria' as string]: categoria.cor }}>
      <img
        onError={ocultarSeFalhar}
        className={styles.fundo}
        src={capaDoVideo(video.youtubeId)}
        alt=""
      />
      <div className={styles.veu} />
      <div className={styles.textoSlide}>
        <div className={styles.rotulos}>
          <RotuloCategoria categoria={categoria} tamanho="g" />
          {banner ? <span className={styles.selo}>Banner</span> : null}
        </div>
        <h2 className={styles.tituloSlide}>{video.titulo}</h2>
        <p className={styles.descricao}>{video.descricao}</p>
        <LinkPilula to={`/assistir/${video.id}`} variante="claro" icone="▶">
          Assistir
        </LinkPilula>
      </div>
    </article>
  )
}

/* Resultados da busca em grade. */
function Resultados({ catalogo, termo }: { catalogo: Catalogo; termo: string }) {
  const encontrados = buscarVideos(catalogo, termo)
  return (
    <section aria-labelledby="titulo-busca" className={styles.bloco}>
      <div className={styles.cabecalhoBloco}>
        <h1 id="titulo-busca" className={styles.titulo}>
          Busca: “{termo}”
        </h1>
        <p className={styles.contagem} role="status">
          {encontrados.length === 1
            ? '1 vídeo encontrado'
            : `${encontrados.length} vídeos encontrados`}
        </p>
        <LinkPilula to="/" variante="vazado">
          Limpar busca
        </LinkPilula>
      </div>
      <ul className={styles.grade}>
        {encontrados.map((v) => (
          <li key={v.id}>
            <CardVideo
              video={v}
              categoria={catalogo.categorias.find((c) => c.id === v.categoriaId)}
              mostrarCategoria
              nivel="h2"
            />
          </li>
        ))}
      </ul>
    </section>
  )
}

/* Monta a página a partir do catálogo em cache. */
export function Inicio() {
  const { data: catalogo, isPending } = useCatalogo()
  const [parametros] = useSearchParams()
  const restaurar = useRestaurarCatalogo()
  const avisar = useAvisos()
  const termo = parametros.get('busca')?.trim() ?? ''

  if (isPending || !catalogo) return <Carregando />
  if (termo) return <Resultados catalogo={catalogo} termo={termo} />

  const categorias = categoriasComVideos(catalogo)
  if (categorias.length === 0) {
    return (
      <EstadoVazio
        titulo="Seu catálogo está vazio"
        acoes={
          <>
            <LinkPilula to="/painel/videos/novo" icone="+">
              Novo vídeo
            </LinkPilula>
            <button
              type="button"
              className={styles.botaoTexto}
              onClick={async () => {
                await restaurar.mutateAsync()
                avisar({ mensagem: 'Catálogo inicial restaurado.' })
              }}
            >
              Restaurar catálogo inicial
            </button>
          </>
        }
      >
        Adicione um vídeo do YouTube ou volte ao catálogo de exemplo.
      </EstadoVazio>
    )
  }

  const abas = categorias.map((categoria) => ({
    id: categoria.id,
    rotulo: `${categoria.nome} (${videosDaCategoria(catalogo, categoria.id).length})`,
    conteudo: (
      <ul className={styles.grade}>
        {videosDaCategoria(catalogo, categoria.id).map((v) => (
          <li key={v.id}>
            <CardVideo video={v} categoria={categoria} />
          </li>
        ))}
      </ul>
    ),
  }))

  return (
    <>
      <h1 className="visualmente-oculto">Flix: vídeos em destaque</h1>
      <Carrossel
        rotulo="Vídeos em destaque por categoria"
        variante="espiar"
        largura="min(88%, 64rem)"
        itens={categorias.map((categoria) => (
          <SlideDestaque
            key={categoria.id}
            catalogo={catalogo}
            categoria={categoria}
            banner={categoria.id === catalogo.categoriaBannerId}
          />
        ))}
      />
      <section aria-labelledby="titulo-categorias" className={styles.bloco}>
        <h2 id="titulo-categorias" className={styles.titulo}>
          Por categoria
        </h2>
        <AbasSegmentadas rotulo="Categorias" abas={abas} />
      </section>
    </>
  )
}
/* Fim da Início. */
