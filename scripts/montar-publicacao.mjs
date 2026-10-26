/*
 * Monta a pasta publicar/ depois do pnpm build: o hub na raiz e cada filho
 * estático na sua pasta, exatamente como o site é publicado. O Formulários
 * (SSR) fica de fora: quem o entrega é o apps/servidor.
 * Uso: pnpm build && node scripts/montar-publicacao.mjs
 * As pastas seguem o mapa do ecossistema (packages/ui/src/utilitarios/ecossistema.ts).
 */
import { cpSync, existsSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const raiz = fileURLToPath(new URL('..', import.meta.url))
const destino = join(raiz, 'publicar')

const partes = [
  { origem: 'apps/hub/dist', pasta: '' },
  { origem: '1-flix/dist', pasta: 'flix' },
  ...['cadastro', 'herois', 'tarefas', 'pelada', 'laboratorio', 'trilha'].map((slug) => ({
    origem: `apps/${slug}/dist`,
    pasta: slug,
  })),
]

const faltando = partes.filter(({ origem }) => !existsSync(join(raiz, origem, 'index.html')))
if (faltando.length > 0) {
  console.error('Build não encontrado em:')
  for (const { origem } of faltando) console.error(`  - ${origem}`)
  console.error('Rode pnpm build antes de montar a publicação.')
  process.exit(1)
}

rmSync(destino, { recursive: true, force: true })
for (const { origem, pasta } of partes) {
  cpSync(join(raiz, origem), join(destino, pasta), { recursive: true })
  console.log(`${origem.padEnd(22)} → publicar/${pasta}`)
}
console.log(`Pasta publicar/ pronta com o hub e ${partes.length - 1} filhos.`)
/* Fim da montagem. */
