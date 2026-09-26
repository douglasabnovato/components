/*
 * Regras de negócio do Flix, como funções puras sobre o Catalogo.
 * Toda operação devolve um catálogo novo já normalizado, garantindo:
 * R1 o primeiro vídeo de uma categoria vira o destaque dela;
 * R3 há no máximo 1 destaque por categoria e 1 categoria de banner;
 * R4 excluir categoria exclui os vídeos dela;
 * R5 o banner sempre aponta para uma categoria com vídeos, quando houver;
 * R6 nomes de categoria são únicos (sem diferenciar maiúsculas e acentos).
 */
import { ErroDominio } from './erros'
import type { Catalogo, Categoria, DadosCategoria, DadosVideo, Video } from './tipos'

type GeradorId = () => string

const gerarIdPadrao: GeradorId = () => crypto.randomUUID()

/* Compara textos ignorando maiúsculas, acentos e espaços nas pontas. */
export function chaveTexto(texto: string) {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').trim().toLowerCase()
}

/* Catálogo vazio, ponto de partida quando não há dados. */
export function catalogoVazio(): Catalogo {
  return {
    versao: 1,
    categorias: [],
    videos: [],
    categoriaBannerId: null,
    destaquePorCategoria: {},
  }
}

/* Vídeos de uma categoria, na ordem do catálogo (mais novos primeiro). */
export function videosDaCategoria(catalogo: Catalogo, categoriaId: string) {
  return catalogo.videos.filter((v) => v.categoriaId === categoriaId)
}

/* Vídeo destaque de uma categoria, se houver. */
export function destaqueDaCategoria(catalogo: Catalogo, categoriaId: string): Video | undefined {
  const id = catalogo.destaquePorCategoria[categoriaId]
  return catalogo.videos.find((v) => v.id === id)
}

/* Categorias que têm vídeos, com a categoria do banner em primeiro lugar. */
export function categoriasComVideos(catalogo: Catalogo): Categoria[] {
  const comVideos = catalogo.categorias.filter((c) => videosDaCategoria(catalogo, c.id).length > 0)
  return [...comVideos].sort((a, b) =>
    a.id === catalogo.categoriaBannerId ? -1 : b.id === catalogo.categoriaBannerId ? 1 : 0,
  )
}

/* Garante as invariantes R1, R3, R4 e R5 depois de qualquer mudança. */
export function normalizar(catalogo: Catalogo): Catalogo {
  const idsCategorias = new Set(catalogo.categorias.map((c) => c.id))
  const videos = catalogo.videos.filter((v) => idsCategorias.has(v.categoriaId))

  const destaquePorCategoria: Record<string, string> = {}
  for (const categoria of catalogo.categorias) {
    const daCategoria = videos.filter((v) => v.categoriaId === categoria.id)
    if (daCategoria.length === 0) continue
    const atual = catalogo.destaquePorCategoria[categoria.id]
    const valido = daCategoria.some((v) => v.id === atual)
    destaquePorCategoria[categoria.id] = valido && atual ? atual : daCategoria[0]!.id
  }

  const temVideos = (id: string | null) => id !== null && destaquePorCategoria[id] !== undefined
  const primeiraComVideos =
    catalogo.categorias.find((c) => destaquePorCategoria[c.id] !== undefined)?.id ?? null
  const categoriaBannerId = temVideos(catalogo.categoriaBannerId)
    ? catalogo.categoriaBannerId
    : primeiraComVideos

  return { ...catalogo, videos, destaquePorCategoria, categoriaBannerId }
}

/* Valida nome e cor e garante que o nome não se repita (R6). */
function validarCategoria(catalogo: Catalogo, dados: DadosCategoria, ignorarId?: string) {
  const nome = dados.nome.trim()
  if (!nome) throw new ErroDominio('Informe o nome da categoria.')
  if (!/^#[0-9a-fA-F]{6}$/.test(dados.cor)) throw new ErroDominio('Escolha uma cor válida.')
  const repetida = catalogo.categorias.some(
    (c) => c.id !== ignorarId && chaveTexto(c.nome) === chaveTexto(nome),
  )
  if (repetida) throw new ErroDominio(`Já existe uma categoria chamada "${nome}".`)
  return { nome, cor: dados.cor.toUpperCase() }
}

/* Cria uma categoria no fim da lista (R2: a primeira vira banner quando tiver vídeos). */
export function adicionarCategoria(
  catalogo: Catalogo,
  dados: DadosCategoria,
  gerarId: GeradorId = gerarIdPadrao,
) {
  const categoria: Categoria = { id: gerarId(), ...validarCategoria(catalogo, dados) }
  return {
    catalogo: normalizar({ ...catalogo, categorias: [...catalogo.categorias, categoria] }),
    categoria,
  }
}

/* Renomeia ou recolore uma categoria; os vídeos continuam ligados pelo id. */
export function editarCategoria(catalogo: Catalogo, id: string, dados: DadosCategoria) {
  if (!catalogo.categorias.some((c) => c.id === id))
    throw new ErroDominio('Categoria não encontrada.')
  const valido = validarCategoria(catalogo, dados, id)
  return normalizar({
    ...catalogo,
    categorias: catalogo.categorias.map((c) => (c.id === id ? { ...c, ...valido } : c)),
  })
}

/* Exclui a categoria e, em cascata, os vídeos dela (R4). */
export function excluirCategoria(catalogo: Catalogo, id: string) {
  return normalizar({
    ...catalogo,
    categorias: catalogo.categorias.filter((c) => c.id !== id),
    videos: catalogo.videos.filter((v) => v.categoriaId !== id),
  })
}

/* Confere título, categoria e ID do YouTube antes de gravar um vídeo. */
function validarVideo(catalogo: Catalogo, dados: DadosVideo): DadosVideo {
  const titulo = dados.titulo.trim()
  if (!titulo) throw new ErroDominio('Informe o título do vídeo.')
  if (!/^[\w-]{11}$/.test(dados.youtubeId)) throw new ErroDominio('Link do YouTube inválido.')
  if (!catalogo.categorias.some((c) => c.id === dados.categoriaId))
    throw new ErroDominio('Escolha uma categoria existente.')
  return { ...dados, titulo, descricao: dados.descricao.trim() }
}

/* Adiciona o vídeo no topo da lista (R1: se for o primeiro da categoria, vira destaque). */
export function adicionarVideo(
  catalogo: Catalogo,
  dados: DadosVideo,
  gerarId: GeradorId = gerarIdPadrao,
) {
  const video: Video = { id: gerarId(), ...validarVideo(catalogo, dados) }
  return { catalogo: normalizar({ ...catalogo, videos: [video, ...catalogo.videos] }), video }
}

/* Edita mantendo id e destaque (R11); trocar de categoria passa o destaque adiante. */
export function editarVideo(catalogo: Catalogo, id: string, dados: DadosVideo) {
  const anterior = catalogo.videos.find((v) => v.id === id)
  if (!anterior) throw new ErroDominio('Vídeo não encontrado.')
  const valido = validarVideo(catalogo, dados)
  const destaquePorCategoria = { ...catalogo.destaquePorCategoria }
  if (
    anterior.categoriaId !== valido.categoriaId &&
    destaquePorCategoria[anterior.categoriaId] === id
  ) {
    delete destaquePorCategoria[anterior.categoriaId]
  }
  return normalizar({
    ...catalogo,
    destaquePorCategoria,
    videos: catalogo.videos.map((v) => (v.id === id ? { id, ...valido } : v)),
  })
}

/* Exclui o vídeo; o próximo da categoria assume o destaque (R5). */
export function excluirVideo(catalogo: Catalogo, id: string) {
  return normalizar({ ...catalogo, videos: catalogo.videos.filter((v) => v.id !== id) })
}

/* Define a categoria do banner; ela precisa ter vídeos. */
export function definirBanner(catalogo: Catalogo, categoriaId: string) {
  if (videosDaCategoria(catalogo, categoriaId).length === 0)
    throw new ErroDominio('Só uma categoria com vídeos pode ir para o banner.')
  return normalizar({ ...catalogo, categoriaBannerId: categoriaId })
}

/* Define o vídeo destaque de uma categoria; o vídeo precisa ser dela. */
export function definirDestaque(catalogo: Catalogo, categoriaId: string, videoId: string) {
  const video = catalogo.videos.find((v) => v.id === videoId)
  if (!video || video.categoriaId !== categoriaId)
    throw new ErroDominio('O vídeo destaque precisa ser da própria categoria.')
  return normalizar({
    ...catalogo,
    destaquePorCategoria: { ...catalogo.destaquePorCategoria, [categoriaId]: videoId },
  })
}

/* Busca por título, descrição ou canal, ignorando acentos e maiúsculas. */
export function buscarVideos(catalogo: Catalogo, termo: string) {
  const chave = chaveTexto(termo)
  if (!chave) return []
  return catalogo.videos.filter((v) =>
    [v.titulo, v.descricao, v.canal ?? ''].some((campo) => chaveTexto(campo).includes(chave)),
  )
}
/* Fim das regras de negócio do Flix. */
