/*
 * Onde cada tecnologia da stack é aplicada no monorepo components. Liga a
 * teoria (vídeos) à prática (projetos filhos). "todos" vale para o ecossistema
 * inteiro; tecnologias sem entrada ficam só na teoria.
 */
import { ecossistema, type ProjetoEcossistema } from '@components/ui'
import type { Tecnologia } from './tipos'

type Aplicacao = number[] | 'todos'

export const aplicacoes: Record<number, Aplicacao> = {
  1: 'todos',
  2: 'todos',
  3: 'todos',
  4: 'todos',
  6: 'todos',
  8: 'todos',
  12: 'todos',
  14: 'todos',
  15: [6, 7, 8],
  16: [6, 7],
  17: [6, 7, 8],
  18: [7],
  19: [2, 6, 8],
  20: [7],
  21: [7],
  22: [4, 5, 6, 7],
  23: [7],
  24: [1, 5, 6, 7, 8],
  25: [7],
  26: [2, 7],
  27: [7],
  28: [7],
  29: 'todos',
  33: [3],
  38: [0, 3],
  39: 'todos',
  40: [0],
  41: [2, 5, 6],
  42: 'todos',
  43: [1, 2, 3, 4, 5, 6, 7, 8],
  46: [2, 5],
  47: [2, 6],
  51: [1, 2],
  52: [5],
  53: [2, 5],
  54: [6, 8],
  55: [5],
  58: [1, 2, 3, 7, 8],
  60: [1, 2],
  61: 'todos',
  62: [2, 4, 5],
  63: [2, 5],
  72: [4],
  75: [4],
  77: [4],
  83: 'todos',
  84: 'todos',
  85: [1, 2, 5],
  86: [2, 5],
  87: 'todos',
  88: [6, 7, 8],
  89: [7],
  90: [1, 2, 5],
  93: 'todos',
}

export const detalhes: Record<number, string> = {
  8: 'O monorepo usa pnpm workspaces, com uma única instalação na raiz.',
  42: 'O pacote @components/ui reúne tokens e componentes usados por todos os projetos.',
  53: 'O pacote @components/contratos compartilha os esquemas Zod entre front e API.',
  62: 'A API compartilhada (apps/api) roda em Node com Hono.',
  63: 'A API usa SQL relacional com PGlite (Postgres em WebAssembly) e Drizzle.',
  75: 'O projeto 04 usa as actions do React Router: a mesma ideia das Server Actions.',
  77: 'O projeto 04 roda no modo framework do React Router, herdeiro do Remix.',
  88: 'O BotaoPilula do @components/ui aceita comoFilho: empresta o visual a um Link do React Router.',
  93: 'Todo projeto tem Vitest, Testing Library e axe; o 04 tem Playwright com JavaScript desligado.',
}

/* Projetos do ecossistema onde a tecnologia é aplicada (vazio = só teoria). */
export function projetosDaTecnologia(tecnologia: Pick<Tecnologia, 'numero'>): {
  todos: boolean
  projetos: ProjetoEcossistema[]
} {
  const aplicacao = aplicacoes[tecnologia.numero]
  if (!aplicacao) return { todos: false, projetos: [] }
  if (aplicacao === 'todos') return { todos: true, projetos: [] }
  return { todos: false, projetos: ecossistema.filter((p) => aplicacao.includes(p.numero)) }
}
/* Fim das aplicações. */
