/*
 * Pedido único do módulo das seções de projeto (#34). A pré-carga no tempo
 * ocioso e o React.lazy do App usam a mesma promessa, então o arquivo é
 * pedido uma vez só, mesmo que os dois caminhos chamem.
 */

type ModuloDasSecoes = typeof import('./SecoesProjetos')

let pedido: Promise<ModuloDasSecoes> | undefined

/* Devolve a promessa do módulo das seções, criando-a só na primeira chamada. */
export function pedirSecoes(): Promise<ModuloDasSecoes> {
  pedido ??= import('./SecoesProjetos')
  return pedido
}

/* Prazo máximo de espera pelo tempo ocioso antes de pedir as seções mesmo assim. */
export const PRAZO_OCIOSO_MS = 1500

/* Roda `fazer` no tempo ocioso do navegador (com prazo) ou, sem a API, logo depois. Devolve o cancelamento. */
export function quandoOcioso(fazer: () => void): () => void {
  if (
    typeof window.requestIdleCallback === 'function' &&
    typeof window.cancelIdleCallback === 'function'
  ) {
    const id = window.requestIdleCallback(fazer, { timeout: PRAZO_OCIOSO_MS })
    return () => window.cancelIdleCallback?.(id)
  }
  const id = setTimeout(fazer, 0)
  return () => clearTimeout(id)
}
/* Fim do pedido das seções. */
