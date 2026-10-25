# 05 · Ajustes e backlog do MVP

Registro dos ajustes identificados. Cada item pode virar uma issue no GitHub, com o título da coluna **Ajuste** e o critério da coluna **Pronto quando**.

**Prioridade:** P0 bloqueia o MVP · P1 importante · P2 melhoria.
**Status:** A fazer · Em andamento (código escrito, aguardando verificação local) · Feito (verificado).

## Fase 0 · Documentação

| ID | Ajuste | Prioridade | Pronto quando | Status |
| --- | --- | --- | --- | --- |
| A-00 | Confirmar a branch de trabalho | P0 | `feature/spa-models` com conteúdo idêntico ao da `main` | Feito |
| D-01 | Documentação em `docs/` | P0 | Estado atual, planos, hospedagem, backlog e ADRs | Feito |

## Fase 1 · Rede de segurança

| ID | Ajuste | Prioridade | Pronto quando | Status |
| --- | --- | --- | --- | --- |
| A-01 | Corrigir `engines`, criar `.node-version`, atualizar README | P0 | Os três indicam o mesmo Node mínimo (24.15.0) | Feito |
| A-02 | Atualizar `vite` e `jsdom` no catálogo | P0 | `pnpm audit` sem vulnerabilidades altas; `pnpm verificar` verde | Feito |
| A-03 | Teste de navegação do ecossistema (T-01) | P0 | 8 de 8 filhos abrem pelo hub e voltam, sem erros | Em andamento |
| A-04 | CI no GitHub Actions | P0 | Verificação e navegação rodam em todo PR | Em andamento |

## Fase 2 · Publicação

| ID | Ajuste | Prioridade | Pronto quando | Status |
| --- | --- | --- | --- | --- |
| A-05 | API ler `PORT` | P0 | Sobe na porta definida pelo provedor | Em andamento |
| A-06 | Criar `apps/servidor` (com ensaio de produção local) | P0 | API em `/api` e SSR em `/formularios/` num único processo | Em andamento |
| A-07 | Script `montar-publicacao.mjs` | P0 | Pasta `publicar/` com hub na raiz e filhos nas pastas | Em andamento |
| A-08 | `vercel.json` | P0 | Rotas internas e encaminhamentos funcionando | Em andamento |
| A-09 | Deploy no Render | P0 | `/api/saude` responde | A fazer |
| A-10 | Deploy na Vercel | P0 | Hub publicado | A fazer |
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

## Fase 4 · Documentação e processo

| ID | Ajuste | Prioridade | Pronto quando | Status |
| --- | --- | --- | --- | --- |
| A-22 | ADRs 0001 a 0003 | P1 | Arquivos em `docs/adr/` | Feito |
| A-23 | `CONTRIBUTING.md` | P1 | Fluxo de branches e Conventional Commits documentados | A fazer |
| A-24 | `CLAUDE.md` do projeto | P2 | Contexto e regras para o Claude Code | A fazer |

## Histórico

| Data | Ajuste |
| --- | --- |
| 24/10/2026 | A-05 a A-08 escritos: API lê `PORT`, `apps/servidor` (com `pnpm ensaio:producao`), `scripts/montar-publicacao.mjs` e `vercel.json`; aguardando verificação |
| 24/10/2026 | A-03 e A-04 escritos: pacote `packages/testes-e2e` (T-01) e `.github/workflows/ci.yml`; aguardando verificação |
| 24/10/2026 | A-01 e A-02 verificados (`pnpm install`, `pnpm verificar`, `pnpm audit --audit-level high`) |
| 24/10/2026 | Node do ambiente local atualizado para 24.22.1 (o 24.14.0 era incompatível com o `jsdom`) |
| 24/10/2026 | Branch `feature/spa-models` confirmada com conteúdo idêntico ao da `main` |
| 24/10/2026 | Documentação inicial criada em `docs/` |
