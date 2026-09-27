# API compartilhada

Serviço único do monorepo `components` para os filhos que precisam de servidor: **clientes** (02 · Cadastro) e **tarefas** (05 · Tarefas).

## Rodar

Na raiz do monorepo:

```bash
pnpm install
pnpm dev:api
```

A API sobe em http://localhost:3333. O banco fica na pasta `apps/api/.dados` (ignorada pelo Git) e é criado com dados de exemplo na primeira vez. Para começar do zero: `pnpm --filter @components/api banco:limpar`.

Os filhos chamam sempre `/api/...` no próprio endereço. Em desenvolvimento, o Vite de cada filho encaminha `/api` para a porta 3333 (`proxyDaApi` do `@components/ui`), então o navegador não precisa de CORS.

## Rotas

| Método | Rota                  | O que faz                                                                 |
| ------ | --------------------- | ------------------------------------------------------------------------- |
| GET    | `/saude`              | Responde `{ ok: true }`                                                   |
| GET    | `/clientes`           | Lista, com `?busca=` (nome ou e-mail) e `?ordem=nome\|idade\|recentes`    |
| GET    | `/clientes/:id`       | Um cliente                                                                |
| POST   | `/clientes`           | Cria (400 com erro por campo; 409 se o e-mail já existe)                  |
| PUT    | `/clientes/:id`       | Atualiza (mesmas regras)                                                  |
| DELETE | `/clientes/:id`       | Exclui (204)                                                              |
| GET    | `/tarefas`            | Lista das mais recentes, com `?busca=` (expressão regular) e `?situacao=` |
| POST   | `/tarefas`            | Cria                                                                      |
| PATCH  | `/tarefas/:id`        | Altera descrição e/ou conclusão                                           |
| DELETE | `/tarefas/:id`        | Exclui **só se estiver concluída** (409 se estiver pendente)              |
| DELETE | `/tarefas/concluidas` | Remove todas as concluídas e devolve `{ removidas }`                      |

Todo erro volta como `{ erro, campos? }`, o formato definido em `@components/contratos`.

## Decisões

- **Hono**: roteador pequeno, baseado em `Request`/`Response` da web. Nos testes, `app.request()` faz o papel do `fetch` do navegador, sem abrir porta.
- **PGlite + Drizzle**: Postgres de verdade em WebAssembly, sem instalar banco nem compilar nada no Windows. O Drizzle dá consultas tipadas; o SQL de criação fica escrito à mão em `banco/migracao.ts`, para ser lido em aula.
- **Contratos compartilhados**: as rotas validam com os mesmos esquemas Zod que os formulários do front usam (`@components/contratos`).

## Estrutura

```
src/
├── banco/    esquema (Drizzle), migração e exemplos, conexão, limpar
├── rotas/    clientes, tarefas e respostas padronizadas
├── app.ts    aplicação Hono (recebe o banco pronto)
├── servidor.ts  sobe o servidor Node na porta 3333
└── testes/   testes com banco em memória
```

## Stack

Node 22, TypeScript, Hono, Zod, Drizzle ORM, PGlite, tsx e Vitest.
