/*
 * Painel do Flix: seletor Categorias ⇄ Vídeos (guardado na URL como ?aba=)
 * e a área de dados com exportar, importar e restaurar o catálogo inicial.
 */
import { Dialogo, SeletorPilula, useAvisos } from '@components/ui'
import { useId, useState, type ChangeEvent } from 'react'
import { useSearchParams } from 'react-router'
import { Carregando } from '../../componentes/Estados/Estados'
import { exportarCatalogo, importarCatalogo } from '../../dados/arquivo'
import { useAlterarCatalogo, useCatalogo, useRestaurarCatalogo } from '../../dados/consultas'
import { ErroDominio } from '../../dominio/tipos'
import { PainelCategorias } from './PainelCategorias'
import { PainelVideos } from './PainelVideos'
import styles from './Painel.module.css'

type Aba = 'categorias' | 'videos'

/* Escolhe a aba pela URL e monta a área de dados. */
export function Painel() {
  const { data: catalogo, isPending } = useCatalogo()
  const [parametros, setParametros] = useSearchParams()
  const alterar = useAlterarCatalogo()
  const restaurar = useRestaurarCatalogo()
  const avisar = useAvisos()
  const [confirmarRestauracao, setConfirmarRestauracao] = useState(false)
  const idPainel = useId()
  const idArquivo = useId()
  const aba: Aba = parametros.get('aba') === 'videos' ? 'videos' : 'categorias'

  if (isPending || !catalogo) return <Carregando />

  /* Lê o arquivo escolhido e substitui o catálogo, com desfazer. */
  async function importar(evento: ChangeEvent<HTMLInputElement>) {
    const arquivo = evento.target.files?.[0]
    evento.target.value = ''
    if (!arquivo || !catalogo) return
    try {
      const importado = importarCatalogo(await arquivo.text())
      const anterior = catalogo
      await alterar.mutateAsync(() => importado)
      avisar({
        mensagem: `Catálogo importado: ${importado.videos.length} vídeo(s).`,
        acao: { rotulo: 'Desfazer', executar: () => alterar.mutate(() => anterior) },
      })
    } catch (erro) {
      avisar({
        mensagem: erro instanceof ErroDominio ? erro.message : 'Não foi possível importar.',
      })
    }
  }

  return (
    <div className={styles.painel}>
      <div className={styles.topo}>
        <h1 className={styles.titulo}>Painel</h1>
        <SeletorPilula<Aba>
          rotulo="Seção do painel"
          valor={aba}
          controla={idPainel}
          aoMudar={(nova) => setParametros(nova === 'videos' ? { aba: 'videos' } : {})}
          opcoes={[
            { valor: 'categorias', rotulo: 'Categorias' },
            { valor: 'videos', rotulo: 'Vídeos' },
          ]}
        />
      </div>

      <div id={idPainel}>
        {aba === 'categorias' ? (
          <PainelCategorias catalogo={catalogo} />
        ) : (
          <PainelVideos catalogo={catalogo} />
        )}
      </div>

      <section aria-labelledby="titulo-dados" className={styles.caixa}>
        <h2 id="titulo-dados" className={styles.subtitulo}>
          Seus dados
        </h2>
        <p className={styles.dica}>
          O catálogo fica salvo só neste navegador. Exporte para guardar um backup ou levar para
          outro computador.
        </p>
        <div className={styles.acoesItem}>
          <button
            type="button"
            className={styles.botaoSecundario}
            onClick={() => exportarCatalogo(catalogo)}
          >
            Exportar JSON
          </button>
          <label htmlFor={idArquivo} className={styles.botaoSecundario}>
            Importar JSON
          </label>
          <input
            id={idArquivo}
            type="file"
            accept="application/json,.json"
            className="visualmente-oculto"
            onChange={importar}
          />
          <button
            type="button"
            className={styles.botaoPerigo}
            onClick={() => setConfirmarRestauracao(true)}
          >
            Restaurar catálogo inicial
          </button>
        </div>
      </section>

      <Dialogo
        aberto={confirmarRestauracao}
        titulo="Restaurar o catálogo inicial?"
        aoFechar={() => setConfirmarRestauracao(false)}
        acoes={
          <>
            <button
              type="button"
              className={styles.botaoSecundario}
              onClick={() => setConfirmarRestauracao(false)}
            >
              Cancelar
            </button>
            <button
              type="button"
              className={styles.botaoPerigoCheio}
              onClick={async () => {
                const anterior = catalogo
                await restaurar.mutateAsync()
                setConfirmarRestauracao(false)
                avisar({
                  mensagem: 'Catálogo inicial restaurado.',
                  acao: { rotulo: 'Desfazer', executar: () => alterar.mutate(() => anterior) },
                })
              }}
            >
              Restaurar
            </button>
          </>
        }
      >
        <p>Suas categorias e vídeos atuais serão substituídos pelo catálogo de exemplo.</p>
      </Dialogo>
    </div>
  )
}
/* Fim do Painel. */
