/*
 * Aplicação Hono da API compartilhada: CORS para os filhos, saúde e as rotas
 * de clientes e tarefas. Recebe o banco pronto, o que permite testar com um
 * banco em memória e usar app.request como se fosse o fetch do navegador.
 */
import { sql } from 'drizzle-orm'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import type { Banco } from './banco/conexao'
import { rotasClientes } from './rotas/clientes'
import { rotasTarefas } from './rotas/tarefas'

/* Monta a aplicação com as origens liberadas. */
export function criarApp(banco: Banco, origens: string[] = ['*']) {
  const app = new Hono()
  app.use('*', cors({ origin: origens.includes('*') ? '*' : origens }))
  /* Saúde que toca o banco: um /saude que não consulta o banco não prova a conexão. */
  app.get('/saude', async (c) => {
    try {
      await banco.execute(sql`select 1`)
      return c.json({ ok: true, banco: 'ok' })
    } catch (falha) {
      console.error('Saúde: o banco não respondeu.', falha)
      return c.json({ ok: false, banco: 'fora' }, 503)
    }
  })
  app.route('/clientes', rotasClientes(banco))
  app.route('/tarefas', rotasTarefas(banco))
  app.notFound((c) => c.json({ erro: 'Rota não encontrada.' }, 404))
  app.onError((falha, c) => {
    console.error(falha)
    return c.json({ erro: 'Erro interno da API.' }, 500)
  })
  return app
}

export type AppApi = ReturnType<typeof criarApp>
export { abrirBanco, reiniciarBanco } from './banco/conexao'
/* Fim da aplicação. */
