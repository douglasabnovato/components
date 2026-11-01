# Revisão independente · 04 · Testes automatizados

_27/10/2026. Estratégia completa em [docs/03 · Plano de testes](../03-plano-de-testes.md). Este documento explica o script [`verificar.ps1`](verificar.ps1), que roda no Windows os mesmos comandos do CI (`.github/workflows/ci.yml`)._

## Como rodar

Na raiz do repositório, em PowerShell:

```powershell
powershell -ExecutionPolicy Bypass -File docs\claudeia\verificar.ps1
```

| Opção | Efeito |
| --- | --- |
| (nenhuma) | Instalação, verificação, Chromium, T-01 em desenvolvimento e e2e do Formulários |
| `-Ensaio` | Também monta `publicar/`, pede para subir `pnpm ensaio:producao` em outro terminal e roda o T-01 contra `http://localhost:3333/` |
| `-UrlBase <url>` | Roda o T-01 contra o endereço informado (por exemplo, o site publicado) |

O script para no primeiro erro, devolve o código de saída do comando que falhou e limpa a variável `URL_BASE` ao terminar.

## Etapas

| # | Etapa | Comando | O que prova | Tempo (estimativa) |
| --- | --- | --- | --- | --- |
| 1 | Ambiente | `node --version`, `pnpm --version` | Versões esperadas (24.22.1 e 10.28.0) | segundos |
| 2 | Instalação | `pnpm install --frozen-lockfile` | Lockfile coerente, igual ao CI e aos provedores | 1 a 3 min |
| 3 | Verificação | `pnpm verificar` | Lint, tipos, 46 arquivos de teste e build de todos os projetos | 3 a 6 min |
| 4 | Navegador | `pnpm --filter @components/testes-e2e exec playwright install chromium` | Chromium disponível (o CI usa `--with-deps`, desnecessário no Windows) | 1 min na primeira vez |
| 5 | T-01 | `pnpm test:navegacao` | Hub ↔ 8 filhos sem erro de console (11 casos) | ~2 min (docs/01: 1,9 min) |
| 6 | e2e do Formulários | `pnpm test:e2e` | Envio com e sem JavaScript no SSR (porta 4174) | 1 a 2 min |
| 7 | Ensaio (opcional) | `pnpm montar:publicacao` + `pnpm ensaio:producao` + T-01 com `URL_BASE` | O site montado se comporta como o publicado (docs/01: 26 s) | 1 min |
| 8 | Produção (opcional) | T-01 com `URL_BASE=https://components-dusky-nine.vercel.app/` | Fumaça T-05 (A-11). Só fará sentido verde depois do A-38/A-09 | 1 a 2 min |

## O que observar

| Situação | Causa provável | Ação |
| --- | --- | --- |
| Etapa 2 falha com `ERR_PNPM_OUTDATED_LOCKFILE` | Lockfile desatualizado | `pnpm install` e commit do lockfile |
| Etapa 3 falha no lint de `apps/hub/vite.config.ts` | Improvável: a mudança foi só de indentação | Comparar com a versão anterior |
| Etapa 5 com porta ocupada | Outro `pnpm dev` rodando | Fechar ou reaproveitar (o T-01 reaproveita servidores já de pé) |
| Etapa 7 com porta 3333 ocupada | `pnpm dev:api` ligado | Parar a API ou usar `PORT` |
| Etapa 8 falha só no Formulários | Render fora do ar (A-38) | Esperado até o A-09 |

## Lacunas de automação (propostas)

| Lacuna | Item |
| --- | --- |
| Clicáveis dentro dos filhos | A-12 (existente) |
| Memória da subida do servidor | A-39 |
| Formatação no CI | A-43 |
| Lint de `.mjs` | A-44 |
| axe nas páginas | A-32 (existente) |
