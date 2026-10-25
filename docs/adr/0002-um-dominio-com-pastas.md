# ADR 0002 · Um domínio, uma pasta por projeto, API em `/api`

- **Status:** aceita
- **Data:** 24/10/2026 (registro de decisão já presente no código)

## Contexto

O hub precisa levar a 8 filhos, e os filhos precisam voltar ao hub e, em dois casos, consumir a API.

## Decisão

- **Publicado:** um único domínio; hub na raiz e cada filho em `/<slug>/`.
- **Desenvolvimento:** cada projeto na própria porta (5170 a 5178).
- **API:** sempre em `/api` no mesmo domínio; em desenvolvimento, o Vite encaminha para a porta 3333.
- **Fonte única:** `packages/ui/src/utilitarios/ecossistema.ts`.

## Alternativas consideradas

| Alternativa | Por que não |
| --- | --- |
| Um endereço (subdomínio) por projeto | 9 publicações para manter; qualquer uma fora do ar quebra um link do hub; exige CORS |
| Tudo num único app React | Perde a independência e a variedade de stacks, que são o propósito do projeto |

## Consequências

- Links nunca dependem de outro domínio estar no ar.
- Sem CORS no navegador.
- Cada app precisa de `base` no Vite e `basename` no roteador (já implementado).
- Em desenvolvimento, links só funcionam com o projeto de destino rodando (`pnpm dev:tudo`).
