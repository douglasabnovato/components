/*
 * useMovimentoReduzido: acompanha a preferência do sistema
 * "prefers-reduced-motion" e reage quando ela muda.
 */
import { useSyncExternalStore } from 'react'

const consulta = '(prefers-reduced-motion: reduce)'

/* Inscreve o React nas mudanças da media query. */
function inscrever(aviso: () => void) {
  const mq = window.matchMedia(consulta)
  mq.addEventListener('change', aviso)
  return () => mq.removeEventListener('change', aviso)
}

/* Devolve true quando o usuário pediu menos movimento. */
export function useMovimentoReduzido() {
  return useSyncExternalStore(
    inscrever,
    () => window.matchMedia(consulta).matches,
    () => false,
  )
}
/* Fim do useMovimentoReduzido. */
