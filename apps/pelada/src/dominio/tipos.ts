/*
 * Tipos e esquemas do domínio da Pelada. Os esquemas Zod validam o que volta
 * do navegador e os dados do formulário de novo jogo.
 */
import { z } from 'zod'

export const NIVEIS = [
  { valor: 1, rotulo: 'Iniciante' },
  { valor: 2, rotulo: 'Regular' },
  { valor: 3, rotulo: 'Bom' },
  { valor: 4, rotulo: 'Muito bom' },
  { valor: 5, rotulo: 'Craque' },
] as const

export const MODALIDADES = ['Society', 'Futsal', 'Campo', 'Areia'] as const

export const esquemaJogador = z.object({
  id: z.string().min(1),
  nome: z.string().min(1),
  nivel: z.number().int().min(1).max(5),
  confirmadoEm: z.string().min(1),
})

export const esquemaSorteio = z.object({
  times: z.array(z.array(z.string())),
  reservas: z.array(z.string()),
  feitoEm: z.string(),
})

export const esquemaJogo = z.object({
  id: z.string().min(1),
  titulo: z.string().min(1),
  modalidade: z.enum(MODALIDADES),
  data: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/),
  local: z.string().min(1),
  vagas: z.number().int().positive(),
  porTime: z.number().int().positive(),
  confirmados: z.array(esquemaJogador),
  espera: z.array(esquemaJogador),
  sorteio: esquemaSorteio.nullable(),
})

export const esquemaEstado = z.object({
  versao: z.literal(1),
  organizador: z.string(),
  jogos: z.array(esquemaJogo),
})

export const esquemaNovoJogo = z
  .object({
    titulo: z
      .string()
      .trim()
      .min(3, 'Dê um nome com pelo menos 3 letras.')
      .max(40, 'Use até 40 letras.'),
    modalidade: z.enum(MODALIDADES),
    data: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, 'Informe dia e horário.'),
    local: z.string().trim().min(2, 'Informe o local.'),
    vagas: z
      .number()
      .int('Use um número inteiro.')
      .min(4, 'Mínimo de 4 vagas.')
      .max(40, 'Máximo de 40 vagas.'),
    porTime: z
      .number()
      .int('Use um número inteiro.')
      .min(2, 'Mínimo de 2 por time.')
      .max(11, 'Máximo de 11 por time.'),
  })
  .refine((d) => d.vagas >= d.porTime * 2, {
    message: 'As vagas precisam formar pelo menos 2 times.',
    path: ['vagas'],
  })

export type Jogador = z.infer<typeof esquemaJogador>
export type Sorteio = z.infer<typeof esquemaSorteio>
export type Jogo = z.infer<typeof esquemaJogo>
export type EstadoPelada = z.infer<typeof esquemaEstado>
export type NovoJogo = z.infer<typeof esquemaNovoJogo>
export type Modalidade = (typeof MODALIDADES)[number]

export type Resultado<T> = { ok: true; valor: T } | { ok: false; erro: string }
/* Fim dos tipos do domínio. */
