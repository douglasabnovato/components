/*
 * Composição do servidor de produção: só junta peças que já existem.
 * - /api: a aplicação Hono da API compartilhada, montada sob o prefixo.
 * - /formularios/: arquivos do build do cliente e, no resto, o SSR do React Router.
 * - Ensaio (opcional): a pasta publicar/ com o hub na raiz e os filhos nas
 *   pastas, imitando as regras do vercel.json (rota interna de filho carrega o
 *   index.html da pasta; caminho desconhecido na raiz dá 404).
 */
import { readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import type { AppApi } from '@components/api'
import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'

export type Formularios = {
  /* Trata a requisição com o SSR do React Router. */
  tratar: (requisicao: Request) => Promise<Response>
  /* Pasta build/client do Formulários. */
  pastaCliente: string
}

export type OpcoesServidor = {
  api: AppApi
  formularios?: Formularios
  pastaPublicar?: string
}

const SLUG = /^[a-z0-9-]+$/

/* Monta o servidor com as partes informadas. */
export function criarServidor({ api, formularios, pastaPublicar }: OpcoesServidor) {
  const app = new Hono()

  app.route('/api', api)
  app.all('/api/*', (c) => c.json({ erro: 'Rota não encontrada.' }, 404))

  if (formularios) {
    app.use(
      '/formularios/*',
      serveStatic({
        root: formularios.pastaCliente,
        rewriteRequestPath: (caminho) => caminho.replace(/^\/formularios/, ''),
      }),
    )
    app.all('/formularios', (c) => formularios.tratar(c.req.raw))
    app.all('/formularios/*', (c) => formularios.tratar(c.req.raw))
  } else {
    app.all('/formularios/*', (c) =>
      c.text('Formulários indisponível: rode pnpm --filter @components/formularios build.', 503),
    )
  }

  if (pastaPublicar) {
    app.use('*', serveStatic({ root: pastaPublicar }))
    app.get('*', async (c) => {
      const pasta = c.req.path.split('/')[1] ?? ''
      const indice = join(pastaPublicar, pasta, 'index.html')
      if (!SLUG.test(pasta) || !existsSync(indice)) return c.text('Página não encontrada.', 404)
      return c.html(await readFile(indice, 'utf8'))
    })
  }

  return app
}
/* Fim da composição do servidor. */
