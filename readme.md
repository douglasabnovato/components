# components

Portfólio de engenharia front-end em React: um **hub** que apresenta **8 projetos**, cada um com uma demonstração ao vivo feita com os dados e as regras reais do projeto. Sete são ideias antigas reconstruídas do zero com React moderno; o oitavo é uma trilha de estudo com 116 aprendizados. Cada projeto usa uma stack diferente, de propósito, para mostrar abordagens distintas para problemas comuns de interface.

**Site:** https://components-dusky-nine.vercel.app

## Estado e próximos passos (ciclo de 16/11/2026)

**Critérios do MVP:** 10 de 12 atendidos; Finalizado: sim. Os 2 parciais dependem do responsável (#28, #27). O único alerta do Dependabot (`minimatch`, só do lint) está aceito na [ADR 0005](docs/adr/0005-aceitar-alertas-de-desenvolvimento-do-dependabot.md). Detalhes em [`docs/MVP.md`](docs/MVP.md).

**O que foi feito**

- Neste ciclo (PR da `feature/2026-11-16` para a `developer/sprint-2026-11-19`):
  - LCP medido no site publicado: mediana de 1,67 s no Lighthouse móvel (3 execuções válidas, 16/11/2026).
  - axe completo no navegador, no CI, para o hub e os 8 filhos; ele achou o contraste do selo "concluída" das Tarefas, já corrigido.
  - Seções do hub pedidas no tempo ocioso, num pedido só (#34).
  - Vulnerabilidades de desenvolvimento de 5 para 1 (#40); produção segue sem nenhuma.
  - Testes de lista vazia e de espera no Cadastro e nas Tarefas, e o [`docs/DEPLOY.md`](docs/DEPLOY.md).
- Já na `main` (PR #35, 16/11/2026): topo pré-renderizado (#36), aviso de servidor fora do ar na seção 04 (#37), contraste dos cartões (#24), teclado nos 8 aplicativos (#25), Blueprint do Render (`render.yaml`) e medição pronta no código.

**Site:** https://components-dusky-nine.vercel.app respondeu 200 em 16/11/2026, com o build da `main`. O servidor no Render (`/api` e `/formularios/`) não respondeu; ver #28.

**O que queremos fazer**

- #28 Publicar o servidor no Render pelo Blueprint (responsável; passo a passo em [`docs/DEPLOY.md`](docs/DEPLOY.md)).
- #27 Criar a conta do GoatCounter `douglasabnovato` (responsável; o código já está no site).
- #41 Ligar os alertas do Dependabot e a varredura de segredos (responsável).
- #42 Baixar o tempo de bloqueio (TBT) do hub.
- #46 Tirar o `minimatch` vulnerável das dependências de lint: `typescript-eslint` 8.73.0 na sprint (18/11/2026); o alerta fecha no merge da `main`.
- #47 Rodar a navegação e o axe no site depois de cada merge na `main`.
- #48 Alinhar o guia de hospedagem ao Blueprint do Render: feito na sprint (18/11/2026); fecha no merge da `main`.
- #49 Pôr a checagem de formatação no CI: feita na sprint (18/11/2026); fecha no merge da `main`.
- #50 Cobrir lista vazia e espera nas Tarefas: feito neste ciclo; fecha no merge da `main`.
- #52 Testar o Esc nos diálogos e tirar o `networkidle` do teste do axe.

**Onde está a documentação**

- Estado dos critérios: [`docs/MVP.md`](docs/MVP.md)
- Plano do ciclo: [`docs/PLANO-DE-ACAO.md`](docs/PLANO-DE-ACAO.md)
- Publicação: [`docs/DEPLOY.md`](docs/DEPLOY.md) e [`docs/04-hospedagem.md`](docs/04-hospedagem.md)

## Projetos

| #   | Projeto                 | O que faz                                                  | Destaque técnico                      |
| --- | ----------------------- | ---------------------------------------------------------- | ------------------------------------- |
| 0   | Hub                     | Apresenta os filhos com demos ao vivo                      | React 19, MDX                         |
| 1   | Flix                    | Catálogo de vídeos                                         | TanStack Query                        |
| 2   | Cadastro                | CRUD de clientes com repositório trocável (memória ou API) | TanStack Query, React Hook Form, Zod  |
| 3   | Portal de Heróis        | Universo original com equipes, fichas e comparação         | Tailwind v4, Motion                   |
| 4   | Formulários no Servidor | Formulários que funcionam sem JavaScript                   | React Router em modo framework (SSR)  |
| 5   | Tarefas                 | Atalhos de teclado, busca por regex e conclusão otimista   | Redux Toolkit, RTK Query              |
| 6   | Lista da Pelada         | Vagas, lista de espera e sorteio equilibrado de times      | Hooks puros, reducer                  |
| 7   | Laboratório             | 17 lições em MDX com demo, código e teste                  | MDX, React 19                         |
| 8   | Trilha React            | 116 aprendizados em 12 módulos e o mapa da stack           | Estado na URL, `useSyncExternalStore` |
| —   | API                     | Clientes (02) e tarefas (05)                               | Hono, Drizzle, PGlite                 |

Cada projeto tem o próprio README, com telas, regras de negócio numeradas, estrutura e stack.

## Como funciona

O repositório é um **monorepo pnpm**: cada projeto é uma aplicação independente, mas todos compartilham uma única instalação, um catálogo de versões e dois pacotes comuns, `@components/ui` (identidade visual e mapa de endereços) e `@components/contratos` (esquemas Zod usados pelo front e pela API).

Publicado, tudo fica **sob um único domínio**: o hub na raiz e cada filho na sua pasta (`/flix/`, `/trilha/`…). As partes estáticas são servidas pela **Vercel**; a API e o Formulários, que precisam de servidor, rodam num único processo Node no **Render**, e a Vercel repassa `/api` e `/formularios` para ele.

```mermaid
flowchart LR
  V[Visitante] --> VC[Vercel]
  VC -->|hub e 7 filhos| E[Arquivos estáticos]
  VC -->|/api e /formularios| R[Render · servidor Node]
  R --> A[API + PGlite]
  R --> F[Formulários SSR]
```

## Engenharia

- **Qualidade verificável:** TypeScript estrito, lint, testes e build em todos os projetos com um único comando (`pnpm verificar`).
- **Testes em camadas:** regras de negócio em funções puras testadas com Vitest; telas com Testing Library e axe; API com banco real em memória; navegação entre projetos com Playwright.
- **Integração contínua:** GitHub Actions roda a verificação e os testes de navegador em todo push e pull request.
- **Fonte única de endereços:** links entre projetos saem de um mapa só, que também serve de gabarito para os testes.
- **Produção reproduzível:** um ensaio local entrega o site exatamente como publicado, antes de cada deploy.
- **Decisões registradas:** cada escolha de arquitetura tem um ADR com contexto, alternativas e consequências.

**Situação:** a parte estática está publicada; a parte dinâmica (API e Formulários) está em publicação. O que falta para o MVP estável e os passos seguintes estão em [docs/06 · Próximos passos](docs/06-proximos-passos.md).

## Começar

Requisitos: Node 24.15 ou mais novo na linha 24 (a versão do projeto está em `.node-version`) e pnpm 10.28.

```bash
pnpm install
pnpm dev:tudo        # hub, os 8 filhos e a API
pnpm verificar       # lint, tipos, testes e build
pnpm test:navegacao  # navegação entre projetos (Playwright)
```

Comandos por projeto, portas e o ensaio de produção estão em [docs/02 · Arquitetura](docs/02-plano-de-arquitetura.md).

## Documentação

| Para saber                                       | Leia                                                   |
| ------------------------------------------------ | ------------------------------------------------------ |
| Situação atual, riscos e evolução desde o início | [01 · Estado atual](docs/01-estado-atual.md)           |
| Arquitetura, ambientes e caminho das requisições | [02 · Arquitetura](docs/02-plano-de-arquitetura.md)    |
| Estratégia e situação dos testes                 | [03 · Plano de testes](docs/03-plano-de-testes.md)     |
| Como publicar, validar e diagnosticar            | [04 · Hospedagem](docs/04-hospedagem.md)               |
| Ajustes, prioridades e histórico                 | [05 · Ajustes e backlog](docs/05-ajustes-e-backlog.md) |
| O que vem a seguir                               | [06 · Próximos passos](docs/06-proximos-passos.md)     |
| Por que as coisas são como são                   | [ADRs](docs/adr/)                                      |

## Estrutura

```
components/
├── apps/          hub, 7 filhos, API e servidor de produção
├── 1-flix/        projeto 01
├── packages/      ui, contratos, config e testes de ponta a ponta
├── scripts/       montagem do site publicado
├── docs/          documentação técnica e ADRs
└── vercel.json    publicação na Vercel
```

## Padrões comuns

- Uma instalação só (pnpm workspaces) e um catálogo de versões para todos.
- TypeScript estrito, CSS Modules (Tailwind só no 03) e os tokens de `@components/ui`.
- Regras de negócio em funções puras, validadas com Zod e testadas sem tela.
- Estado derivado sempre que possível; filtros e abas na URL quando fazem sentido.
- Comentário só no início e no fim de cada arquivo e no início de cada função.
