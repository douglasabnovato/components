/*
 * Aba Categorias do painel: criar, renomear/recolorir, escolher o vídeo
 * destaque e a categoria do banner, e excluir em cascata com "Desfazer".
 */
import { Dialogo, useAvisos } from '@components/ui'
import { useState } from 'react'
import { RotuloCategoria } from '../../componentes/RotuloCategoria/RotuloCategoria'
import { useAlterarCatalogo } from '../../dados/consultas'
import {
  adicionarCategoria,
  definirBanner,
  definirDestaque,
  destaqueDaCategoria,
  editarCategoria,
  excluirCategoria,
  videosDaCategoria,
} from '../../dominio/catalogo'
import type { Catalogo, Categoria } from '../../dominio/tipos'
import { FormCategoria } from './FormCategoria'
import styles from './Painel.module.css'

/* Lista as categorias com seus controles e os diálogos de edição e exclusão. */
export function PainelCategorias({ catalogo }: { catalogo: Catalogo }) {
  const alterar = useAlterarCatalogo()
  const avisar = useAvisos()
  const [editando, setEditando] = useState<Categoria | null>(null)
  const [excluindo, setExcluindo] = useState<Categoria | null>(null)

  /* Exclui a categoria e oferece desfazer com o catálogo anterior. */
  async function confirmarExclusao() {
    if (!excluindo) return
    const anterior = catalogo
    const quantidade = videosDaCategoria(catalogo, excluindo.id).length
    await alterar.mutateAsync((c) => excluirCategoria(c, excluindo.id))
    setExcluindo(null)
    avisar({
      mensagem: `“${excluindo.nome}” e ${quantidade} vídeo(s) excluídos.`,
      acao: { rotulo: 'Desfazer', executar: () => alterar.mutate(() => anterior) },
    })
  }

  const qtdExcluindo = excluindo ? videosDaCategoria(catalogo, excluindo.id).length : 0

  return (
    <div className={styles.aba}>
      <section aria-labelledby="titulo-nova-categoria" className={styles.caixa}>
        <h2 id="titulo-nova-categoria" className={styles.subtitulo}>
          Nova categoria
        </h2>
        <FormCategoria
          rotuloAcao="Criar categoria"
          aoSalvar={async (dados) => {
            const { catalogo: novo, categoria } = adicionarCategoria(catalogo, dados)
            await alterar.mutateAsync(() => novo)
            avisar({ mensagem: `Categoria "${categoria.nome}" criada.` })
          }}
        />
      </section>

      <fieldset className={styles.lista}>
        <legend className={styles.subtitulo}>Categorias ({catalogo.categorias.length})</legend>
        <p className={styles.dica}>
          A categoria marcada em “Banner” abre o carrossel da Início. Só categorias com vídeos podem
          ir para o banner.
        </p>
        <ul className={styles.itens}>
          {catalogo.categorias.map((categoria) => {
            const videos = videosDaCategoria(catalogo, categoria.id)
            const destaque = destaqueDaCategoria(catalogo, categoria.id)
            const idSelect = `destaque-${categoria.id}`
            return (
              <li key={categoria.id} className={styles.item}>
                <div className={styles.identidade}>
                  <RotuloCategoria categoria={categoria} tamanho="g" />
                  <span className={styles.qtd}>
                    {videos.length === 1 ? '1 vídeo' : `${videos.length} vídeos`}
                  </span>
                </div>
                <div className={styles.controle}>
                  <label htmlFor={idSelect}>Vídeo destaque</label>
                  <select
                    id={idSelect}
                    value={destaque?.id ?? ''}
                    disabled={videos.length === 0}
                    onChange={(e) =>
                      alterar.mutate((c) => definirDestaque(c, categoria.id, e.target.value))
                    }
                  >
                    {videos.length === 0 ? <option value="">Sem vídeos</option> : null}
                    {videos.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.titulo}
                      </option>
                    ))}
                  </select>
                </div>
                <label className={styles.banner}>
                  <input
                    type="radio"
                    name="banner"
                    checked={catalogo.categoriaBannerId === categoria.id}
                    disabled={videos.length === 0}
                    onChange={() => alterar.mutate((c) => definirBanner(c, categoria.id))}
                  />
                  Banner<span className="visualmente-oculto">: {categoria.nome}</span>
                </label>
                <div className={styles.acoesItem}>
                  <button
                    type="button"
                    className={styles.botaoSecundario}
                    onClick={() => setEditando(categoria)}
                  >
                    Editar <span className="visualmente-oculto">{categoria.nome}</span>
                  </button>
                  <button
                    type="button"
                    className={styles.botaoPerigo}
                    onClick={() => setExcluindo(categoria)}
                  >
                    Excluir <span className="visualmente-oculto">{categoria.nome}</span>
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      </fieldset>

      <Dialogo
        aberto={editando !== null}
        titulo="Editar categoria"
        aoFechar={() => setEditando(null)}
      >
        {editando ? (
          <FormCategoria
            key={editando.id}
            inicial={{ nome: editando.nome, cor: editando.cor }}
            rotuloAcao="Salvar"
            aoCancelar={() => setEditando(null)}
            aoSalvar={async (dados) => {
              const novo = editarCategoria(catalogo, editando.id, dados)
              await alterar.mutateAsync(() => novo)
              setEditando(null)
              avisar({ mensagem: 'Categoria atualizada.' })
            }}
          />
        ) : null}
      </Dialogo>

      <Dialogo
        aberto={excluindo !== null}
        titulo={`Excluir “${excluindo?.nome ?? ''}”?`}
        aoFechar={() => setExcluindo(null)}
        acoes={
          <>
            <button
              type="button"
              className={styles.botaoSecundario}
              onClick={() => setExcluindo(null)}
            >
              Cancelar
            </button>
            <button type="button" className={styles.botaoPerigoCheio} onClick={confirmarExclusao}>
              Excluir categoria e vídeos
            </button>
          </>
        }
      >
        <p>
          {qtdExcluindo === 0
            ? 'A categoria não tem vídeos.'
            : `Os ${qtdExcluindo} vídeo(s) desta categoria também serão excluídos.`}{' '}
          Você poderá desfazer logo em seguida.
        </p>
      </Dialogo>
    </div>
  )
}
/* Fim da aba Categorias. */
