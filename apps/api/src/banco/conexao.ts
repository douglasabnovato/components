/*
 * Conexão com o banco: PGlite (Postgres em WebAssembly, sem instalar nada)
 * embrulhado pelo Drizzle. Sem pasta, o banco vive só na memória (testes),
 * e reiniciarBanco devolve esse banco ao estado inicial sem abrir outro.
 * Com memoriaReduzida, o Postgres usa áreas de trabalho pequenas, para caber
 * em instâncias de 512 MB (servidor de produção).
 */
import { PGlite, type PGliteOptions } from '@electric-sql/pglite'
import { drizzle } from 'drizzle-orm/pglite'
import * as esquema from './esquema'
import { migrar } from './migracao'

export type Banco = ReturnType<typeof drizzle<typeof esquema>>

export type OpcoesBanco = {
  pasta?: string
  comExemplos?: boolean
  memoriaReduzida?: boolean
}

/* Memória inicial do WebAssembly no modo econômico (o padrão do PGlite é 128 MB). */
const MEMORIA_INICIAL_ECONOMICA = 64 * 1024 * 1024

/* Áreas de memória do Postgres no modo econômico, suficientes para os dados de exemplo. */
const PARAMETROS_ECONOMICOS = [
  '-c',
  'shared_buffers=16MB',
  '-c',
  'work_mem=2MB',
  '-c',
  'maintenance_work_mem=8MB',
  '-c',
  'temp_buffers=2MB',
]

/* Opções do PGlite conforme o modo de memória. */
function opcoesDoPglite(memoriaReduzida: boolean): PGliteOptions {
  if (!memoriaReduzida) return {}
  return {
    initialMemory: MEMORIA_INICIAL_ECONOMICA,
    startParams: [...PGlite.defaultStartParams, ...PARAMETROS_ECONOMICOS],
  }
}

/* Abre o banco, aplica a migração e devolve o Drizzle e o cliente bruto. */
export async function abrirBanco(opcoes: OpcoesBanco = {}) {
  const cliente = new PGlite(opcoes.pasta, opcoesDoPglite(opcoes.memoriaReduzida ?? false))
  await migrar(cliente, opcoes.comExemplos ?? true)
  const banco = drizzle({ client: cliente, schema: esquema })
  return { banco, cliente }
}
/* Apaga os dados e recria os exemplos no banco já aberto, para reaproveitá-lo entre testes. */
export async function reiniciarBanco(cliente: PGlite) {
  await cliente.exec('TRUNCATE clientes, tarefas')
  await migrar(cliente, true)
}
/* Fim da conexão. */
