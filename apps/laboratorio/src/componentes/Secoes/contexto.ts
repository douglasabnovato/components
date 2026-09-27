/*
 * Contexto da aba ativa, lido pelas seções do MDX (Desafio, Conteudo, Solucao)
 * para cada uma decidir se aparece.
 */
import { createContext } from 'react'

export type Aba = 'desafio' | 'conteudo' | 'solucao' | 'assista'

export const AbaContexto = createContext<Aba>('desafio')
/* Fim do contexto da aba. */
