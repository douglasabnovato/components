/*
 * Conexão com o banco: PGlite (Postgres em WebAssembly, sem instalar nada)
 * embrulhado pelo Drizzle. Sem pasta, o banco vive só na memória (testes),
 * e reiniciarBanco devolve esse banco ao estado inicial sem abrir outro.
 * Com memoriaReduzida, o Postgres passa a usar áreas de memória pequenas, para
 * caber em instâncias de 512 MB (servidor de produção).
 */
import { PGlite } from '@electric-sql/pglite'
import { drizzle } from 'drizzle-orm/pglite'
import * as esquema from './esquema'
import { migrar } from './migracao'

export type Banco = ReturnType<typeof drizzle<typeof esquema>>

export type OpcoesBanco = {
  pasta?: string
  comExemplos?: boolean
  memoriaReduzida?: boolean
}

/*
 * Áreas de memória do Postgres no modo econômico, suficientes para os dados de
 * exemplo. O PGlite ignora parâmetros -c na partida, então elas são gravadas
 * com ALTER SYSTEM (postgresql.auto.conf) e valem a partir da próxima abertura
 * do mesmo banco: o build prepara e fecha o banco, e o servidor já abre com elas.
 * A memória inicial do WebAssembly (128 MB) é fixa no pglite.wasm.
 */
const PARAMETROS_ECONOMICOS: Record<string, string> = {
  shared_buffers: '16MB',
  work_mem: '2MB',
  maintenance_work_mem: '8MB',
  temp_buffers: '2MB',
}

/* Grava os parâmetros econômicos no banco, para valerem na próxima abertura. */
async function gravarParametrosEconomicos(cliente: PGlite) {
  for (const [nome, valor] of Object.entries(PARAMETROS_ECONOMICOS)) {
    await cliente.exec(`ALTER SYSTEM SET ${nome} = '${valor}'`)
  }
}

/* Abre o banco, aplica a migração e devolve o Drizzle e o cliente bruto. */
export async function abrirBanco(opcoes: OpcoesBanco = {}) {
  const cliente = new PGlite(opcoes.pasta)
  await migrar(cliente, opcoes.comExemplos ?? true)
  if (opcoes.memoriaReduzida) await gravarParametrosEconomicos(cliente)
  const banco = drizzle({ client: cliente, schema: esquema })
  return { banco, cliente }
}
/* Apaga os dados e recria os exemplos no banco já aberto, para reaproveitá-lo entre testes. */
export async function reiniciarBanco(cliente: PGlite) {
  await cliente.exec('TRUNCATE clientes, tarefas')
  await migrar(cliente, true)
}
/* Fim da conexão. */
