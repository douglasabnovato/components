/*
 * Endereços usados pelo Flix: em desenvolvimento o hub roda em outra porta;
 * publicado, o hub fica na raiz do mesmo site.
 */
export const URL_HUB = import.meta.env.DEV ? 'http://localhost:5170/#filho-1' : '/#filho-1'
/* Fim dos endereços. */
