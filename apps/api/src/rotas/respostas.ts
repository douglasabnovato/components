/*
 * Respostas padronizadas da API: validação com os esquemas dos contratos e
 * erros no formato { erro, campos? } lido pelo front.
 */
import { errosPorCampo, type ErroApi } from '@components/contratos'
import type { Context } from 'hono'
import type { z } from 'zod'

/* Valida um valor com o esquema; em caso de erro devolve a resposta 400 pronta. */
export function validar<T extends z.ZodType>(c: Context, esquema: T, valor: unknown) {
  const resultado = esquema.safeParse(valor)
  if (resultado.success) return { ok: true as const, dados: resultado.data as z.infer<T> }
  const corpo: ErroApi = { erro: 'Dados inválidos.', campos: errosPorCampo(resultado.error.issues) }
  return { ok: false as const, resposta: c.json(corpo, 400) }
}

/* Lê o JSON do corpo sem quebrar quando ele é inválido. */
export async function lerJson(c: Context): Promise<unknown> {
  try {
    return await c.req.json()
  } catch {
    return undefined
  }
}

/* Resposta de erro simples. */
export function erro(
  c: Context,
  status: 400 | 404 | 409,
  mensagem: string,
  campos?: Record<string, string>,
) {
  const corpo: ErroApi = campos ? { erro: mensagem, campos } : { erro: mensagem }
  return c.json(corpo, status)
}

/* Diz se o texto é um UUID (evita erro do Postgres com id malformado). */
export function ehUuid(texto: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(texto)
}
/* Fim das respostas. */
