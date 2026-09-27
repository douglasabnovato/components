/*
 * Esquema relacional da API em Drizzle: tabelas de clientes e de tarefas.
 * O SQL de criação fica em migracao.ts, escrito à mão para ser lido em aula.
 */
import { boolean, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const clientes = pgTable('clientes', {
  id: uuid('id').primaryKey().defaultRandom(),
  nome: text('nome').notNull(),
  email: text('email').notNull().unique(),
  idade: integer('idade').notNull(),
  criadoEm: timestamp('criado_em', { withTimezone: true }).notNull().defaultNow(),
})

export const tarefas = pgTable('tarefas', {
  id: uuid('id').primaryKey().defaultRandom(),
  descricao: text('descricao').notNull(),
  concluida: boolean('concluida').notNull().default(false),
  criadaEm: timestamp('criada_em', { withTimezone: true }).notNull().defaultNow(),
})
/* Fim do esquema. */
