/*
 * useSecaoAtiva: observa as seções pelo id e informa qual delas ocupa
 * a faixa central da tela. Usado para o indicador e o acento dinâmico.
 */
import { useEffect, useState } from 'react'

/* Observa os elementos e guarda o id da seção em foco. */
export function useSecaoAtiva(ids: string[]) {
  const [ativa, setAtiva] = useState<string | null>(null)
  const chave = ids.join('|')

  useEffect(() => {
    const alvos = chave
      .split('|')
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
    if (alvos.length === 0) return

    const observador = new IntersectionObserver(
      (entradas) => {
        const visivel = entradas.find((e) => e.isIntersecting)
        if (visivel) setAtiva(visivel.target.id)
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )
    alvos.forEach((alvo) => observador.observe(alvo))
    return () => observador.disconnect()
  }, [chave])

  return ativa
}
/* Fim do useSecaoAtiva. */
