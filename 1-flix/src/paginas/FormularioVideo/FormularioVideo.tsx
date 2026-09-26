/*
 * Formulário de vídeo (novo e editar). React Hook Form + Zod: o link precisa
 * ser de um vídeo do YouTube; a capa aparece na hora como prévia. Dá para
 * criar uma categoria ali mesmo, sem sair do formulário.
 */
import { Campo, useAvisos } from '@components/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router'
import { z } from 'zod'
import { Carregando } from '../../componentes/Estados/Estados'
import { SeletorCor } from '../../componentes/SeletorCor/SeletorCor'
import { useAlterarCatalogo, useCatalogo } from '../../dados/consultas'
import { adicionarCategoria, adicionarVideo, editarVideo } from '../../dominio/catalogo'
import { ErroDominio, type Catalogo, type Video } from '../../dominio/tipos'
import { capaDoVideo, extrairYoutubeId, linkDoVideo } from '../../dominio/youtube'
import { NaoEncontrado } from '../NaoEncontrado/NaoEncontrado'
import { ocultarSeFalhar } from '../../componentes/imagem'
import styles from './FormularioVideo.module.css'

const esquema = z.object({
  titulo: z.string().trim().min(1, 'Informe o título.').max(120, 'Use até 120 caracteres.'),
  link: z
    .string()
    .trim()
    .min(1, 'Cole o link do vídeo.')
    .refine((valor) => extrairYoutubeId(valor) !== null, {
      message: 'Use um link de vídeo do YouTube (watch, youtu.be, shorts ou embed).',
    }),
  categoriaId: z.string().min(1, 'Escolha uma categoria.'),
  descricao: z.string().trim().max(500, 'Use até 500 caracteres.'),
})

type Campos = z.infer<typeof esquema>

/* Carrega o catálogo e decide entre criar e editar. */
export function FormularioVideo() {
  const { id } = useParams()
  const { data: catalogo, isPending } = useCatalogo()
  if (isPending || !catalogo) return <Carregando />
  const video = id ? catalogo.videos.find((v) => v.id === id) : undefined
  if (id && !video) return <NaoEncontrado titulo="Vídeo não encontrado" />
  return <Formulario key={id ?? 'novo'} catalogo={catalogo} video={video} />
}

/* Bloco recolhível para criar uma categoria sem sair do formulário. */
function NovaCategoria({
  catalogo,
  aoCriar,
}: {
  catalogo: Catalogo
  aoCriar: (id: string) => void
}) {
  const alterar = useAlterarCatalogo()
  const [nome, setNome] = useState('')
  const [cor, setCor] = useState('#1F4FD6')
  const [erro, setErro] = useState('')

  /* Cria a categoria e a seleciona no campo principal. */
  async function criar() {
    try {
      const { catalogo: novo, categoria } = adicionarCategoria(catalogo, { nome, cor })
      await alterar.mutateAsync(() => novo)
      aoCriar(categoria.id)
      setNome('')
      setErro('')
    } catch (e) {
      setErro(e instanceof ErroDominio ? e.message : 'Não foi possível criar a categoria.')
    }
  }

  return (
    <details className={styles.novaCategoria}>
      <summary>Não achou a categoria? Criar uma nova</summary>
      <div className={styles.linhaCategoria}>
        <Campo rotulo="Nome da categoria" htmlFor="nova-categoria-nome" erro={erro || undefined}>
          <input
            id="nova-categoria-nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            aria-invalid={Boolean(erro)}
            aria-describedby={erro ? 'nova-categoria-nome-erro' : undefined}
            autoComplete="off"
          />
        </Campo>
        <SeletorCor
          id="nova-categoria-cor"
          rotulo="Cor"
          valor={cor}
          nomePrevia={nome}
          onChange={(e) => setCor(e.target.value)}
        />
        <button type="button" className={styles.secundario} onClick={criar}>
          Criar e selecionar
        </button>
      </div>
    </details>
  )
}

/* Formulário propriamente dito, já com o catálogo carregado. */
function Formulario({ catalogo, video }: { catalogo: Catalogo; video?: Video }) {
  const alterar = useAlterarCatalogo()
  const avisar = useAvisos()
  const navegar = useNavigate()
  const [erroGeral, setErroGeral] = useState('')
  const [categoriaCriada, setCategoriaCriada] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Campos>({
    resolver: zodResolver(esquema),
    defaultValues: video
      ? {
          titulo: video.titulo,
          link: linkDoVideo(video.youtubeId),
          categoriaId: video.categoriaId,
          descricao: video.descricao,
        }
      : { titulo: '', link: '', categoriaId: catalogo.categorias[0]?.id ?? '', descricao: '' },
  })

  const youtubeId = extrairYoutubeId(useWatch({ control, name: 'link' }) ?? '')

  useEffect(() => {
    if (categoriaCriada && catalogo.categorias.some((c) => c.id === categoriaCriada)) {
      setValue('categoriaId', categoriaCriada, { shouldValidate: true })
    }
  }, [categoriaCriada, catalogo, setValue])

  /* Converte os campos em DadosVideo e aplica a regra de criar ou editar. */
  const enviar = handleSubmit(async (campos) => {
    const dados = {
      titulo: campos.titulo,
      descricao: campos.descricao,
      categoriaId: campos.categoriaId,
      youtubeId: extrairYoutubeId(campos.link) ?? '',
      canal: video?.youtubeId === extrairYoutubeId(campos.link) ? video?.canal : undefined,
    }
    try {
      let destinoId: string
      if (video) {
        const novo = editarVideo(catalogo, video.id, dados)
        await alterar.mutateAsync(() => novo)
        destinoId = video.id
      } else {
        const resultado = adicionarVideo(catalogo, dados)
        await alterar.mutateAsync(() => resultado.catalogo)
        destinoId = resultado.video.id
      }
      avisar({ mensagem: video ? 'Vídeo atualizado.' : 'Vídeo adicionado ao catálogo.' })
      navegar(`/assistir/${destinoId}`)
    } catch (e) {
      setErroGeral(e instanceof ErroDominio ? e.message : 'Não foi possível salvar o vídeo.')
    }
  })

  const erroDe = (campo: keyof Campos) =>
    errors[campo] ? { 'aria-invalid': true, 'aria-describedby': `video-${campo}-erro` } : {}

  return (
    <div className={styles.pagina}>
      <div className={styles.cabecalho}>
        <h1 className={styles.titulo}>{video ? 'Editar vídeo' : 'Novo vídeo'}</h1>
        <p className={styles.dica}>
          Cole o link do YouTube: a capa e o player são gerados automaticamente.
        </p>
      </div>

      <div className={styles.grade}>
        <form className={styles.formulario} onSubmit={enviar} noValidate>
          {erroGeral ? (
            <p className={styles.erroGeral} role="alert">
              {erroGeral}
            </p>
          ) : null}
          <Campo rotulo="Link do YouTube" htmlFor="video-link" erro={errors.link?.message}>
            <input
              id="video-link"
              type="url"
              inputMode="url"
              placeholder="https://www.youtube.com/watch?v=…"
              autoComplete="off"
              {...erroDe('link')}
              {...register('link')}
            />
          </Campo>
          <Campo rotulo="Título" htmlFor="video-titulo" erro={errors.titulo?.message}>
            <input
              id="video-titulo"
              autoComplete="off"
              {...erroDe('titulo')}
              {...register('titulo')}
            />
          </Campo>
          <Campo rotulo="Categoria" htmlFor="video-categoriaId" erro={errors.categoriaId?.message}>
            <select id="video-categoriaId" {...erroDe('categoriaId')} {...register('categoriaId')}>
              <option value="">Escolha…</option>
              {catalogo.categorias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
          </Campo>
          <NovaCategoria catalogo={catalogo} aoCriar={setCategoriaCriada} />
          <Campo
            rotulo="Descrição (opcional)"
            htmlFor="video-descricao"
            erro={errors.descricao?.message}
          >
            <textarea
              id="video-descricao"
              rows={4}
              {...erroDe('descricao')}
              {...register('descricao')}
            />
          </Campo>
          <div className={styles.acoes}>
            <Link to="/painel?aba=videos" className={styles.secundario}>
              Cancelar
            </Link>
            <button type="submit" className={styles.primario} disabled={isSubmitting}>
              {video ? 'Salvar alterações' : 'Adicionar vídeo'}
            </button>
          </div>
        </form>

        <aside className={styles.previa} aria-live="polite" aria-label="Prévia da capa">
          {youtubeId ? (
            <>
              <img
                onError={ocultarSeFalhar}
                src={capaDoVideo(youtubeId)}
                alt="Capa do vídeo informado"
              />
              <p>
                Vídeo reconhecido · ID <code>{youtubeId}</code>
              </p>
            </>
          ) : (
            <div className={styles.semPrevia}>
              <svg viewBox="0 0 24 24" width="40" height="40" aria-hidden="true">
                <path d="M8 5v14l11-7z" fill="currentColor" />
              </svg>
              <p>A prévia da capa aparece aqui.</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
/* Fim do formulário de vídeo. */
