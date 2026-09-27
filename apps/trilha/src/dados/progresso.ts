/*
 * Armazém do progresso da Trilha (R5): aprendizados assistidos e anotações no
 * localStorage, numa chave exclusiva. É uma "loja externa" lida pelo React com
 * useSyncExternalStore, e sincroniza entre abas pelo evento storage.
 */
import { createContext, useContext, useMemo, useSyncExternalStore } from 'react'
import { esquemaProgresso, type Progresso } from '../dominio/tipos'

export const CHAVE_PROGRESSO = 'components:trilha:progresso:v1'

const vazio: Progresso = { versao: 1, assistidos: [], notas: {} }

export type ArmazemProgresso = {
  ler(): Progresso
  assinar(aviso: () => void): () => void
  alternarAssistido(numero: number): void
  salvarNota(numero: number, texto: string): void
  reiniciar(): void
}

/* Converte o texto salvo em progresso válido; dados corrompidos viram vazio. */
export function lerProgresso(texto: string | null): Progresso {
  if (!texto) return vazio
  try {
    const resultado = esquemaProgresso.safeParse(JSON.parse(texto))
    return resultado.success ? resultado.data : vazio
  } catch {
    return vazio
  }
}

/* Cria o armazém sobre um Storage (injetável nos testes). */
export function criarArmazemProgresso(
  armazenamento: Storage = window.localStorage,
): ArmazemProgresso {
  let atual = lerProgresso(armazenamento.getItem(CHAVE_PROGRESSO))
  const ouvintes = new Set<() => void>()

  /* Grava, atualiza a cópia em memória e avisa quem está ouvindo. */
  function gravar(novo: Progresso) {
    atual = novo
    armazenamento.setItem(CHAVE_PROGRESSO, JSON.stringify(novo))
    ouvintes.forEach((aviso) => aviso())
  }

  /* Recarrega quando outra aba altera a mesma chave. */
  function aoMudarEmOutraAba(evento: StorageEvent) {
    if (evento.key !== CHAVE_PROGRESSO) return
    atual = lerProgresso(evento.newValue)
    ouvintes.forEach((aviso) => aviso())
  }

  return {
    ler: () => atual,
    assinar(aviso) {
      ouvintes.add(aviso)
      if (ouvintes.size === 1) window.addEventListener('storage', aoMudarEmOutraAba)
      return () => {
        ouvintes.delete(aviso)
        if (ouvintes.size === 0) window.removeEventListener('storage', aoMudarEmOutraAba)
      }
    },
    alternarAssistido(numero) {
      const lista = atual.assistidos.includes(numero)
        ? atual.assistidos.filter((n) => n !== numero)
        : [...atual.assistidos, numero].sort((a, b) => a - b)
      gravar({ ...atual, assistidos: lista })
    },
    salvarNota(numero, texto) {
      const notas = { ...atual.notas }
      if (texto.trim()) notas[String(numero)] = texto
      else delete notas[String(numero)]
      gravar({ ...atual, notas })
    },
    reiniciar() {
      gravar(vazio)
    },
  }
}

export const ProgressoContexto = createContext<ArmazemProgresso | null>(null)

/* Devolve o armazém configurado no App. */
export function useArmazem() {
  const armazem = useContext(ProgressoContexto)
  if (!armazem) throw new Error('useArmazem precisa de um ProgressoContexto.Provider')
  return armazem
}

/* Lê o progresso atual e renderiza de novo quando ele muda. */
export function useProgresso() {
  const armazem = useArmazem()
  const progresso = useSyncExternalStore(armazem.assinar, armazem.ler, () => vazio)
  return { progresso, armazem }
}

/* Conjunto dos assistidos, recriado só quando a lista muda (useMemo). */
export function useAssistidos(): ReadonlySet<number> {
  const { progresso } = useProgresso()
  return useMemo(() => new Set(progresso.assistidos), [progresso.assistidos])
}
/* Fim do armazém de progresso. */
