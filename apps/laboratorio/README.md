# 07 · Laboratório

Lições de React em três tempos: **desafio, conteúdo e solução**. Cada lição começa por um problema real, explica o conceito e termina com o processo de solução em etapas numeradas, com a demo rodando ao lado do código e do teste que a garantem. A aba **Assista** liga a lição aos vídeos da Trilha React (projeto 08).

Projeto 07 do monorepo `components`. Reorganização do projeto components original (React Fundamentals, Hooks Handbook, Hooks Coder, React Docs, Interval Number, Jogo da Velha) em lições independentes.

## Rodar

Na raiz do monorepo:

```bash
pnpm install
pnpm dev:laboratorio
```

Abre em http://localhost:5177. Cada lição tem endereço próprio e a aba fica na URL: `/licao/use-effect?aba=solucao`.

## Lições

| Módulo           | Lições                                                                                                                |
| ---------------- | --------------------------------------------------------------------------------------------------------------------- |
| Fundamentos      | Componentes e props · Renderização condicional · Listas e keys · Comunicação · Formulário controlado e estado elevado |
| Hooks            | useState · useEffect · useRef · useMemo, useCallback e memo · useReducer · useContext · Hooks próprios e regras       |
| React 18 e 19    | Ref como prop e useImperativeHandle · useActionState e useFormStatus · useTransition                                  |
| Projetos guiados | Jogo da velha com histórico · Componentes de classe (histórico)                                                       |

## Como uma lição é montada

```
src/licoes/use-effect/
├── texto.mdx        <Desafio>, <Conteudo> e <Solucao> (etapas numeradas)
├── Demo.tsx         a solução rodando
└── demo.test.tsx    o teste da solução
```

`src/licoes/indice.ts` importa a demo como componente e **o mesmo arquivo** como texto (`Demo.tsx?raw`), junto com o teste. O código mostrado na tela é exatamente o que roda e o que é testado: não existe cópia para ficar desatualizada.

O MDX usa três componentes de seção (`componentes/Secoes`). Cada aba fornece o seu nome por contexto e cada seção só aparece na aba dela; assim um único arquivo guarda os três tempos.

## Regras de negócio

- **L1**: toda lição tem desafio, conteúdo, solução em etapas, demo, código e teste.
- **L2**: a aba ativa fica na URL; abrir o link cai direto na aba certa.
- **L3**: toda lição aponta para aprendizados que existem na Trilha (testado).
- **L4**: o progresso (lições concluídas) fica no navegador, na chave `components:laboratorio:concluidas:v1`.

## Estrutura

```
src/
├── licoes/       17 lições (MDX + demo + teste), tipos, estilos das demos e índice
├── dados/        progresso e API pública para o hub
├── componentes/  Layout, Secoes (MDX), Codigo
├── paginas/      Índice, Lição, NaoEncontrado
└── testes/       integração do app com axe
```

## Stack

React 19, TypeScript, Vite, MDX (com remark-gfm), React Router, `@components/ui`, `@components/trilha`, Vitest, Testing Library e axe.
