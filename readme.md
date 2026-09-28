# Components

Monorepo React com um hub (projeto 0) e **8 projetos filhos**: sete ideias antigas reconstruídas do zero com React moderno e uma trilha de estudo com 116 vídeos. Cada filho aparece numa seção do hub com uma demonstração ao vivo feita com os dados e as regras reais dele, e tem um botão para voltar ao hub.

## Projetos

| #   | Projeto                 | O que faz                                                        | Destaque técnico                     |
| --- | ----------------------- | ---------------------------------------------------------------- | ------------------------------------ |
| 0   | Hub                     | Apresenta os filhos com demos ao vivo                            | React 19, MDX                        |
| 1   | Flix                    | Catálogo de vídeos                                               | TanStack Query                       |
| 2   | Cadastro                | CRUD de clientes com repositório trocável (memória ou API)       | TanStack Query, React Hook Form, Zod |
| 3   | Portal de Heróis        | Universo original com equipes, fichas e comparação               | Tailwind v4, Motion                  |
| 4   | Formulários no Servidor | Formulários que funcionam sem JavaScript                         | React Router em modo framework (SSR) |
| 5   | Tarefas                 | Atalhos de teclado, busca por regex e conclusão otimista         | Redux Toolkit, RTK Query             |
| 6   | Lista da Pelada         | Vagas, lista de espera e sorteio equilibrado de times            | Hooks puros, reducer                 |
| 7   | Laboratório             | 17 lições em MDX com demo, código e teste                        | MDX, React 19                        |
| 8   | Trilha React            | 116 aprendizados em 12 módulos e o mapa da stack                 | URL state, useSyncExternalStore      |
| —   | API                     | Clientes (02) e tarefas (05)                                     | Hono, Drizzle, PGlite                |

## Rodar

Requisitos: Node 22.12 ou mais novo e pnpm 10.

```bash
pnpm install
pnpm dev:tudo        # hub, os 8 filhos e a API ao mesmo tempo
```

Ou um de cada vez:

| Projeto                     | Comando                | Endereço em desenvolvimento        |
| --------------------------- | ---------------------- | ---------------------------------- |
| 0 · Hub                     | `pnpm dev`             | http://localhost:5170              |
| 1 · Flix                    | `pnpm dev:flix`        | http://localhost:5171              |
| 2 · Cadastro                | `pnpm dev:cadastro`    | http://localhost:5172              |
| 3 · Portal de Heróis        | `pnpm dev:herois`      | http://localhost:5173              |
| 4 · Formulários no Servidor | `pnpm dev:formularios` | http://localhost:5174/formularios/ |
| 5 · Tarefas                 | `pnpm dev:tarefas`     | http://localhost:5175              |
| 6 · Lista da Pelada         | `pnpm dev:pelada`      | http://localhost:5176              |
| 7 · Laboratório             | `pnpm dev:laboratorio` | http://localhost:5177              |
| 8 · Trilha React            | `pnpm dev:trilha`      | http://localhost:5178              |
| API (clientes e tarefas)    | `pnpm dev:api`         | http://localhost:3333              |

Cadastro (origem API) e Tarefas precisam da API ligada. Os filhos chamam `/api` no próprio endereço e o Vite encaminha para a porta 3333.

   ## Verificar

```bash
   pnpm verificar       # lint, typecheck, testes e build de tudo
   pnpm test:e2e        # Playwright do projeto 04, com e sem JavaScript
```

   Na primeira vez, instale o navegador do Playwright:
   `pnpm --filter @components/formularios exec playwright install chromium`

## Estrutura

```
components/
├── apps/
│   ├── hub/           projeto 0: SPA que apresenta os filhos
│   ├── cadastro/      02 · repositório trocável (memória ou API)
│   ├── herois/        03 · universo original, Tailwind v4 + Motion
│   ├── formularios/   04 · React Router em modo framework (SSR)
│   ├── tarefas/       05 · Redux Toolkit + RTK Query
│   ├── pelada/        06 · hooks puros, vagas, espera e sorteio
│   ├── laboratorio/   07 · 17 lições em MDX com demo, código e teste
│   ├── trilha/        08 · 116 aprendizados e o mapa da stack
│   └── api/           Hono + Drizzle + PGlite (Postgres em WebAssembly)
├── 1-flix/            01 · catálogo de vídeos (TanStack Query)
├── packages/
│   ├── ui/            tokens, componentes, hooks e mapa de endereços
│   ├── contratos/     esquemas Zod compartilhados entre front e API
│   └── config/        tsconfig base 
```

Cada projeto tem o próprio README, com telas, regras de negócio numeradas, estrutura e stack.

## Padrões comuns

- Uma instalação só (pnpm workspaces) e um catálogo de versões para todos.
- TypeScript estrito, CSS Modules (Tailwind só no 03) e os tokens de `@components/ui`.
- Regras de negócio em funções puras, validadas com Zod e testadas sem tela.
- Testes com Vitest, Testing Library e axe em todos os projetos; Playwright no 04.
- Estado derivado sempre que possível; filtros e abas na URL quando fazem sentido.
- Endereços entre projetos vêm de um mapa único (`@components/ui/ecossistema`).
- Comentário só no início e no fim de cada arquivo e no início de cada função.