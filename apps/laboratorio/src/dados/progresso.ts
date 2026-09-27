/*
 * Progresso por lição: ids concluídos no localStorage, lidos pelo React como
 * loja externa (useSyncExternalStore) e sincronizados entre abas.
 */
import { useSyncExternalStore } from 'react'
import { z } from 'zod'

export const CHAVE = 'components:laboratorio:concluidas:v1'
const esquema = z.array(z.string())
const ouvintes = new Set<() => void>()
let cache: { texto: string | null; valor: string[] } = { texto: null, valor: [] }

/* Lê do navegador, reaproveitando o último valor se o texto não mudou. */
function ler(): string[] {
  const texto = window.localStorage.getItem(CHAVE)
  if (texto === cache.texto) return cache.valor
  let valor: string[] = []
  try {
    const r = esquema.safeParse(JSON.parse(texto ?? '[]'))
    valor = r.success ? r.data : []
  } catch {
    valor = []
  }
  cache = { texto, valor }
  return valor
}

/* Avisa quem estiver ouvindo, nesta aba e (pelo evento storage) nas outras. */
function assinar(aviso: () => void) {
  ouvintes.add(aviso)
  window.addEventListener('storage', aviso)
  return () => {
    ouvintes.delete(aviso)
    window.removeEventListener('storage', aviso)
  }
}

/* Marca ou desmarca uma lição como concluída. */
export function alternarConcluida(id: string) {
  const atual = ler()
  const novo = atual.includes(id) ? atual.filter((i) => i !== id) : [...atual, id]
  window.localStorage.setItem(CHAVE, JSON.stringify(novo))
  ouvintes.forEach((aviso) => aviso())
}

/* Lista de lições concluídas, reativa. */
export function useConcluidas() {
  return useSyncExternalStore(assinar, ler, () => [])
}
/* Fim do progresso. */
