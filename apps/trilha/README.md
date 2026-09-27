# 08 · Trilha React

Curadoria de 116 vídeos públicos do YouTube em 12 módulos, do primeiro componente ao React 19, Next.js e IA. Você marca o que assistiu, anota o que aprendeu e vê em qual projeto do hub cada tecnologia está funcionando.

Projeto 08 do monorepo `components`.

## Rodar

Na raiz do monorepo:

```bash
pnpm install
pnpm dev:trilha
```

Abre em http://localhost:5178.

## Telas

| Rota                   | Tela                                                                                                                      |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `/`                    | Progresso geral, "Começar/Continuar", filtros (módulo, situação, busca, históricos) e os 12 módulos com seus aprendizados |
| `/aprendizado/:numero` | Player leve, marcar como assistido, anotações, tecnologias do vídeo, projetos do hub para praticar, anterior e próximo    |
| `/stack`               | As 93 tecnologias em 13 categorias, com status, aprendizados, onde são aplicadas no hub e a lacuna da trilha              |

## Regras de negócio

- **R1**: a trilha vai de 1 a 116, sem buracos nem vídeos repetidos. Cada módulo tem 10 aprendizados e o último tem 6. Toda tecnologia aponta para aprendizados que existem.
- **R2**: a duração é guardada como no texto original ("46 min", "2h34"). Minutos, totais por módulo, tempo restante e percentuais são calculados a cada renderização (estado derivado, aprendizado 14).
- **R3**: "Continuar" leva ao primeiro aprendizado não assistido, na ordem da trilha.
- **R4**: os filtros ficam na URL (URL state, aprendizado 49). O link filtrado pode ser compartilhado e sobrevive ao recarregar a página.
- **R5**: o progresso e as anotações ficam no navegador, na chave `components:trilha:progresso:v1`, e sincronizam entre abas.

As regras ficam em `src/dominio/` como funções puras, com testes em `trilha.test.ts`.

## Conceitos da trilha aplicados aqui

| Conceito                    | Onde                                                                            |
| --------------------------- | ------------------------------------------------------------------------------- |
| Estado derivado (14)        | `dominio/trilha.ts`: `resumir`, `proximoPendente`                               |
| URL state (49)              | `dominio/filtros.ts` e `componentes/PainelFiltros`                              |
| Custom hook + loja externa  | `dados/progresso.ts`: `useSyncExternalStore`, `useProgresso`, `useAssistidos`   |
| useMemo (10, 55)            | `useAssistidos`: o conjunto só é recriado quando a lista muda                   |
| Composição polimórfica (54) | `BotaoPilula comoFilho` do `@components/ui` envolvendo o `Link` do React Router |

## Estrutura

```
src/
├── dados/        conteúdo da trilha e da stack, armazém de progresso
├── dominio/      tipos (Zod), duração, regras da trilha, filtros, stack, aplicações no hub
├── componentes/  Layout, BarraProgresso, Player, LinhaAprendizado, PainelFiltros, SeloStatus
├── paginas/      Início, Aprendizado, Stack, NaoEncontrado
└── testes/       setup e testes de integração com axe
```

## Stack

React 19, TypeScript, Vite, React Router, Zod, CSS Modules, `@components/ui`, Vitest, Testing Library e axe.

## Créditos

Os vídeos pertencem aos seus canais e são exibidos pelo player oficial do YouTube, sem cookies, só depois do clique. Descrições e organização são da curadoria.
