/*
 * Servidor de produção do components (Render): abre o banco da API, carrega o
 * build SSR do Formulários e escuta na porta do provedor (PORT, PORTA ou 3333).
 * Com --ensaio (ou SERVIR_ESTATICOS=1), entrega também a pasta publicar/,
 * reproduzindo no computador o site publicado num único endereço.
 * O banco abre no modo de memória reduzida e o log mostra a memória usada em
 * cada etapa, para acompanhar o limite de 512 MB do plano gratuito.
 */
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { abrirBanco, criarApp } from '@components/api'
import { ORIGENS, PASTA_DADOS, PORTA } from '@components/api/config'
import { serve } from '@hono/node-server'
import { createRequestHandler, type ServerBuild } from 'react-router'
import { criarServidor, type Formularios } from './app'

const RAIZ = fileURLToPath(new URL('../../../', import.meta.url))
const PASTA_FORMULARIOS = join(RAIZ, 'apps', 'formularios', 'build')
const PASTA_PUBLICAR = join(RAIZ, 'publicar')
const ENSAIO = process.argv.includes('--ensaio') || process.env.SERVIR_ESTATICOS === '1'

/* Escreve no log a memória do processo na etapa informada. */
function registrarMemoria(etapa: string) {
  const { rss, heapUsed } = process.memoryUsage()
  const mb = (bytes: number) => Math.round(bytes / 1024 / 1024)
  console.log(`[memória] ${etapa}: ${mb(rss)} MB no processo, ${mb(heapUsed)} MB de JavaScript`)
}

/* Carrega o build SSR do Formulários, se existir. */
async function carregarFormularios(): Promise<Formularios | undefined> {
  const arquivo = join(PASTA_FORMULARIOS, 'server', 'index.js')
  if (!existsSync(arquivo)) {
    console.warn(`Build do Formulários não encontrado em ${arquivo}.`)
    console.warn('/formularios/ fica indisponível até rodar o build do Formulários.')
    return undefined
  }
  const build = (await import(pathToFileURL(arquivo).href)) as ServerBuild
  const modo = process.env.NODE_ENV ?? 'production'
  return {
    tratar: createRequestHandler(build, modo),
    pastaCliente: join(PASTA_FORMULARIOS, 'client'),
  }
}

if (ENSAIO && !existsSync(join(PASTA_PUBLICAR, 'index.html'))) {
  console.error('Pasta publicar/ não encontrada. Rode antes:')
  console.error('  pnpm build && node scripts/montar-publicacao.mjs')
  process.exit(1)
}

registrarMemoria('início')
const bancoPronto = existsSync(join(PASTA_DADOS, 'PG_VERSION'))
console.log(bancoPronto ? 'Banco preparado no build: abrindo.' : 'Banco ausente: criando agora.')
const { banco, cliente } = await abrirBanco({ pasta: PASTA_DADOS, memoriaReduzida: true })
const { rows } = await cliente.query<{ shared_buffers: string }>('SHOW shared_buffers')
console.log(`Postgres com shared_buffers de ${rows[0]?.shared_buffers ?? '?'}`)
registrarMemoria('banco aberto')
const formularios = await carregarFormularios()
registrarMemoria('Formulários carregado')
const app = criarServidor({
  api: criarApp(banco, ORIGENS),
  formularios,
  pastaPublicar: ENSAIO ? PASTA_PUBLICAR : undefined,
})

serve({ fetch: app.fetch, port: PORTA }, ({ port }) => {
  const modo = ENSAIO ? 'ensaio de produção (site completo)' : 'produção (API e Formulários)'
  console.log(`Servidor do components em http://localhost:${port} · ${modo}`)
  console.log(`API em /api, Formulários em /formularios/, banco em ${PASTA_DADOS}`)
  registrarMemoria('porta aberta')
})
/* Fim do servidor. */
