/*
 * Cálculo caro de propósito: primos até um limite, contando quantas vezes
 * a função rodou e quantas vezes a lista renderizou (para a demo mostrar o
 * que useMemo, useCallback e memo evitam).
 */
export const medidas = { calculos: 0, renderizacoesDaLista: 0 }

/* Lista os primos até o limite pelo crivo de Eratóstenes. */
export function primosAte(limite: number) {
  medidas.calculos += 1
  const crivo = new Array<boolean>(limite + 1).fill(true)
  crivo[0] = false
  crivo[1] = false
  for (let i = 2; i * i <= limite; i++) {
    if (crivo[i]) for (let j = i * i; j <= limite; j += i) crivo[j] = false
  }
  return crivo.flatMap((primo, n) => (primo ? [n] : []))
}
/* Fim do cálculo. */
