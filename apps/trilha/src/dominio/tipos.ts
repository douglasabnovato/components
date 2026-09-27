/*
 * Tipos e esquemas do domínio da Trilha. Os esquemas Zod validam o conteúdo
 * da trilha nos testes e o progresso que volta do navegador.
 */
import { z } from 'zod'

export const esquemaModulo = z.object({
  numero: z.number().int().positive(),
  titulo: z.string().min(1),
  autor: z.string().optional(),
})

export const esquemaAprendizado = z.object({
  numero: z.number().int().positive(),
  modulo: z.number().int().positive(),
  titulo: z.string().min(1),
  duracao: z.string().regex(/^(\d+h\d{2}|\d+ min)$/, 'Duração no formato "46 min" ou "2h34".'),
  descricao: z.string().min(1),
  youtubeId: z.string().regex(/^[\w-]{11}$/),
  historico: z.boolean().optional(),
  idioma: z.literal('en').optional(),
  autor: z.string().optional(),
})

export const esquemaStatus = z.enum(['atual', 'transicao', 'historico'])

export const esquemaCategoria = z.object({
  numero: z.number().int().positive(),
  nome: z.string().min(1),
})

export const esquemaTecnologia = z.object({
  numero: z.number().int().positive(),
  categoria: z.number().int().positive(),
  nome: z.string().min(1),
  oQueE: z.string().min(1),
  paraQue: z.string().min(1),
  aprendizados: z.array(z.number().int().positive()).min(1),
  status: esquemaStatus,
  nota: z.string().optional(),
})

export const esquemaProgresso = z.object({
  versao: z.literal(1),
  assistidos: z.array(z.number().int().positive()),
  notas: z.record(z.string(), z.string()),
})

export type Modulo = z.infer<typeof esquemaModulo>
export type Aprendizado = z.infer<typeof esquemaAprendizado>
export type StatusTecnologia = z.infer<typeof esquemaStatus>
export type Categoria = z.infer<typeof esquemaCategoria>
export type Tecnologia = z.infer<typeof esquemaTecnologia>
export type Progresso = z.infer<typeof esquemaProgresso>
/* Fim dos tipos do domínio. */
