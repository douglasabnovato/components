# ADR 0004 · Servidor de produção único para API e SSR

- **Status:** aceita
- **Data:** 26/10/2026

## Contexto

Duas partes do projeto precisam de servidor: a API (Hono com PGlite), usada pelo Cadastro e pela Tarefas, e o Formulários, que gera as páginas no servidor com o React Router para funcionar sem JavaScript. Cada uma já tinha o próprio modo de rodar em desenvolvimento, mas não havia um processo de produção.

## Decisão

Criar o pacote `apps/servidor`, que **compõe** as peças existentes num único processo Node:

- `/api`: a aplicação Hono de `@components/api`, montada sob o prefixo;
- `/formularios/`: os arquivos do build do cliente e, no restante, o SSR do React Router;
- **modo ensaio** (`--ensaio`): entrega também a pasta `publicar/`, com as mesmas regras do `vercel.json`, para reproduzir no computador o site publicado.

A composição (`src/app.ts`) é separada da inicialização (`src/servidor.ts`), para ser testada sem abrir porta nem disco.

## Alternativas consideradas

| Alternativa | Por que não |
| --- | --- |
| Dois serviços (API e Formulários separados) | Dois serviços gratuitos para manter, cada um hibernando por conta própria |
| `react-router-serve` para o Formulários e a API à parte | Mesmo problema de dois processos; o servidor do React Router não monta a API |
| Reescrever a API como funções da Vercel | O PGlite precisa de um processo contínuo com o banco aberto |

## Consequências

- Um único serviço no Render, com uma porta (`PORT`) e um endereço.
- Nenhuma regra de negócio nova: o servidor só reaproveita código já testado.
- O ensaio local reproduz a produção, o que permitiu validar o T-01 antes do deploy (11 de 11).
- Se o Formulários ou a API precisarem escalar separadamente, a composição pode ser desfeita sem mudar os pacotes.
