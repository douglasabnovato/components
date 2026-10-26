# ADR 0001 · pnpm e monorepo

- **Status:** aceita
- **Data:** 24/10/2026 (registro de decisão já existente no projeto)

## Contexto

O projeto reúne 9 aplicações, uma API e 3 pacotes compartilhados, que precisam usar as mesmas versões de React, TypeScript, Vite e ferramentas de teste.

## Decisão

Monorepo com **pnpm workspaces**, usando:

- **catálogo de versões** (`catalog:`) no `pnpm-workspace.yaml`;
- protocolo `workspace:*` para pacotes internos;
- `engineStrict: true` para barrar instalação em Node incompatível.

## Alternativas consideradas

| Alternativa | Por que não |
| --- | --- |
| npm workspaces | Não tem catálogo de versões nem execução paralela nativa |
| Repositórios separados | Duplicação de configuração e versões divergentes |
| Turborepo ou Nx | Úteis para cache de build em escala; desnecessários no tamanho atual |

## Consequências

- Uma instalação para todo o projeto e versões garantidamente iguais.
- Dependências estritas: cada pacote só enxerga o que declara.
- Exige pnpm instalado (os demais projetos pessoais podem continuar com npm).
