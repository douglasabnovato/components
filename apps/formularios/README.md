# 04 · Formulários no Servidor

Formulários que funcionam até sem JavaScript. O servidor lê, valida e responde; no navegador, o JavaScript só melhora a experiência (envio sem recarregar, botão "Enviando…", foco no resumo de erros), nunca é requisito.

Projeto 04 do monorepo `components`. Releitura do node-ejs-forms (Express + EJS, trilha Discover da Rocketseat) com React Router em modo framework, renderizando no servidor (SSR).

## Rodar

Na raiz do monorepo:

```bash
pnpm install
pnpm dev:formularios
```

Abre em http://localhost:5174/formularios/. Diferente dos outros filhos, este precisa de um **servidor Node** também em produção:

```bash
pnpm --filter @components/formularios build
pnpm --filter @components/formularios start     # porta 3000 (ou PORT=4174)
```

## Telas

| Rota               | Tela                                                                    |
| ------------------ | ----------------------------------------------------------------------- |
| `/`                | Início: princípios e total de mensagens, vindos do loader               |
| `/sobre`           | Do EJS ao React Router, peça por peça                                   |
| `/contato`         | Formulário com action no mesmo módulo, erros por campo e resumo no topo |
| `/contato/enviado` | Confirmação com protocolo (post, redirect, get)                         |
| `/mensagens`       | Caixa do servidor, com botão para esvaziar (também um POST)             |
| qualquer outra     | 404 dentro do layout (ErrorBoundary da raiz)                            |

## Regras de negócio

- **F1**: a validação acontece na action, no servidor, com um esquema Zod. Com ou sem JavaScript, o resultado é o mesmo.
- **F2**: cada erro aparece ao lado do campo (`aria-invalid` e `aria-describedby`), com um resumo no topo que leva até ele.
- **F3**: depois de salvar, o servidor redireciona para a confirmação. Recarregar não reenvia (post, redirect, get).
- **F4**: um campo-armadilha escondido barra robôs: a resposta parece sucesso, mas nada é guardado.
- **F5**: as mensagens ficam na memória do servidor e somem quando ele reinicia.

## Testes

| Tipo                  | Onde                      | O que prova                                                   |
| --------------------- | ------------------------- | ------------------------------------------------------------- |
| Servidor (Vitest)     | `testes/servidor.test.ts` | regras, action (400/302), armadilha de robô e loaders         |
| Tela (Vitest + jsdom) | `testes/telas.test.tsx`   | caminho com JavaScript via `createRoutesStub`, foco e axe     |
| Ponta a ponta         | `e2e/formularios.spec.ts` | o mesmo roteiro **com e sem JavaScript** no build de produção |

O Playwright precisa do Chromium: `pnpm --filter @components/formularios exec playwright install chromium`, depois `pnpm --filter @components/formularios test:e2e`.

## Do EJS ao React Router

| Antes                                  | Agora                                              |
| -------------------------------------- | -------------------------------------------------- |
| `app.get('/home', ...)` + `res.render` | módulo de rota com `loader` e componente           |
| `<%- include('../partials/head') %>`   | `Layout` da raiz com `<Meta />` e `<Links />`      |
| `items.forEach` no template            | `map` no componente, com tipos gerados             |
| `<form method="post">` + `app.post`    | `<Form method="post">` + `action` no mesmo arquivo |

## Estrutura

```
app/
├── root.tsx       documento, casca, indicador de modo e ErrorBoundary
├── routes.ts      mapa de rotas
├── routes/        inicio, sobre, contato, enviado, mensagens, nao-encontrado
├── dominio/       contato (Zod), mensagens.server (memória), princípios
└── estilos/       tema editorial
testes/            servidor e telas (Vitest)
e2e/               Playwright com e sem JavaScript
```

## Stack

React 19, React Router 8 (modo framework, SSR), `@react-router/node` e `@react-router/serve`, Zod, `@components/ui`, Vitest, Testing Library, axe e Playwright.
