/*
 * Endereços usados pelo Laboratório: o hub (seção 07) e a Trilha (projeto 08),
 * para a aba "Assista" abrir o vídeo certo.
 */
import { enderecoDoHub, enderecoDoProjeto } from '@components/ui'

export const URL_HUB = enderecoDoHub(7)

/* Página de um aprendizado na Trilha React. */
export function urlDoAprendizado(numero: number) {
  return enderecoDoProjeto(8, `aprendizado/${numero}`)
}
/* Fim dos endereços. */
