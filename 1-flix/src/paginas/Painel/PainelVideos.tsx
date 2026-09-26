/*
 * Aba Vídeos do painel: tabela com capa, título, categoria e destaque,
 * editar (formulário) e excluir com "Desfazer".
 */
import { useAvisos } from '@components/ui'
import { Link } from 'react-router'
import { LinkPilula } from '../../componentes/LinkPilula/LinkPilula'
import { RotuloCategoria } from '../../componentes/RotuloCategoria/RotuloCategoria'
import { useAlterarCatalogo } from '../../dados/consultas'
import { excluirVideo } from '../../dominio/catalogo'
import type { Catalogo, Video } from '../../dominio/tipos'
import { capaDoVideo } from '../../dominio/youtube'
import { ocultarSeFalhar } from '../../componentes/imagem'
import styles from './Painel.module.css'

/* Monta a tabela de vídeos e a exclusão com desfazer. */
export function PainelVideos({ catalogo }: { catalogo: Catalogo }) {
  const alterar = useAlterarCatalogo()
  const avisar = useAvisos()

  /* Exclui na hora e deixa o catálogo anterior pronto para desfazer. */
  async function excluir(video: Video) {
    const anterior = catalogo
    await alterar.mutateAsync((c) => excluirVideo(c, video.id))
    avisar({
      mensagem: `“${video.titulo}” excluído.`,
      acao: { rotulo: 'Desfazer', executar: () => alterar.mutate(() => anterior) },
    })
  }

  return (
    <div className={styles.aba}>
      <div className={styles.topoAba}>
        <h2 className={styles.subtitulo}>Vídeos ({catalogo.videos.length})</h2>
        <LinkPilula to="/painel/videos/novo" icone="+">
          Novo vídeo
        </LinkPilula>
      </div>
      {catalogo.videos.length === 0 ? (
        <p className={styles.dica}>Nenhum vídeo cadastrado.</p>
      ) : (
        <div className={styles.rolagem}>
          <table className={styles.tabela}>
            <caption className="visualmente-oculto">Vídeos do catálogo</caption>
            <thead>
              <tr>
                <th scope="col">Vídeo</th>
                <th scope="col">Categoria</th>
                <th scope="col">Destaque</th>
                <th scope="col">
                  <span className="visualmente-oculto">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {catalogo.videos.map((video) => {
                const categoria = catalogo.categorias.find((c) => c.id === video.categoriaId)
                const destaque = catalogo.destaquePorCategoria[video.categoriaId] === video.id
                return (
                  <tr key={video.id}>
                    <td>
                      <div className={styles.videoCelula}>
                        <img
                          onError={ocultarSeFalhar}
                          src={capaDoVideo(video.youtubeId)}
                          alt=""
                          width="96"
                          height="54"
                          loading="lazy"
                        />
                        <Link to={`/assistir/${video.id}`}>{video.titulo}</Link>
                      </div>
                    </td>
                    <td>{categoria ? <RotuloCategoria categoria={categoria} /> : null}</td>
                    <td>{destaque ? 'Sim' : '—'}</td>
                    <td>
                      <div className={styles.acoesItem}>
                        <Link
                          className={styles.botaoSecundario}
                          to={`/painel/videos/${video.id}/editar`}
                        >
                          Editar <span className="visualmente-oculto">{video.titulo}</span>
                        </Link>
                        <button
                          type="button"
                          className={styles.botaoPerigo}
                          onClick={() => excluir(video)}
                        >
                          Excluir <span className="visualmente-oculto">{video.titulo}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
/* Fim da aba Vídeos. */
