/*
 * Hooks próprios: lógica com estado extraída para reaproveitar. Seguem as
 * duas regras: começam com "use" e só chamam hooks no topo, nunca em if ou loop.
 */
import { useCallback, useState } from 'react'

/* Contador com limites; devolve valor e ações estáveis. */
export function useContador(inicial = 0, { min = -Infinity, max = Infinity } = {}) {
  const [valor, setValor] = useState(inicial)
  const somar = useCallback((n = 1) => setValor((v) => Math.min(max, v + n)), [max])
  const subtrair = useCallback((n = 1) => setValor((v) => Math.max(min, v - n)), [min])
  const reiniciar = useCallback(() => setValor(inicial), [inicial])
  return { valor, somar, subtrair, reiniciar }
}

/* Alterna entre verdadeiro e falso. */
export function useAlternar(inicial = false) {
  const [ligado, setLigado] = useState(inicial)
  const alternar = useCallback(() => setLigado((v) => !v), [])
  return [ligado, alternar] as const
}
/* Fim dos hooks próprios. */
