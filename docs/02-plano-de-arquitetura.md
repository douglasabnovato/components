# 02 · Arquitetura

Como o components está organizado e como uma requisição percorre o sistema em cada ambiente. O plano original do MVP foi implementado; os ajustes que faltam estão no fim deste documento e no [backlog](05-ajustes-e-backlog.md).

## Objetivo

Publicar o hub, os 8 filhos e a API **sob um único domínio**, mantendo as decisões que já estavam no código (pastas por projeto e API em `/api`) e garantindo que todo link funcione publicado.

## Arquitetura em produção

```mermaid
flowchart TB
  U[Visitante] --> V[Vercel · domínio único]
  V -->|/| HUB[Hub · estático]
  V -->|/flix/ /cadastro/ /herois/<br/>/tarefas/ /pelada/<br/>/laboratorio/ /trilha/| EST[Filhos · estáticos]
  V -->|/api/*| R[Render · apps/servidor]
  V -->|/formularios/*| R
  R --> API[API Hono<br/>clientes e tarefas]
  R --> SSR[Formulários<br/>React Router SSR]
  API --> DB[(PGlite)]
```

| Camada | Onde roda | Conteúdo |
| --- | --- | --- |
| Estáticos | Vercel | Hub na raiz e 7 filhos em pastas próprias (pasta `publicar/`) |
| Dinâmico | Render | Um único processo Node (`apps/servidor`) com a API em `/api` e o SSR em `/formularios/` |
| Roteamento | Vercel (`vercel.json`) | Encaminha `/api` e `/formularios` ao Render; faz rotas internas dos filhos carregarem o app |

## Os três ambientes

| | Desenvolvimento | Ensaio de produção | Produção |
| --- | --- | --- | --- |
| Comando | `pnpm dev:tudo` | `pnpm build`, `pnpm montar:publicacao`, `pnpm ensaio:producao` | Deploy automático a partir da `main` |
| Endereços | Uma porta por projeto (5170 a 5178) | `http://localhost:3333` | Domínio da Vercel |
| Hub e filhos estáticos | Servidor do Vite de cada projeto | `apps/servidor` entregando `publicar/` | Vercel entregando `publicar/` |
| API | `pnpm dev:api` na 3333; o Vite encaminha `/api` | `apps/servidor` em `/api` | Render, via encaminhamento da Vercel |
| Formulários | Servidor do React Router na 5174, em `/formularios/` | `apps/servidor` em `/formularios/` | Render, via encaminhamento da Vercel |
| Banco | `apps/api/.dados` | `apps/api/.dados` | Disco temporário do Render |

### Comandos e portas de desenvolvimento

| Projeto | Comando | Endereço |
| --- | --- | --- |
| Todos, com a API | `pnpm dev:tudo` | — |
| 0 · Hub | `pnpm dev` | http://localhost:5170 |
| 1 · Flix | `pnpm dev:flix` | http://localhost:5171 |
| 2 · Cadastro | `pnpm dev:cadastro` | http://localhost:5172 |
| 3 · Portal de Heróis | `pnpm dev:herois` | http://localhost:5173 |
| 4 · Formulários no Servidor | `pnpm dev:formularios` | http://localhost:5174/formularios/ |
| 5 · Tarefas | `pnpm dev:tarefas` | http://localhost:5175 |
| 6 · Lista da Pelada | `pnpm dev:pelada` | http://localhost:5176 |
| 7 · Laboratório | `pnpm dev:laboratorio` | http://localhost:5177 |
| 8 · Trilha React | `pnpm dev:trilha` | http://localhost:5178 |
| API | `pnpm dev:api` | http://localhost:3333 |

Cadastro (modo API) e Tarefas precisam da API ligada.

Os endereços entre projetos vêm sempre de `packages/ui/src/utilitarios/ecossistema.ts`: em desenvolvimento ele gera `http://localhost:<porta>/`; no build, `/<pasta>/`.

### Caminho de uma requisição em produção

| Pedido | Quem responde | Como |
| --- | --- | --- |
| `/` | Vercel | `publicar/index.html` (hub) |
| `/trilha/assets/index-abc.js` | Vercel | Arquivo existente em `publicar/trilha/` |
| `/trilha/aprendizado/1` | Vercel | Não existe arquivo; a regra da pasta devolve `publicar/trilha/index.html` e o roteador do app resolve a rota |
| `/api/tarefas` | Render | A Vercel repassa; o servidor entrega à API |
| `/formularios/contato` | Render | A Vercel repassa; o servidor gera a página (SSR) |
| `/formularios/assets/...` | Render | Arquivos do build do cliente do Formulários |
| `/caminho-inexistente` | Vercel | 404 |

## Componentes de publicação

### `apps/servidor`

| Responsabilidade | Como |
| --- | --- |
| Expor a API em `/api` | Monta o `criarApp` de `@components/api` sob o prefixo; rota inexistente devolve 404 em JSON |
| Expor o SSR do Formulários em `/formularios/` | Carrega `apps/formularios/build/server` e entrega `build/client` como arquivos estáticos |
| Ler a porta do provedor | `PORT`, com `PORTA` e 3333 como alternativas |
| Saúde | `GET /api/saude` → `{"ok":true}` |
| Ensaio de produção local | Com `--ensaio` (ou `SERVIR_ESTATICOS=1`), entrega também `publicar/`, com as mesmas regras do `vercel.json` |
| Estrutura | `src/app.ts` compõe as partes e é testado com Vitest; `src/servidor.ts` abre o banco, carrega o build e escuta na porta |

Princípio: **reaproveitar, não reescrever**. O servidor só compõe peças que já existem e já são testadas. Decisão registrada na [ADR 0004](adr/0004-servidor-de-producao-unico.md). Detalhes de uso no [README do pacote](../apps/servidor/README.md).

### `scripts/montar-publicacao.mjs`

Depois do `pnpm build`, monta a pasta `publicar/` (ignorada pelo git):

| Origem | Destino |
| --- | --- |
| `apps/hub/dist` | `publicar/` |
| `1-flix/dist` | `publicar/flix/` |
| `apps/<slug>/dist` | `publicar/<slug>/` (cadastro, herois, tarefas, pelada, laboratorio, trilha) |

O Formulários não entra na pasta: ele é servido pelo `apps/servidor` (SSR). O script falha, listando o que falta, se algum build não existir.

### `vercel.json`

Define o build (`pnpm build && node scripts/montar-publicacao.mjs`), a pasta de saída (`publicar`), o encaminhamento de `/api` e `/formularios` ao Render e uma regra por filho para rotas internas. Detalhes em [04 · Hospedagem](04-hospedagem.md).

## Dados

| Ambiente | Banco | Comportamento |
| --- | --- | --- |
| Desenvolvimento e ensaio | PGlite em `apps/api/.dados` | Persiste entre execuções |
| Testes | PGlite em memória | Reiniciado entre testes |
| Produção (Render gratuito) | PGlite em disco temporário | **Volta aos dados de exemplo** a cada reinício, deploy ou hibernação. Aceitável para demonstração |
| Futuro, se precisar persistir | Postgres gerenciado | Troca facilitada pelo Drizzle (A-37) |

## Ajustes de arquitetura

| Ajuste | Motivo | Situação |
| --- | --- | --- |
| API ler `PORT` | Padrão dos provedores de hospedagem | ✅ Feito (A-05) |
| Origens do CORS por variável | O padrão lista só portas de desenvolvimento | ✅ Suportado (`ORIGENS`); configurar no Render (A-09) |
| `strictPort: true` no hub | Se a 5170 estiver ocupada, os botões de voltar quebram | A-16 |
| Flix usar `enderecoDoHub(1)` | Hoje monta o endereço à mão, fora da fonte única | A-17 |
| Mover `1-flix` para `apps/flix` | Único projeto fora do padrão | A-18 |
| Carregamento sob demanda no hub | 685 kB de JavaScript inicial | A-20 |
| Fontes só com alfabeto latino | Cirílico, grego e vietnamita não são usados | A-21 |

## Decisões registradas

| ADR | Decisão |
| --- | --- |
| [0001](adr/0001-pnpm-monorepo.md) | pnpm e monorepo |
| [0002](adr/0002-um-dominio-com-pastas.md) | Um domínio, uma pasta por projeto, API em `/api` |
| [0003](adr/0003-hospedagem-vercel-render.md) | Hospedagem: Vercel para estáticos, Render para o dinâmico |
| [0004](adr/0004-servidor-de-producao-unico.md) | Servidor de produção único para API e SSR |
