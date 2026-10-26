# Servidor de produção

Processo Node único que publica as partes dinâmicas do `components`: a **API compartilhada** em `/api` e o **Formulários no Servidor** (SSR) em `/formularios/`. Em produção roda no Render; no computador, o modo **ensaio** entrega também o hub e os filhos, reproduzindo o site publicado num único endereço.

O servidor não tem regra de negócio própria: ele só compõe peças que já existem e já são testadas. Decisão registrada na [ADR 0004](../../docs/adr/0004-servidor-de-producao-unico.md).

## Rodar

Na raiz do monorepo:

```bash
# Produção (API e Formulários)
pnpm --filter @components/formularios build
pnpm start

# Ensaio de produção (site completo)
pnpm build
pnpm montar:publicacao
pnpm ensaio:producao
```

O servidor sobe em `http://localhost:3333`, ou na porta definida em `PORT`.

## Rotas

| Caminho | Quem responde | Observação |
| --- | --- | --- |
| `/api/*` | API (`@components/api`) | `GET /api/saude` → `{"ok":true}`; rota inexistente → 404 em JSON |
| `/formularios/assets/*` e demais arquivos | `apps/formularios/build/client` | Arquivos estáticos do Formulários |
| `/formularios` e `/formularios/*` | SSR do React Router (`build/server`) | Responde 503 se o build não existir |
| `/` e `/<filho>/*` | Pasta `publicar/` | **Só no ensaio**; rota interna de filho devolve o `index.html` da pasta, caminho desconhecido na raiz devolve 404 |

## Modos

| Modo | Comando | Uso |
| --- | --- | --- |
| Produção | `pnpm start` (`node --import tsx src/servidor.ts`) | Render, com o Start Command `cd apps/servidor && node --max-old-space-size=200 --import tsx src/servidor.ts` |
| Ensaio | `pnpm ensaio:producao` (`node --import tsx src/servidor.ts --ensaio`) | Validar localmente antes de publicar; o T-01 pode rodar contra ele com `URL_BASE=http://localhost:3333/` |

## Memória

O servidor roda num único processo Node (`node --import tsx`, sem processos intermediários) e abre o banco no modo econômico (`memoriaReduzida`), para caber nos 512 MB do Render gratuito. No log, as linhas `[memória]` mostram o uso em cada etapa da subida, e a mensagem do banco indica se ele veio pronto do build (`banco:preparar`). Detalhes em [04 · Hospedagem](../../docs/04-hospedagem.md#memória-limite-de-512-mb).

## Variáveis de ambiente

| Variável | Padrão | Função |
| --- | --- | --- |
| `PORT` | — | Porta do provedor; tem prioridade |
| `PORTA` | 3333 | Porta alternativa |
| `PASTA_DADOS` | `apps/api/.dados` | Pasta do banco PGlite |
| `ORIGENS` | Portas de desenvolvimento | Origens liberadas no CORS da API, separadas por vírgula |
| `SERVIR_ESTATICOS` | — | `1` equivale a `--ensaio` |
| `NODE_ENV` | `production` | Modo do React Router |

## Estrutura

```
src/
├── app.ts        composição: monta API, Formulários e (no ensaio) publicar/
├── servidor.ts   inicialização: abre o banco, carrega o build e escuta na porta
└── testes/       composição testada sem abrir porta (API real em memória,
                  SSR simulado e pasta publicar/ temporária)
```

## Testes

```bash
pnpm --filter @components/servidor test
```

Cobrem a API sob `/api`, os arquivos e o SSR do Formulários, o aviso quando o build não existe e as regras do ensaio (raiz, pasta do filho, rota interna e 404).

## Stack

Node 24, TypeScript, Hono, `@hono/node-server`, React Router (`createRequestHandler`), tsx e Vitest.
