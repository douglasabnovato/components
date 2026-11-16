# ADR 0005 · Aceitar os alertas de desenvolvimento do Dependabot

- **Status:** aceita
- **Data:** 16/11/2026

## Contexto

Em 16/11/2026, às 14h39, `gh api "repos/douglasabnovato/components/dependabot/alerts?state=open&per_page=100"` devolveu 1 alerta aberto, no `pnpm-lock.yaml`, com escopo de desenvolvimento.

Regra para os alertas, ordem do responsável repassada pelo DG líder em 16/11/2026:

> "Regra geral por ADR. alertas que nao atrapalham a producao, pode passar. os que atrapalham, entender, escolher a melhor estrategia para manter a funcionalidade"

"Produção" aqui é o que vai para o site na Vercel (build estático do hub e dos filhos) e para o servidor no Render (`apps/servidor`, com a API e o SSR do Formulários).

## Decisão

| Alerta | Pacote | Severidade | Quem o puxa | Por que não chega à produção |
|---|---|---|---|---|
| #5 | `minimatch` 10.2.6 (GHSA-g3hv-75wg-m249) | média | `typescript-eslint` → `@typescript-eslint/typescript-estree` 8.70.1, dependência de desenvolvimento da raiz do monorepo | É do lint (`pnpm lint`), que roda na máquina de quem desenvolve e no CI. Nenhum pacote de `apps/` ou `packages/` depende do `typescript-eslint`, e o build não leva o lint. A correção só existe no `minimatch` 11. O `@typescript-eslint/typescript-estree` 8.73.0, publicado em 16/11/2026 às 14h06, já pede `^11.0.1`; até a versão anterior (8.72.2) pedia `^10.2.2`. |

Prova, em 16/11/2026, no clone de `developer/sprint-2026-11-19`:

- `pnpm audit --prod`: "No known vulnerabilities found".
- `pnpm audit` (com desenvolvimento): 1 vulnerabilidade, a do `minimatch`, com o caminho `.>typescript-eslint>@typescript-eslint/typescript-estree>minimatch`.
- `pnpm-lock.yaml`: `minimatch@10.2.6` só aparece nas dependências de `@typescript-eslint/typescript-estree@8.70.1`; o `typescript-eslint` só está no `package.json` da raiz, em `devDependencies`.

Não se fecha nem se dispensa alerta pela API. Esta ADR só registra a decisão.

## Alternativas consideradas

| Alternativa | Por que não |
| --- | --- |
| `pnpm.overrides` do `minimatch` para a 11 só no `typescript-estree` | Força uma versão maior que o `typescript-eslint` não declara; o ganho é só no lint, sem efeito no site |
| Tirar o `typescript-eslint` | Perde as regras de TypeScript no lint de todo o monorepo |

## Consequências

- O risco fica no ambiente de quem desenvolve e no CI, não no site nem no servidor.
- O alerta #5 segue aberto no GitHub. O critério 9 do `docs/MVP.md` conta o alerta como coberto por esta ADR.
- A issue #46 fica com esta ADR como decisão até sair a correção.

## Quando revisar

- Se o `minimatch` passar a aparecer no `pnpm audit --prod`.
- Já existe correção sem versão maior: o `typescript-eslint` 8.73.0 (16/11/2026) aceita o `minimatch` 11. Atualizar no próximo ciclo (#46), quando a versão tiver alguns dias de uso, com `pnpm lint` e o CI verdes. Com isso, esta ADR deixa de ter alerta para cobrir.
- Numa troca da ferramenta de lint.
