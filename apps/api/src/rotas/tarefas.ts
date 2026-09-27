/*
 * Rotas /tarefas (filho 5 · Tarefas): listar com busca por expressão regular
 * e situação, criar, alterar, excluir só concluídas (409 se estiver pendente)
 * e limpar todas as concluídas de uma vez.
 */
import {
  esquemaAlteracaoTarefa,
  esquemaConsultaTarefas,
  esquemaNovaTarefa,
  validarPadrao,
  type Tarefa,
} from '@components/contratos'
import { and, desc, eq, sql, type SQL } from 'drizzle-orm'
import { Hono } from 'hono'
import type { Banco } from '../banco/conexao'
import { tarefas } from '../banco/esquema'
import { ehUuid, erro, lerJson, validar } from './respostas'

/* Converte a linha do banco no formato do contrato. */
function paraTarefa(linha: typeof tarefas.$inferSelect): Tarefa {
  return {
    id: linha.id,
    descricao: linha.descricao,
    concluida: linha.concluida,
    criadaEm: linha.criadaEm.toISOString(),
  }
}

/* Cria o roteador de tarefas sobre o banco informado. */
export function rotasTarefas(banco: Banco) {
  const app = new Hono()

  app.get('/', async (c) => {
    const consulta = validar(c, esquemaConsultaTarefas, c.req.query())
    if (!consulta.ok) return consulta.resposta
    const { busca, situacao = 'todas' } = consulta.dados
    const filtros: SQL[] = []
    if (busca) {
      const problema = validarPadrao(busca)
      if (problema) return erro(c, 400, problema, { busca: problema })
      filtros.push(sql`${tarefas.descricao} ~* ${busca}`)
    }
    if (situacao === 'pendentes') filtros.push(eq(tarefas.concluida, false))
    if (situacao === 'concluidas') filtros.push(eq(tarefas.concluida, true))
    try {
      const linhas = await banco
        .select()
        .from(tarefas)
        .where(filtros.length ? and(...filtros) : undefined)
        .orderBy(desc(tarefas.criadaEm))
      return c.json(linhas.map(paraTarefa))
    } catch {
      return erro(c, 400, 'Expressão regular inválida.', { busca: 'Expressão regular inválida.' })
    }
  })

  app.post('/', async (c) => {
    const dados = validar(c, esquemaNovaTarefa, await lerJson(c))
    if (!dados.ok) return dados.resposta
    const [linha] = await banco.insert(tarefas).values(dados.dados).returning()
    return c.json(paraTarefa(linha!), 201)
  })

  app.delete('/concluidas', async (c) => {
    const removidas = await banco.delete(tarefas).where(eq(tarefas.concluida, true)).returning()
    return c.json({ removidas: removidas.length })
  })

  app.patch('/:id', async (c) => {
    const id = c.req.param('id')
    if (!ehUuid(id)) return erro(c, 404, 'Tarefa não encontrada.')
    const dados = validar(c, esquemaAlteracaoTarefa, await lerJson(c))
    if (!dados.ok) return dados.resposta
    const [linha] = await banco
      .update(tarefas)
      .set(dados.dados)
      .where(eq(tarefas.id, id))
      .returning()
    return linha ? c.json(paraTarefa(linha)) : erro(c, 404, 'Tarefa não encontrada.')
  })

  app.delete('/:id', async (c) => {
    const id = c.req.param('id')
    if (!ehUuid(id)) return erro(c, 404, 'Tarefa não encontrada.')
    const [atual] = await banco.select().from(tarefas).where(eq(tarefas.id, id))
    if (!atual) return erro(c, 404, 'Tarefa não encontrada.')
    if (!atual.concluida) return erro(c, 409, 'Só dá para excluir tarefas concluídas.')
    await banco.delete(tarefas).where(eq(tarefas.id, id))
    return c.body(null, 204)
  })

  return app
}
/* Fim das rotas de tarefas. */
