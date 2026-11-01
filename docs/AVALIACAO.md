# Avaliação — components

> Data: 31/10/2026 · Base: `19d76b2`.

## Evidências

| Item | Resultado |
|---|---|
| `pnpm install --frozen-lockfile` | Passa com Node 24 e pnpm 10.28. O monorepo usa pnpm; instalar com `npm` não é o caminho suportado |
| Lint, tipos e build | Passam localmente |
| Testes | Passam no CI do commit atual; localmente, no Windows, `apps/cadastro` falhou (causa não investigada) |
| CI do último commit | Verde em 26/10 |
| Hub na Vercel | Responde 200 |
| API no Render | `/api/saude` não respondeu em 60 s; pode ser servidor gratuito dormindo |

## Achados

| # | Severidade | Achado | Encaminhamento |
|---|---|---|---|
| A1 | Alta | Telas que usam a API dependem de um servidor que pode demorar ou não responder | Medir e dar aviso de espera |
| A2 | Média | A `main` não tem proteção confirmada | Responsável |
| A3 | Média | Falha de `apps/cadastro` no Windows | Investigar no próximo ciclo |

## Nota

**7,0**, nível N2 parcial; meta N3. É um julgamento técnico.
