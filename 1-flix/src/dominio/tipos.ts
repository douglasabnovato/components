/*
 * Tipos e esquemas do domínio do Flix. O esquema Zod valida tudo que vem de
 * fora (localStorage, arquivo importado) antes de virar estado da aplicação.
 */
import { z } from 'zod'

export const esquemaCor = z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Use uma cor no formato #RRGGBB.')

export const esquemaCategoria = z.object({
  id: z.string().min(1),
  nome: z.string().trim().min(1),
  cor: esquemaCor,
})

export const esquemaVideo = z.object({
  id: z.string().min(1),
  titulo: z.string().trim().min(1),
  descricao: z.string(),
  youtubeId: z.string().regex(/^[\w-]{11}$/),
  categoriaId: z.string().min(1),
  canal: z.string().optional(),
})

export const esquemaCatalogo = z.object({
  versao: z.literal(1),
  categorias: z.array(esquemaCategoria),
  videos: z.array(esquemaVideo),
  categoriaBannerId: z.string().nullable(),
  destaquePorCategoria: z.record(z.string(), z.string()),
})

export type Categoria = z.infer<typeof esquemaCategoria>
export type Video = z.infer<typeof esquemaVideo>
export type Catalogo = z.infer<typeof esquemaCatalogo>

export type DadosCategoria = Pick<Categoria, 'nome' | 'cor'>
export type DadosVideo = Omit<Video, 'id'>

export { ErroDominio } from './erros'
/* Fim dos tipos do domínio. */
