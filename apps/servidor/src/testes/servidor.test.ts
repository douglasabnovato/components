/*
 * Testes da composição do servidor: API sob /api com banco em memória,
 * Formulários (arquivos do cliente e SSR simulado) e o modo ensaio com uma
 * pasta publicar/ temporária, conferindo as mesmas regras do vercel.json.
 */
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { abrirBanco, criarApp, type AppApi } from '@components/api'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { criarServidor } from '../app'

let api: AppApi
let pasta: string

/* Cria um arquivo, com as pastas necessárias. */
function escrever(caminho: string, conteudo: string) {
  mkdirSync(dirname(caminho), { recursive: true })
  writeFileSync(caminho, conteudo)
}

beforeAll(async () => {
  const { banco } = await abrirBanco()
  api = criarApp(banco)
  pasta = mkdtempSync(join(tmpdir(), 'servidor-'))
  escrever(join(pasta, 'cliente', 'assets', 'app.js'), 'console.log("formularios")')
  escrever(join(pasta, 'publicar', 'index.html'), '<p>hub</p>')
  escrever(join(pasta, 'publicar', 'flix', 'index.html'), '<p>flix</p>')
  escrever(join(pasta, 'publicar', 'flix', 'assets', 'flix.js'), 'console.log("flix")')
})

afterAll(() => {
  rmSync(pasta, { recursive: true, force: true })
})

/* Servidor completo, como no ensaio de produção. */
function servidorDeEnsaio() {
  return criarServidor({
    api,
    formularios: {
      tratar: async (requisicao) => new Response(`ssr ${new URL(requisicao.url).pathname}`),
      pastaCliente: join(pasta, 'cliente'),
    },
    pastaPublicar: join(pasta, 'publicar'),
  })
}

describe('API em /api', () => {
  it('responde a saúde', async () => {
    const resposta = await criarServidor({ api }).request('/api/saude')
    expect(resposta.status).toBe(200)
    expect(await resposta.json()).toEqual({ ok: true })
  })

  it('lista tarefas pelo prefixo', async () => {
    const resposta = await criarServidor({ api }).request('/api/tarefas')
    expect(resposta.status).toBe(200)
  })

  it('devolve 404 em JSON para rota inexistente', async () => {
    const resposta = await criarServidor({ api }).request('/api/nada')
    expect(resposta.status).toBe(404)
    expect(await resposta.json()).toHaveProperty('erro')
  })
})

describe('Formulários em /formularios/', () => {
  it('entrega os arquivos do cliente', async () => {
    const resposta = await servidorDeEnsaio().request('/formularios/assets/app.js')
    expect(await resposta.text()).toContain('formularios')
  })

  it('passa as páginas ao SSR', async () => {
    const resposta = await servidorDeEnsaio().request('/formularios/contato')
    expect(await resposta.text()).toBe('ssr /formularios/contato')
  })

  it('avisa quando o build não existe', async () => {
    const resposta = await criarServidor({ api }).request('/formularios/')
    expect(resposta.status).toBe(503)
  })
})

describe('ensaio de produção', () => {
  it('entrega o hub na raiz', async () => {
    expect(await (await servidorDeEnsaio().request('/')).text()).toContain('hub')
  })

  it('entrega o filho na pasta e os arquivos dele', async () => {
    const app = servidorDeEnsaio()
    expect(await (await app.request('/flix/')).text()).toContain('flix')
    expect(await (await app.request('/flix/assets/flix.js')).text()).toContain('console.log')
  })

  it('carrega o app do filho em rota interna', async () => {
    const resposta = await servidorDeEnsaio().request('/flix/assistir/1')
    expect(resposta.status).toBe(200)
    expect(await resposta.text()).toContain('flix')
  })

  it('devolve 404 para pasta inexistente', async () => {
    const resposta = await servidorDeEnsaio().request('/inexistente')
    expect(resposta.status).toBe(404)
  })

  it('fica desligado fora do ensaio', async () => {
    const resposta = await criarServidor({ api }).request('/')
    expect(resposta.status).toBe(404)
  })
})
/* Fim dos testes do servidor. */
