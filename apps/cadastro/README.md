# 02 · Cadastro

Clientes em memória ou na API, sem trocar a tela. Tabela e formulário dividem o mesmo espaço, e a origem dos dados muda por um seletor: os componentes só conhecem um contrato de repositório.

Projeto 02 do monorepo `components`. Evolução do projeto cadastro (Next.js + Firebase, com classe `Cliente` e padrão Repository) para React com repositório trocável.

## Rodar

Na raiz do monorepo:

```bash
pnpm install
pnpm dev:cadastro        # só o front (origem Memória funciona sozinha)
pnpm dev:api             # em outro terminal, para a origem API
```

Abre em http://localhost:5172. A origem fica na URL: `/?origem=api`.

## Regras de negócio

- **C1**: nome de 3 a 80 letras, e-mail válido e idade de 0 a 130. A regra está em `@components/contratos` e vale no formulário e na API.
- **C2**: o e-mail é único. O conflito volta como erro do campo e-mail, com o foco nele.
- **C3**: busca por nome ou e-mail (sem diferenciar maiúsculas e acentos) e ordenação por nome, idade ou mais recentes.
- **C4**: excluir pede confirmação e oferece desfazer.
- **C5**: memória e API cumprem o mesmo contrato. A bateria `dados/contrato.ts` roda nas duas implementações (`repositorios.test.ts`).

## Arquitetura

```
Tela (Clientes, TabelaClientes, FormularioCliente)
        │ TanStack Query (cache por origem)
        ▼
RepositorioClientes  ← contrato (dados/repositorio.ts)
   ├── criarRepositorioMemoria   regras em memória
   └── criarRepositorioHttp      camada de serviço: uma função de requisição, erros traduzidos
                                   │ fetch /api/clientes
                                   ▼
                             apps/api (Hono + Drizzle + PGlite)
```

Nos testes, o repositório HTTP recebe `app.request` da API no lugar do `fetch`: a tela é testada contra a API de verdade, com banco em memória, sem abrir porta.

## Conceitos aplicados

| Conceito                           | Onde                                        |
| ---------------------------------- | ------------------------------------------- |
| Padrão Repository + contrato       | `dados/repositorio.ts`, `dados/contrato.ts` |
| Camada de serviço (aprendizado 33) | `dados/repositorioHttp.ts`                  |
| TanStack Query (47, 48)            | `dados/consultas.ts`                        |
| React Hook Form + Zod (51)         | `componentes/FormularioCliente`             |
| URL state (49)                     | origem em `?origem=api`                     |
| `useDeferredValue` (97)            | busca sem travar a digitação                |
| Skeleton (75)                      | linhas de carregamento da tabela            |

## Stack

React 19, TypeScript, Vite, React Router, TanStack Query, React Hook Form, Zod, `@components/contratos`, `@components/ui`, Vitest, Testing Library e axe.
