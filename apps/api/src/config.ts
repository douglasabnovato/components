/*
 * Configuração da API: porta, pasta do banco e origens liberadas no CORS
 * (as portas de desenvolvimento dos filhos que consomem a API).
 */
import { fileURLToPath } from 'node:url'

export const PORTA = Number(process.env.PORTA ?? 3333)

export const PASTA_DADOS =
  process.env.PASTA_DADOS ?? fileURLToPath(new URL('../.dados', import.meta.url))

export const ORIGENS = (
  process.env.ORIGENS ??
  'http://localhost:5170,http://localhost:5172,http://localhost:5175,http://localhost:4172,http://localhost:4175'
)
  .split(',')
  .map((o) => o.trim())
/* Fim da configuração. */
