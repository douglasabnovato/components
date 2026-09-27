/*
 * Migração inicial e dados de exemplo. Roda ao abrir o banco: cria as tabelas
 * se não existirem e preenche só quando estão vazias.
 */
import type { PGlite } from '@electric-sql/pglite'

export const SQL_CRIACAO = `
CREATE TABLE IF NOT EXISTS clientes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  email text NOT NULL UNIQUE,
  idade integer NOT NULL CHECK (idade BETWEEN 0 AND 130),
  criado_em timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tarefas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  descricao text NOT NULL,
  concluida boolean NOT NULL DEFAULT false,
  criada_em timestamptz NOT NULL DEFAULT now()
);
`

const clientesIniciais = [
  ['Ana Ribeiro', 'ana.ribeiro@exemplo.com', 34],
  ['Bruno Costa', 'bruno.costa@exemplo.com', 27],
  ['Carla Souza', 'carla.souza@exemplo.com', 45],
  ['Diego Lima', 'diego.lima@exemplo.com', 31],
] as const

const tarefasIniciais = [
  ['Revisar o contrato de clientes no pacote contratos', true],
  ['Escrever o teste de contrato do repositório HTTP', true],
  ['Comprar pão e café para a reunião', false],
  ['Estudar RTK Query: tags e invalidação', false],
  ['Preparar a aula de expressões regulares', false],
] as const

/* Cria as tabelas e, se estiverem vazias, insere os exemplos. */
export async function migrar(cliente: PGlite, comExemplos = true) {
  await cliente.exec(SQL_CRIACAO)
  if (!comExemplos) return
  const { rows } = await cliente.query<{ total: number }>(
    'SELECT count(*)::int AS total FROM clientes',
  )
  if ((rows[0]?.total ?? 0) === 0) {
    for (const [i, [nome, email, idade]] of clientesIniciais.entries()) {
      await cliente.query(
        `INSERT INTO clientes (nome, email, idade, criado_em) VALUES ($1, $2, $3, now() - make_interval(mins => $4))`,
        [nome, email, idade, clientesIniciais.length - i],
      )
    }
  }
  const tarefas = await cliente.query<{ total: number }>(
    'SELECT count(*)::int AS total FROM tarefas',
  )
  if ((tarefas.rows[0]?.total ?? 0) === 0) {
    for (const [i, [descricao, concluida]] of tarefasIniciais.entries()) {
      await cliente.query(
        `INSERT INTO tarefas (descricao, concluida, criada_em) VALUES ($1, $2, now() - make_interval(mins => $3))`,
        [descricao, concluida, tarefasIniciais.length - i],
      )
    }
  }
}
/* Fim da migração. */
