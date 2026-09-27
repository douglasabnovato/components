# 05 · Tarefas

Tarefas com atalhos de teclado e busca por expressão regular. Um único campo cria e busca, como no todo-app original: **Enter** adiciona, **Shift+Enter** busca, **Esc** limpa. Só sai da lista o que já foi concluído.

Projeto 05 do monorepo `components`. Evolução do todo-app (Express + MongoDB + node-restful + Redux clássico) do curso React + Redux da Cod3r, agora com Redux Toolkit, RTK Query e banco SQL na API compartilhada.

## Rodar

Na raiz do monorepo, em dois terminais:

```bash
pnpm dev:api
pnpm dev:tarefas
```

Abre em http://localhost:5175. O Vite encaminha `/api` para a API na porta 3333.

## Regras de negócio

- **T1**: Enter adiciona a tarefa escrita, Shift+Enter usa o mesmo texto como expressão regular de busca, Esc limpa campo e busca.
- **T2**: a busca não diferencia maiúsculas. Padrão inválido mostra o erro e mantém a busca anterior. O trecho encontrado aparece destacado.
- **T3**: excluir só funciona em tarefa concluída. A regra vale na tela (explica o motivo) e na API (responde 409).
- **T4**: concluir é otimista: a caixa muda na hora e volta sozinha se a API falhar.
- **T5**: "Limpar concluídas" remove todas as concluídas de uma vez.
- **T6**: contagens de pendentes e concluídas e o filtro por situação são calculados da lista, nunca guardados.

## Redux, antes e depois

| Antes (todo-app)                                    | Agora                                                         |
| --------------------------------------------------- | ------------------------------------------------------------- |
| `todoReducer` com `switch` e actions à mão          | `createSlice` (`store/interface.ts`) só para o estado da tela |
| `redux-thunk` + `axios` chamando `search()` de novo | RTK Query (`store/api.ts`) com cache e etiquetas              |
| `connect` + `mapStateToProps`                       | `useSeletor` / `useDespacho` tipados                          |
| MongoDB + node-restful                              | API Hono + Drizzle + PGlite (SQL)                             |

Compare com o Flix (01), que resolve o estado do servidor com TanStack Query.

## Estrutura

```
src/
├── store/        store, fatia de interface, API do RTK Query, contexto da API
├── dominio/      regras de exibição (situação, contagem, destaque, atalhos)
├── componentes/  ItemTarefa, estados
├── paginas/      Tarefas
└── testes/       integração contra a API em memória (Hono + PGlite) e axe
```

## Stack

React 19, TypeScript, Vite, Redux Toolkit, RTK Query, React Redux, `@components/contratos`, `@components/ui`, Vitest, Testing Library e axe.
