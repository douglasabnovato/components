/*
 * Conexão com o banco: PGlite (Postgres em WebAssembly, sem instalar nada)
 * embrulhado pelo Drizzle. Sem pasta, o banco vive só na memória (testes),
 * e reiniciarBanco devolve esse banco ao estado inicial sem abrir outro.
 */
import { PGlite } from '@electric-sql/pglite'
import { drizzle } from 'drizzle-orm/pglite'
import * as esquema from './esquema'
import { migrar } from './migracao'

export type Banco = ReturnType<typeof drizzle<typeof esquema>>

/* Abre o banco, aplica a migração e devolve o Drizzle e o cliente bruto. */
export async function abrirBanco(opcoes: { pasta?: string; comExemplos?: boolean } = {}) {
  const cliente = new PGlite(opcoes.pasta)
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