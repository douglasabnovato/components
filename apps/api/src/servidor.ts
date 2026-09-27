/*
 * Servidor da API em Node: abre o banco na pasta .dados e escuta na porta
 * 3333. Em produção, o proxy do site encaminha /api para cá.
 */
import { serve } from '@hono/node-server'
import { criarApp } from './app'
import { abrirBanco } from './banco/conexao'
import { ORIGENS, PASTA_DADOS, PORTA } from './config'

const { banco } = await abrirBanco({ pasta: PASTA_DADOS })
const app = criarApp(banco, ORIGENS)

serve({ fetch: app.fetch, port: PORTA }, ({ port }) => {
  console.log(`API do components em http://localhost:${port} (banco em ${PASTA_DADOS})`)
})
/* Fim do servidor. */
