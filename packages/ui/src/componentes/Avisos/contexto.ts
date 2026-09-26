/*
 * Contexto e hook dos avisos temporários (toasts). Separado do provedor
 * para que o arquivo de componente exporte apenas componentes.
 */
import { createContext, useContext } from 'react'

export type Aviso = {
  mensagem: string
  acao?: { rotulo: string; executar: () => void }
  duracao?: number
}

export const AvisosContexto = createContext<((aviso: Aviso) => void) | null>(null)

/* Devolve a função que mostra um aviso; exige o ProvedorAvisos acima. */
export function useAvisos() {
  const mostrar = useContext(AvisosContexto)
  if (!mostrar) throw new Error('useAvisos precisa de um <ProvedorAvisos>')
  return mostrar
}
/* Fim do contexto de avisos. */
