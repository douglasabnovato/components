/*
 * Rotas /clientes (filho 2 · Cadastro): CRUD completo com busca, ordenação,
 * validação pelos contratos e e-mail único (409 em caso de conflito).
 */
import { esquemaConsultaClientes, esquemaDadosCliente, type Cliente } from '@components/contratos'
import { and, asc, desc, eq, ilike, ne, or } from 'drizzle-orm'
import { Hono } from 'hono'
import type { Banco } from '../banco/conexao'
import { clientes } from '../banco/esquema'
import { ehUuid, erro, lerJson, validar } from './respostas'

const CONFLITO_EMAIL = { email: 'Este e-mail já está cadastrado.' }

/* Converte a linha do banco no formato do contrato. */
function paraCliente(linha: typeof clientes.$inferSelect): Cliente {
  return {
    id: linha.id,
    nome: linha.nome,
    email: linha.email,
    idade: linha.idade,
    criadoEm: linha.criadoEm.toISOString(),
  }
}

/* Cria o roteador de clientes sobre o banco informado. */
export function rotasClientes(banco: Banco) {
  const app = new Hono()

  /* Diz se o e-mail já pertence a outro cliente. */
  async function emailEmUso(email: string, ignorarId?: string) {
    const filtro = ignorarId
      ? and(eq(clientes.email, email), ne(clientes.id, ignorarId))
      : eq(clientes.email, email)
    const achados = await banco.select({ id: clientes.id }).from(clientes).where(filtro).limit(1)
    return achados.length > 0
  }

  app.get('/', async (c) => {
    const consulta = validar(c, esquemaConsultaClientes, c.req.query())
    if (!consulta.ok) return consulta.resposta
    const { busca, ordem = 'nome' } = consulta.dados
    const termo = busca ? `%${busca}%` : undefined
    const ordenacao = {
      nome: asc(clientes.nome),
      idade: asc(clientes.idade),
      recentes: desc(clientes.criadoEm),
    }[ordem]
    const linhas = await banco
      .select()
      .from(clientes)
      .where(termo ? or(ilike(clientes.nome, termo), ilike(clientes.email, termo)) : undefined)
      .orderBy(ordenacao, asc(clientes.nome))
    return c.json(linhas.map(paraCliente))
  })

  app.get('/:id', async (c) => {
    const id = c.req.param('id')
    if (!ehUuid(id)) return erro(c, 404, 'Cliente não encontrado.')
    const [linha] = await banco.select().from(clientes).where(eq(clientes.id, id))
    return linha ? c.json(paraCliente(linha)) : erro(c, 404, 'Cliente não encontrado.')
  })

  app.post('/', async (c) => {
    const dados = validar(c, esquemaDadosCliente, await lerJson(c))
    if (!dados.ok) return dados.resposta
    if (await emailEmUso(dados.dados.email)) return erro(c, 409, 'E-mail em uso.', CONFLITO_EMAIL)
    const [linha] = await banco.insert(clientes).values(dados.dados).returning()
    return c.json(paraCliente(linha!), 201)
  })

  app.put('/:id', async (c) => {
    const id = c.req.param('id')
    if (!ehUuid(id)) return erro(c, 404, 'Cliente não encontrado.')
    const dados = validar(c, esquemaDadosCliente, await lerJson(c))
    if (!dados.ok) return dados.resposta
    if (await emailEmUso(dados.dados.email, id))
      return erro(c, 409, 'E-mail em uso.', CONFLITO_EMAIL)
    const [linha] = await banco
      .update(clientes)
      .set(dados.dados)
      .where(eq(clientes.id, id))
      .returning()
    return linha ? c.json(paraCliente(linha)) : erro(c, 404, 'Cliente não encontrado.')
  })

  app.delete('/:id', async (c) => {
    const id = c.req.param('id')
    if (!ehUuid(id)) return erro(c, 404, 'Cliente não encontrado.')
    const [linha] = await banco.delete(clientes).where(eq(clientes.id, id)).returning()
    return linha ? c.body(null, 204) : erro(c, 404, 'Cliente não encontrado.')
  })

  return app
}
/* Fim das rotas de clientes. */
