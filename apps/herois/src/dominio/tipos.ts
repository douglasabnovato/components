/*
 * Tipos e esquemas do Portal de Heróis. O esquema valida o universo inteiro
 * nos testes: atributos de 1 a 10, equipes e universos que existem, slugs únicos.
 */
import { z } from 'zod'

export const EMBLEMAS = [
  'onda',
  'raiz',
  'pena',
  'flor',
  'brasa',
  'nevoa',
  'circuito',
  'eco',
  'prisma',
  'bussola',
  'escudo',
  'lua',
] as const

export const ATRIBUTOS = [
  { chave: 'forca', rotulo: 'Força' },
  { chave: 'agilidade', rotulo: 'Agilidade' },
  { chave: 'mente', rotulo: 'Mente' },
  { chave: 'resistencia', rotulo: 'Resistência' },
] as const

const nota = z.number().int().min(1).max(10)

export const esquemaUniverso = z.object({
  slug: z.string().regex(/^[a-z-]+$/),
  nome: z.string().min(1),
  descricao: z.string().min(1),
})

export const esquemaEquipe = z.object({
  slug: z.string().regex(/^[a-z-]+$/),
  nome: z.string().min(1),
  universo: z.string(),
  lema: z.string().min(1),
  cor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
})

export const esquemaHeroi = z.object({
  slug: z.string().regex(/^[a-z-]+$/),
  nome: z.string().min(1),
  identidade: z.string().min(1),
  cidade: z.string().min(1),
  equipe: z.string(),
  emblema: z.enum(EMBLEMAS),
  cor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  resumo: z.string().min(1),
  historia: z.string().min(1),
  poderes: z.array(z.string().min(1)).min(2).max(4),
  atributos: z.object({ forca: nota, agilidade: nota, mente: nota, resistencia: nota }),
})

export type Universo = z.infer<typeof esquemaUniverso>
export type Equipe = z.infer<typeof esquemaEquipe>
export type Heroi = z.infer<typeof esquemaHeroi>
export type Emblema = (typeof EMBLEMAS)[number]
export type ChaveAtributo = (typeof ATRIBUTOS)[number]['chave']
/* Fim dos tipos do Portal de Heróis. */
