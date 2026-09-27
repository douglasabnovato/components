/*
 * Contexto do tema e o hook que o lê. O hook lança um erro claro quando falta
 * o Provider, em vez de devolver undefined em silêncio.
 */
import { createContext, useContext } from 'react'

export type Tema = 'claro' | 'escuro'
export type ValorTema = { tema: Tema; alternar: () => void }

export const TemaContexto = createContext<ValorTema | null>(null)

/* Lê o tema; exige um TemaContexto.Provider acima na árvore. */
export function useTema() {
  const valor = useContext(TemaContexto)
  if (!valor) throw new Error('useTema precisa de um <TemaContexto.Provider> acima dele.')
  return valor
}
/* Fim do contexto do tema. */
