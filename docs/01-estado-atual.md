# 01 · Estado atual do projeto

_Retrato de 26/10/2026, após o merge do PR #10 (`developer-mvp` → `main`). A comparação com o levantamento inicial está em [Linha de base](#linha-de-base-24102026)._

## Visão geral

Monorepo pnpm com um **hub** (projeto 0) que apresenta **8 projetos filhos** com demonstrações ao vivo, uma **API compartilhada**, um **servidor de produção** e **4 pacotes comuns**. Sete filhos são ideias antigas reconstruídas com React moderno; o oitavo é uma trilha de estudo.

## Inventário

| # | Projeto | Pasta | O que faz | Stack de destaque | Arquivos de teste | Usa a API |
| --- | --- | --- | --- | --- | --- | --- |
| 0 | Hub | `apps/hub` | Página única com as 8 seções e demos com dados reais | React 19, MDX, Motion | 1 | Não |
| 1 | Flix | `1-flix` | Catálogo de vídeos | TanStack Query, React Router | 4 | Não |
| 2 | Cadastro | `apps/cadastro` | CRUD de clientes, repositório em memória ou API | TanStack Query, React Hook Form, Zod | 2 | Sim (modo API) |
| 3 | Portal de Heróis | `apps/herois` | Catálogo, fichas, equipes e comparação | Tailwind v4, Motion | 2 | Não |
| 4 | Formulários no Servidor | `apps/formularios` | Formulários que funcionam sem JavaScript | React Router modo framework (SSR) | 3 (inclui Playwright) | Não |
| 5 | Tarefas | `apps/tarefas` | Atalhos, busca por regex, conclusão otimista | Redux Toolkit, RTK Query | 2 | Sim |
| 6 | Lista da Pelada | `apps/pelada` | Vagas, lista de espera, sorteio equilibrado | Hooks puros, reducer | 3 | Não |
| 7 | Laboratório | `apps/laboratorio` | 17 lições em MDX com demo, código e teste | MDX | 18 | Não |
| 8 | Trilha React | `apps/trilha` | 116 aprendizados em 12 módulos | Estado na URL, `useSyncExternalStore` | 3 | Não |
| — | API | `apps/api` | Clientes e tarefas | Hono, Drizzle, PGlite | 1 | — |
| — | Servidor | `apps/servidor` | Produção: API em `/api` e SSR em `/formularios/`; ensaio local do site completo | Hono, React Router | 1 | — |
| — | UI | `packages/ui` | Componentes, hooks, tokens e mapa do ecossistema | React | 3 | — |
| — | Contratos | `packages/contratos` | Esquemas Zod compartilhados entre front e API | Zod | 1 | — |
| — | Config | `packages/config` | TypeScript base | — | 0 | — |
| — | Testes de ponta a ponta | `packages/testes-e2e` | Navegação do ecossistema (T-01) | Playwright | 1 | — |

**Totais:** 16 pacotes no workspace (contando a raiz) e 45 arquivos de teste.

## Arquitetura

Detalhes em [02 · Arquitetura](02-plano-de-arquitetura.md). Em resumo:

| Ambiente | Como roda |
| --- | --- |
| Desenvolvimento | Cada projeto na própria porta (5170 a 5178); API na 3333; o Vite encaminha `/api` |
| Ensaio de produção | Um processo (`pnpm ensaio:producao`) entrega o site completo em `http://localhost:3333` |
| Produção | Vercel entrega o estático e encaminha `/api` e `/formularios` ao Render |

### Decisões presentes no código

| Decisão | Onde está |
| --- | --- |
| **Fonte única de endereços** entre hub, filhos e API | `packages/ui/src/utilitarios/ecossistema.ts` |
| **Em desenvolvimento**, cada projeto na própria porta | `ecossistema.ts` e `vite.config.ts` de cada app |
| **Publicado**, cada filho numa pasta do mesmo domínio (`/flix/`, `/tarefas/`…) | `base` nos `vite.config.ts`; `basename` nos roteadores; `scripts/montar-publicacao.mjs` |
| **API sempre em `/api`** no mesmo domínio, sem CORS no navegador | `enderecoDaApi()`, `proxyDaApi()`, `apps/servidor` e `vercel.json` |
| **Formulários com SSR** sob `/formularios/` em todos os ambientes | `react-router.config.ts` e `apps/servidor` |
| **Catálogo único de versões** e `engineStrict` | `pnpm-workspace.yaml` |
| **Regras de negócio em funções puras**, validadas com Zod e testadas sem tela | Padrão de todos os filhos |
| **Banco PGlite** gravado em `apps/api/.dados` (ou `PASTA_DADOS`) | `apps/api/src/config.ts` |
| **Porta do provedor** (`PORT`, depois `PORTA`, depois 3333) | `apps/api/src/config.ts` |

### Navegação entre projetos

| Origem | Destino | Implementação |
| --- | --- | --- |
| Hub → filho | `enderecoDoProjeto(n)` | `apps/hub/src/dados/projetos.ts` |
| Filho → hub | `enderecoDoHub(n)` (âncora `#filho-n`) | `config.ts` de cada filho; o Flix monta o endereço à mão (A-17) |
| Trilha e Laboratório → outros filhos | `enderecoDoProjeto(n, caminho)` | `apps/trilha/src/paginas/*`, `apps/laboratorio/src/config.ts` |

Em desenvolvimento, um link só funciona se o projeto de destino estiver rodando. Para todos funcionarem, use `pnpm dev:tudo`.

## Qualidade

| Verificação | Resultado |
| --- | --- |
| `pnpm verificar` (lint, tipos, testes, build) | ✅ Passa |
| `pnpm audit --audit-level high` | ✅ Sem vulnerabilidades altas |
| T-01 · navegação em desenvolvimento | ✅ 11 de 11 (1,9 min) |
| T-01 · navegação no ensaio de produção | ✅ 11 de 11 (26 s) |
| CI (GitHub Actions) | ✅ Configurado em todo push e pull request; confirmar execução verde na `main` (A-04) |
| Proteção da `main` | ❌ Merge possível com CI vermelho (A-27) |
| Clicáveis dentro dos filhos (T-02) | ❌ Ainda não medido (A-12) |

## Publicação

| Parte | Onde | Situação |
| --- | --- | --- |
| Hub e 7 filhos estáticos | Vercel · https://components-dusky-nine.vercel.app | ✅ No ar |
| API (`/api`) | Render · `components-servidor` | ⏳ Serviço a criar (A-09) |
| Formulários (`/formularios/`) | Render · `components-servidor` | ⏳ Serviço a criar (A-09) |

Até o A-09, a Tarefas e o Cadastro no modo API abrem, mas não carregam dados, e o Formulários não abre pelo domínio publicado.

## Ambiente de desenvolvimento

| Requisito | Valor |
| --- | --- |
| Node | Versão do projeto: **24.22.1** (`.node-version`). Mínimo aceito: 24.15.0 na linha 24, 22.22.2 na linha 22 ou 26+ (`engines`) |
| pnpm | 10.28.0 (`packageManager`, ativado pelo Corepack) |
| Banco | Não precisa instalar: o PGlite roda dentro da API |
| Navegador de teste | Chromium do Playwright, instalado uma vez por máquina |

## Riscos atuais

| Risco | Impacto | Tratamento |
| --- | --- | --- |
| Parte dinâmica fora do ar | API e Formulários com erro no site publicado | A-09 |
| `main` sem proteção | Regressões podem entrar com o CI vermelho | A-27 |
| Clicáveis dos filhos não testados | Botões quebrados só aparecem manualmente | A-12, A-13 |
| Render gratuito hiberna | Primeira visita à API e ao Formulários leva cerca de 1 minuto | Aceito no MVP ([ADR 0003](adr/0003-hospedagem-vercel-render.md)) |
| Banco em disco temporário | Dados voltam ao exemplo a cada reinício | Aceito no MVP; A-37 se virar requisito |
| Título do hub com "7 projetos" | Informação errada na aba e em buscadores | A-26 |

## Linha de base (24/10/2026)

Levantamento feito antes do plano de MVP, na branch `feature/spa-models`.

| Item | Em 24/10 | Em 26/10 |
| --- | --- | --- |
| Servidor de produção | Não existia | `apps/servidor`, com 11 testes |
| Teste de navegação entre projetos | Não existia | T-01, 11 de 11 |
| CI | Nenhum workflow | `.github/workflows/ci.yml` |
| Configuração de publicação | Nenhuma | `vercel.json` e `scripts/montar-publicacao.mjs` |
| Requisito de Node | `engines` com 22.12.0, incompatível com dependências | `engines` corrigido e `.node-version` |
| Vulnerabilidades | 15 (5 altas) | Nenhuma alta |
| Porta da API | Só `PORTA` | `PORT`, `PORTA` ou 3333 |
| Arquivos de teste | 43 | 45 |
| Site publicado | Não | Parte estática na Vercel |
