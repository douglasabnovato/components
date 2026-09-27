/*
 * Contrato de tarefas: esquemas usados pelo app Tarefas (front) e pelas rotas
 * /tarefas da API (back), incluindo a busca por expressão regular.
 */
import { z } from 'zod'

export const esquemaNovaTarefa = z.object({
  descricao: z.string().trim().min(1, 'Descreva a tarefa.').max(280, 'Use até 280 caracteres.'),
})

export const esquemaAlteracaoTarefa = z
  .object({
    descricao: esquemaNovaTarefa.shape.descricao.optional(),
    concluida: z.boolean().optional(),
  })
  .refine((d) => d.descricao !== undefined || d.concluida !== undefined, {
    message: 'Nada para alterar.',
  })

export const esquemaTarefa = z.object({
  id: z.string().min(1),
  descricao: z.string(),
  concluida: z.boolean(),
  criadaEm: z.string(),
})

export const SITUACOES_TAREFA = ['todas', 'pendentes', 'concluidas'] as const

export const esquemaConsultaTarefas = z.object({
  busca: z.string().max(100, 'Use um padrão de até 100 caracteres.').optional(),
  situacao: z.enum(SITUACOES_TAREFA).optional(),
})

/* Diz se o texto é uma expressão regular válida; devolve a mensagem de erro se não for. */
export function validarPadrao(padrao: string): string | null {
  try {
    new RegExp(padrao, 'i')
    return null
  } catch {
    return 'Expressão regular inválida.'
  }
}

export type NovaTarefa = z.infer<typeof esquemaNovaTarefa>
export type AlteracaoTarefa = z.infer<typeof esquemaAlteracaoTarefa>
export type Tarefa = z.infer<typeof esquemaTarefa>
export type SituacaoTarefa = (typeof SITUACOES_TAREFA)[number]
export type ConsultaTarefas = z.infer<typeof esquemaConsultaTarefas>
/* Fim do contrato de tarefas. */
