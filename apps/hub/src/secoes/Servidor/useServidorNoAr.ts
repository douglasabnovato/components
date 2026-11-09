/*
 * useServidorNoAr: no site publicado, consulta /api/saude do servidor que
 * entrega o Formulários (#37). Sem resposta no prazo da API, com status de
 * fora do ar ou com corpo inesperado, devolve "fora". Em desenvolvimento o
 * hub não tem /api (cada filho roda na sua porta), então não consulta.
 */
import { PRAZO_API_MS } from '@components/ui'
import { useEffect, useState } from 'react'

export type EstadoServidor = 'verificando' | 'no-ar' | 'fora'

/* Devolve o estado do servidor; `ativo` liga a consulta (padrão: build de produção). */
export function useServidorNoAr(ativo: boolean = import.meta.env.PROD): EstadoServidor {
  const [estado, setEstado] = useState<EstadoServidor>(ativo ? 'verificando' : 'no-ar')

  useEffect(() => {
    if (!ativo) return
    const controle = new AbortController()
    const prazo = setTimeout(() => controle.abort(), PRAZO_API_MS)
    fetch('/api/saude', { signal: controle.signal, headers: { Accept: 'application/json' } })
      .then(async (resposta) => {
        const corpo: unknown = resposta.ok ? await resposta.json() : null
        const ok = typeof corpo === 'object' && corpo !== null && 'ok' in corpo && corpo.ok === true
        setEstado(ok ? 'no-ar' : 'fora')
      })
      .catch(() => {
        if (controle.signal.reason !== 'desmontado') setEstado('fora')
      })
      .finally(() => clearTimeout(prazo))
    return () => {
      clearTimeout(prazo)
      controle.abort('desmontado')
    }
  }, [ativo])

  return estado
}
/* Fim do useServidorNoAr. */
