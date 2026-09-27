/*
 * Formato padrão de erro da API: mensagem geral e, quando for validação,
 * a mensagem de cada campo. O front usa o mesmo esquema para ler a resposta.
 */
import { z } from 'zod'

export const esquemaErroApi = z.object({
  erro: z.string(),
  campos: z.record(z.string(), z.string()).optional(),
})

export type ErroApi = z.infer<typeof esquemaErroApi>

/* Converte os problemas do Zod em { campo: mensagem } (primeira mensagem de cada campo). */
export function errosPorCampo(problemas: { path: PropertyKey[]; message: string }[]) {
  const campos: Record<string, string> = {}
  for (const p of problemas) {
    const chave = String(p.path[0] ?? 'geral')
    campos[chave] ??= p.message
  }
  return campos
}
/* Fim do formato de erro. */
