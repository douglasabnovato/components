/*
 * Regras do jogo da velha como funções puras: vencedor, empate e de quem é a vez.
 */
export type Casa = 'X' | 'O' | null

const LINHAS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
] as const

/* Devolve o vencedor e a linha vencedora, ou null. */
export function vencedor(casas: Casa[]) {
  for (const [a, b, c] of LINHAS) {
    const valor = casas[a]
    if (valor && valor === casas[b] && valor === casas[c])
      return { jogador: valor, linha: [a, b, c] }
  }
  return null
}

/* De quem é a vez pelo número da jogada. */
export function vezDe(jogada: number): 'X' | 'O' {
  return jogada % 2 === 0 ? 'X' : 'O'
}

/* Empate: tabuleiro cheio sem vencedor. */
export function empate(casas: Casa[]) {
  return !vencedor(casas) && casas.every(Boolean)
}
/* Fim das regras. */
