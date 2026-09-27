# 06 · Lista da Pelada

Cada jogo tem limite de vagas, lista de confirmados, lista de espera e um organizador identificado pelo perfil do GitHub. Com a lista fechada, o sorteio monta times equilibrados pelo nível de cada jogador.

Projeto 06 do monorepo `components`. Evolução do to-do-list da trilha Especializar (Rocketseat Discover), reescrito com hooks puros: sem biblioteca de estado nem de formulário.

## Rodar

Na raiz do monorepo:

```bash
pnpm install
pnpm dev:pelada
```

Abre em http://localhost:5176.

## Telas

| Rota        | Tela                                                                                                     |
| ----------- | -------------------------------------------------------------------------------------------------------- |
| `/`         | Organizador (GitHub), próximos jogos com vagas e jogos encerrados                                        |
| `/novo`     | Formulário do novo jogo: nome, modalidade, data, local, vagas e jogadores por time                       |
| `/jogo/:id` | Confirmar presença, confirmados, espera, sorteio dos times, copiar a lista e excluir o jogo com desfazer |

## Regras de negócio

- **P1**: o nome tem de 2 a 40 letras e não se repete no mesmo jogo (sem diferenciar maiúsculas, acentos e espaços).
- **P2**: com vaga, a pessoa entra nos confirmados. Com a lista cheia, entra na espera, por ordem de chegada.
- **P3**: quando um confirmado sai, o primeiro da espera sobe sozinho para a vaga.
- **P4**: sair da espera não mexe nos confirmados.
- **P5**: o sorteio forma quantos times completos couberem (mínimo 2). Quem confirmou por último fica de reserva. Os níveis são distribuídos em serpente (A, B, B, A…) para as forças ficarem próximas.
- **P6**: a lista pode ser copiada num texto pronto para o grupo, com confirmados, vagas abertas e espera.
- **P7**: qualquer mudança na lista apaga o sorteio anterior.
- **P8**: a situação do jogo (aberto, lotado ou encerrado) é calculada pela data e pelas vagas, nunca guardada.

As regras ficam em `src/dominio/pelada.ts` como funções puras, com testes em `pelada.test.ts`.

## Hooks aplicados

| Hook         | Onde                                                                                        |
| ------------ | ------------------------------------------------------------------------------------------- |
| `useReducer` | `dados/estado.ts`: criar, atualizar, excluir, restaurar e trocar o organizador              |
| `useEffect`  | grava o estado no localStorage a cada mudança; busca o perfil do GitHub com AbortController |
| `useContext` | `PeladaContexto` entrega estado, despacho, relógio e gerador de ids                         |
| `useRef`     | foco no campo de nome depois de confirmar e no primeiro campo com erro                      |
| `useMemo`    | valor do contexto recriado só quando o estado muda                                          |
| Hook próprio | `usePeladaPersistente` e `usePerfilGithub` ("carregando" é derivado, não guardado)          |

## Estrutura

```
src/
├── dominio/      tipos (Zod), regras da pelada, jogos iniciais, API pública para o hub
├── dados/        reducer + persistência, perfil do GitHub
├── componentes/  Layout, Organizador, ListaJogadores, Times, estados
├── paginas/      Início, NovoJogo, Jogo, NaoEncontrado
└── testes/       setup e testes de integração com axe (fetch do GitHub simulado)
```

## Stack

React 19, TypeScript, Vite, React Router, Zod, CSS Modules, `@components/ui`, API pública do GitHub, Vitest, Testing Library e axe.

Os dados ficam no navegador, na chave `components:pelada:estado:v1`.
