/*
 * Testes do lado do servidor: regras do contato, action (400 com erros por
 * campo, 302 para a confirmação, armadilha de robô) e loaders.
 */
import { beforeEach, describe, expect, it } from 'vitest'
import { validarContato } from '../app/dominio/contato'
import { esvaziarCaixa, listarMensagens } from '../app/dominio/mensagens.server'
import { action as acaoContato } from '../app/routes/contato'
import { loader as carregarEnviado } from '../app/routes/enviado'
import { action as acaoMensagens } from '../app/routes/mensagens'

/* Monta um FormData a partir de um objeto. */
function formulario(campos: Record<string, string>) {
  const f = new FormData()
  for (const [k, v] of Object.entries(campos)) f.set(k, v)
  return f
}

/* Chama uma action como o servidor chamaria, com um POST. */
function postar(
  acao: (args: never) => unknown,
  campos: Record<string, string>,
  caminho = '/contato',
) {
  const request = new Request(`http://localhost${caminho}`, {
    method: 'POST',
    body: formulario(campos),
  })
  return acao({ request, params: {}, context: {} } as never) as Promise<unknown>
}

const valido = {
  nome: 'Ana Lima',
  email: ' ANA@Exemplo.com ',
  assunto: 'duvida',
  mensagem: 'Quero saber mais sobre o projeto.',
  resposta: 'sim',
}

beforeEach(() => esvaziarCaixa())

describe('regras do contato', () => {
  it('normaliza os dados válidos', () => {
    const r = validarContato(formulario(valido))
    expect(r).toMatchObject({
      ok: true,
      robo: false,
      dados: { email: 'ana@exemplo.com', resposta: true },
    })
  })

  it('devolve um erro por campo e os valores digitados', () => {
    const r = validarContato(
      formulario({ nome: 'Al', email: 'x', assunto: 'outro', mensagem: 'curta' }),
    )
    if (r.ok) throw new Error('deveria falhar')
    expect(Object.keys(r.erros)).toEqual(['nome', 'email', 'assunto', 'mensagem'])
    expect(r.valores.nome).toBe('Al')
  })
})

describe('action do contato', () => {
  it('responde 400 com os erros quando inválido', async () => {
    const r = (await postar(acaoContato, { nome: '' })) as {
      init: { status: number }
      data: { erros: object }
    }
    expect(r.init.status).toBe(400)
    expect(r.data.erros).toHaveProperty('nome')
    expect(listarMensagens()).toHaveLength(0)
  })

  it('guarda e redireciona para a confirmação (post, redirect, get)', async () => {
    const r = (await postar(acaoContato, valido)) as Response
    expect(r.status).toBe(302)
    expect(r.headers.get('Location')).toBe('/contato/enviado?protocolo=MSG-0001')
    expect(listarMensagens()[0]).toMatchObject({ protocolo: 'MSG-0001', nome: 'Ana Lima' })
  })

  it('finge sucesso para robôs, sem guardar nada', async () => {
    const r = (await postar(acaoContato, { ...valido, site: 'http://spam' })) as Response
    expect(r.headers.get('Location')).toBe('/contato/enviado?protocolo=MSG-0000')
    expect(listarMensagens()).toHaveLength(0)
  })
})

describe('loaders e mensagens', () => {
  it('a confirmação encontra a mensagem e dá 404 para protocolo desconhecido', async () => {
    await postar(acaoContato, valido)
    const pedir = (q: string) =>
      carregarEnviado({
        request: new Request(`http://localhost/contato/enviado?${q}`),
        params: {},
        context: {},
      } as never)
    expect(pedir('protocolo=MSG-0001').mensagem?.nome).toBe('Ana Lima')
    let status = 0
    try {
      pedir('protocolo=MSG-9999')
    } catch (erro) {
      status = (erro as { init: { status: number } }).init.status
    }
    expect(status).toBe(404)
  })

  it('esvazia a caixa', async () => {
    await postar(acaoContato, valido)
    await postar(acaoMensagens, { intencao: 'esvaziar' }, '/mensagens')
    expect(listarMensagens()).toHaveLength(0)
  })
})
/* Fim dos testes do servidor. */
