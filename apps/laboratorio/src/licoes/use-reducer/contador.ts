/*
 * Reducer do contador: todas as regras de mudança num só lugar, como uma
 * função pura (estado, ação) → novo estado.
 */
export type Estado = { valor: number; historico: number[] }

export type Acao =
  | { tipo: 'somar'; quanto: number }
  | { tipo: 'multiplicar'; fator: number }
  | { tipo: 'desfazer' }
  | { tipo: 'zerar' }

export const inicial: Estado = { valor: 0, historico: [] }

/* Aplica a ação e guarda o valor anterior para desfazer. */
export function reducer(estado: Estado, acao: Acao): Estado {
  switch (acao.tipo) {
    case 'somar':
      return { valor: estado.valor + acao.quanto, historico: [...estado.historico, estado.valor] }
    case 'multiplicar':
      return { valor: estado.valor * acao.fator, historico: [...estado.historico, estado.valor] }
    case 'desfazer': {
      const anterior = estado.historico.at(-1)
      return anterior === undefined
        ? estado
        : { valor: anterior, historico: estado.historico.slice(0, -1) }
    }
    case 'zerar':
      return inicial
  }
}
/* Fim do reducer. */
