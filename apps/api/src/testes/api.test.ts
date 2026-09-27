/*
 * Testes da API com banco PGlite em memória, chamando app.request como o
 * navegador chamaria o fetch: CRUD de clientes, e-mail único, regex das
 * tarefas e a regra de só excluir tarefas concluídas. O banco abre uma vez
 * e volta ao estado inicial antes de cada teste.
 */
import type { Cliente, Tarefa } from '@components/contratos'
import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { abrirBanco, criarApp, reiniciarBanco, type AppApi } from '../app'

let app: AppApi
let cliente: Awaited<ReturnType<typeof abrirBanco>>['cliente']

/* Faz uma requisição JSON e devolve status e corpo. */
async function pedir(metodo: string, caminho: string, corpo?: unknown) {
  const resposta = await app.request(caminho, {
    method: metodo,
    headers: corpo ? { 'Content-Type': 'application/json' } : undefined,
    body: corpo ? JSON.stringify(corpo) : undefined,
  })
  const texto = await resposta.text()
  return { status: resposta.status, corpo: texto ? JSON.parse(texto) : null }
}

beforeAll(async () => {
  const aberto = await abrirBanco()
  app = criarApp(aberto.banco)
  cliente = aberto.cliente
})

beforeEach(() => reiniciarBanco(cliente))

describe('clientes', () => {
  it('lista os exemplos em ordem de nome e filtra pela busca', async () => {
    const { corpo } = await pedir('GET', '/clientes')
    expect((corpo as Cliente[]).map((c) => c.nome)).toEqual([
      'Ana Ribeiro',
      'Bruno Costa',
      'Carla Souza',
      'Diego Lima',
    ])
    const busca = await pedir('GET', '/clientes?busca=SOUZA')
    expect((busca.corpo as Cliente[]).map((c) => c.nome)).toEqual(['Carla Souza'])
    const idade = await pedir('GET', '/clientes?ordem=idade')
    expect((idade.corpo as Cliente[])[0]?.nome).toBe('Bruno Costa')
  })

  it('cria, lê, atualiza e exclui', async () => {
    const criado = await pedir('POST', '/clientes', {
      nome: 'Elisa Prado',
      email: 'ELISA@exemplo.com',
      idade: 29,
    })
    expect(criado.status).toBe(201)
    expect(criado.corpo).toMatchObject({
      nome: 'Elisa Prado',
      email: 'elisa@exemplo.com',
      idade: 29,
    })
    const id = (criado.corpo as Cliente).id

    expect((await pedir('GET', `/clientes/${id}`)).corpo.nome).toBe('Elisa Prado')
    const alterado = await pedir('PUT', `/clientes/${id}`, {
      nome: 'Elisa P.',
      email: 'elisa@exemplo.com',
      idade: 30,
    })
    expect(alterado.corpo).toMatchObject({ nome: 'Elisa P.', idade: 30 })

    expect((await pedir('DELETE', `/clientes/${id}`)).status).toBe(204)
    expect((await pedir('GET', `/clientes/${id}`)).status).toBe(404)
  })

  it('recusa dados inválidos com a mensagem de cada campo', async () => {
    const r = await pedir('POST', '/clientes', { nome: 'Al', email: 'x', idade: 300 })
    expect(r.status).toBe(400)
    expect(r.corpo.campos).toEqual({
      nome: 'Informe um nome com pelo menos 3 letras.',
      email: 'Informe um e-mail válido.',
      idade: 'Informe uma idade entre 0 e 130.',
    })
    expect((await pedir('POST', '/clientes')).status).toBe(400)
  })

  it('não deixa repetir e-mail, nem ao criar nem ao alterar', async () => {
    const r = await pedir('POST', '/clientes', {
      nome: 'Outra Ana',
      email: 'ana.ribeiro@exemplo.com',
      idade: 20,
    })
    expect(r.status).toBe(409)
    expect(r.corpo.campos.email).toBe('Este e-mail já está cadastrado.')
    const lista = (await pedir('GET', '/clientes')).corpo as Cliente[]
    const bruno = lista.find((c) => c.nome === 'Bruno Costa')!
    const troca = await pedir('PUT', `/clientes/${bruno.id}`, {
      ...bruno,
      email: 'ana.ribeiro@exemplo.com',
    })
    expect(troca.status).toBe(409)
    const mesmo = await pedir('PUT', `/clientes/${bruno.id}`, {
      nome: bruno.nome,
      email: bruno.email,
      idade: 28,
    })
    expect(mesmo.status).toBe(200)
  })

  it('responde 404 para id inexistente ou malformado', async () => {
    expect((await pedir('GET', '/clientes/nao-e-uuid')).status).toBe(404)
    expect((await pedir('DELETE', '/clientes/00000000-0000-0000-0000-000000000000')).status).toBe(
      404,
    )
  })
})

describe('tarefas', () => {
  it('lista das mais recentes para as mais antigas e filtra por situação', async () => {
    const todas = (await pedir('GET', '/tarefas')).corpo as Tarefa[]
    expect(todas).toHaveLength(5)
    expect(todas[0]?.descricao).toBe('Preparar a aula de expressões regulares')
    const pendentes = (await pedir('GET', '/tarefas?situacao=pendentes')).corpo as Tarefa[]
    expect(pendentes.every((t) => !t.concluida)).toBe(true)
  })

  it('busca por expressão regular sem diferenciar maiúsculas e recusa padrão inválido', async () => {
    const r = (await pedir('GET', `/tarefas?busca=${encodeURIComponent('^(comprar|estudar)')}`))
      .corpo as Tarefa[]
    expect(r.map((t) => t.descricao).sort()).toEqual([
      'Comprar pão e café para a reunião',
      'Estudar RTK Query: tags e invalidação',
    ])
    const invalida = await pedir('GET', `/tarefas?busca=${encodeURIComponent('(')}`)
    expect(invalida.status).toBe(400)
    expect(invalida.corpo.erro).toBe('Expressão regular inválida.')
  })

  it('cria, conclui e só exclui tarefa concluída', async () => {
    const criada = await pedir('POST', '/tarefas', { descricao: '  Nova tarefa  ' })
    expect(criada.status).toBe(201)
    const id = (criada.corpo as Tarefa).id
    expect(criada.corpo.descricao).toBe('Nova tarefa')

    const bloqueada = await pedir('DELETE', `/tarefas/${id}`)
    expect(bloqueada.status).toBe(409)
    expect(bloqueada.corpo.erro).toBe('Só dá para excluir tarefas concluídas.')

    expect((await pedir('PATCH', `/tarefas/${id}`, { concluida: true })).corpo.concluida).toBe(true)
    expect((await pedir('DELETE', `/tarefas/${id}`)).status).toBe(204)
    expect((await pedir('PATCH', `/tarefas/${id}`, { concluida: false })).status).toBe(404)
  })

  it('limpa todas as concluídas de uma vez', async () => {
    const r = await pedir('DELETE', '/tarefas/concluidas')
    expect(r.corpo).toEqual({ removidas: 2 })
    expect(((await pedir('GET', '/tarefas')).corpo as Tarefa[]).every((t) => !t.concluida)).toBe(
      true,
    )
  })
})

describe('geral', () => {
  it('responde saúde e 404 em JSON', async () => {
    expect((await pedir('GET', '/saude')).corpo).toEqual({ ok: true })
    expect((await pedir('GET', '/nada')).corpo).toEqual({ erro: 'Rota não encontrada.' })
  })
})
/* Fim dos testes da API. */
