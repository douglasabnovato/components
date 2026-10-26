# 05 · Ajustes e backlog do MVP

Registro dos ajustes identificados. Cada item pode virar uma issue no GitHub, com o título da coluna **Ajuste** e o critério da coluna **Pronto quando**.

**Prioridade:** P0 bloqueia o MVP · P1 importante · P2 melhoria.
**Status:** A fazer · Em andamento (código escrito, aguardando verificação local) · Feito (verificado).

## Fase 0 · Documentação

| ID | Ajuste | Prioridade | Pronto quando | Status |
| --- | --- | --- | --- | --- |
| A-00 | Confirmar a branch de trabalho | P0 | `feature/spa-models` com conteúdo idêntico ao da `main` | Feito |
| D-01 | Documentação em `docs/` | P0 | Estado atual, planos, hospedagem, backlog e ADRs | Feito |
| D-02 | Atualização da documentação após a publicação | P1 | Docs, ADRs, READMEs de pacote e readme da raiz refletem o estado de 26/10; plano de próximos passos ([06](06-proximos-passos.md)) | Em andamento |

## Fase 1 · Rede de segurança

| ID | Ajuste | Prioridade | Pronto quando | Status |
| --- | --- | --- | --- | --- |
| A-01 | Corrigir `engines`, criar `.node-version`, atualizar README | P0 | Os três indicam o mesmo Node mínimo (24.15.0) | Feito |
| A-02 | Atualizar `vite` e `jsdom` no catálogo | P0 | `pnpm audit` sem vulnerabilidades altas; `pnpm verificar` verde | Feito |
| A-03 | Teste de navegação do ecossistema (T-01) | P0 | 8 de 8 filhos abrem pelo hub e voltam, sem erros | Feito |
| A-04 | CI no GitHub Actions | P0 | Verificação e navegação rodam em todo PR; execução verde na `main` | Em andamento |

## Fase 2 · Publicação

| ID | Ajuste | Prioridade | Pronto quando | Status |
| --- | --- | --- | --- | --- |
| A-05 | API ler `PORT` | P0 | Sobe na porta definida pelo provedor | Feito |
| A-06 | Criar `apps/servidor` (com ensaio de produção local) | P0 | API em `/api` e SSR em `/formularios/` num único processo | Feito |
| A-07 | Script `montar-publicacao.mjs` | P0 | Pasta `publicar/` com hub na raiz e filhos nas pastas | Feito |
| A-08 | `vercel.json` | P0 | Rotas internas e encaminhamentos funcionando em produção | Em andamento |
| A-09 | Deploy no Render | P0 | `/api/saude` responde pelo Render e pela Vercel | A fazer |
| A-10 | Deploy na Vercel | P0 | Hub publicado | Feito |
| A-11 | Fumaça em produção (T-05) | P0 | T-01 verde contra a URL publicada | A fazer |

## Fase 3 · Clicáveis e qualidade

| ID | Ajuste | Prioridade | Pronto quando | Status |
| --- | --- | --- | --- | --- |
| A-12 | Clicáveis por projeto (T-02) | P0 | Verde nos 8 filhos | A fazer |
| A-13 | Corrigir o que T-01 e T-02 acusarem | P0 | Testes verdes | A fazer |
| A-14 | Testes do hub (T-04) | P1 | Seções, demos e links cobertos | A fazer |
| A-15 | Fluxos principais (T-03) | P1 | Um fluxo por filho | A fazer |
| A-16 | `strictPort: true` no hub | P1 | Hub não muda de porta silenciosamente | A fazer |
| A-17 | Flix usar `enderecoDoHub(1)` | P1 | Todos os filhos usam a fonte única | A fazer |
| A-18 | Mover `1-flix` para `apps/flix` | P2 | Todos os apps em `apps/` | A fazer |
| A-19 | Remover ignorados órfãos no ESLint e Prettier | P2 | Sem pastas inexistentes nas configurações | A fazer |
| A-20 | Carregamento sob demanda no hub | P2 | JavaScript inicial bem abaixo de 685 kB | A fazer |
| A-21 | Fontes só com alfabeto latino | P2 | Build sem cirílico, grego e vietnamita | A fazer |
| A-26 | Título e descrição do hub com 8 projetos | P1 | `index.html` do hub cita 8 projetos e a Trilha | A fazer |
| A-32 | Acessibilidade nos testes de navegador | P2 | Verificação axe nas páginas do T-01 | A fazer |
| A-33 | Orçamento de desempenho no CI | P2 | CI falha acima de um limite de JavaScript inicial | A fazer |
| A-25 | Migrar para o ESLint 10 | P2 | `pnpm install` sem aviso de ESLint descontinuado; `pnpm lint` verde | A fazer |

## Fase 4 · Documentação e processo

| ID | Ajuste | Prioridade | Pronto quando | Status |
| --- | --- | --- | --- | --- |
| A-22 | ADRs 0001 a 0004 | P1 | Arquivos em `docs/adr/` | Feito |
| A-23 | `CONTRIBUTING.md` | P1 | Fluxo de branches e Conventional Commits documentados | A fazer |
| A-24 | `CLAUDE.md` do projeto | P2 | Contexto e regras para o Claude Code | A fazer |
| A-27 | Proteger a branch `main` | P1 | Merge exige o job "Verificação e navegação" verde | A fazer |
| A-35 | Modelo de pull request | P2 | `.github/pull_request_template.md` com checklist de verificação | A fazer |

## Fase 5 · Operação e evolução

Itens detalhados em [06 · Próximos passos](06-proximos-passos.md).

| ID | Ajuste | Prioridade | Pronto quando | Status |
| --- | --- | --- | --- | --- |
| A-28 | Fumaça automática após cada deploy | P2 | Workflow roda o T-01 contra produção depois do deploy | A fazer |
| A-29 | Monitoramento de disponibilidade | P2 | Verificação periódica de `/` e `/api/saude` com alerta | A fazer |
| A-30 | Atualização automática de dependências e audit no CI | P2 | Dependabot ou Renovate ativo; `pnpm audit --audit-level high` no CI | A fazer |
| A-31 | Cabeçalhos de segurança na Vercel | P2 | Cabeçalhos no `vercel.json` sem quebrar os filhos | A fazer |
| A-34 | Captura de erros em produção | P2 | Erros do navegador e do servidor visíveis num painel | A fazer |
| A-36 | Domínio mais legível na Vercel | P2 | Domínio escolhido, refletido no `ORIGENS` e na documentação | A fazer |
| A-37 | Banco persistente (condicional) | P2 | Só se a persistência virar requisito; decisão em ADR | A fazer |

## Histórico

| Data | Ajuste |
| --- | --- |
| 26/10/2026 | Documentação atualizada (D-02): estado atual, arquitetura vigente, guia de operação da hospedagem, próximos passos (06), ADR 0003 aceita, ADR 0004 e READMEs de `servidor`, `testes-e2e` e `ui`. Removidos da raiz os arquivos de diagnóstico da Fase 0 |
| 26/10/2026 | A-10 feito: projeto `components` na Vercel (preset Other), publicado em https://components-dusky-nine.vercel.app. Parte dinâmica aguarda o A-09 |
| 26/10/2026 | PR #9 (`feature/spa-models` → `developer-mvp`) e PR #10 (`developer-mvp` → `main`) mesclados: 35 arquivos na `main` |
| 26/10/2026 | A-05 a A-07 verificados no ensaio de produção: `pnpm ensaio:producao` e T-01 com `URL_BASE` em 11 de 11 (26 s). A-08 fica em andamento até o deploy na Vercel (A-10) |
| 26/10/2026 | A-03 verificado: `pnpm test:navegacao` com 11 de 11 testes passando em desenvolvimento (1,9 min) |
| 24/10/2026 | A-05 a A-08 escritos: API lê `PORT`, `apps/servidor` (com `pnpm ensaio:producao`), `scripts/montar-publicacao.mjs` e `vercel.json`; aguardando verificação |
| 24/10/2026 | A-03 e A-04 escritos: pacote `packages/testes-e2e` (T-01) e `.github/workflows/ci.yml`; aguardando verificação |
| 24/10/2026 | A-01 e A-02 verificados (`pnpm install`, `pnpm verificar`, `pnpm audit --audit-level high`) |
| 24/10/2026 | Node do ambiente local atualizado para 24.22.1 (o 24.14.0 era incompatível com o `jsdom`) |
| 24/10/2026 | Branch `feature/spa-models` confirmada com conteúdo idêntico ao da `main` |
| 24/10/2026 | Documentação inicial criada em `docs/` |
