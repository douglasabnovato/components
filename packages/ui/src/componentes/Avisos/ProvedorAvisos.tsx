/*
 * ProvedorAvisos: mostra avisos temporários no canto da tela, anunciados a
 * leitores de tela, com ação opcional (ex.: "Desfazer"). Um aviso por vez.
 */
import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { AvisosContexto, type Aviso } from './contexto'
import styles from './Avisos.module.css'

type AvisoAtivo = Aviso & { id: number }

/* Guarda o aviso atual e o remove quando o tempo acaba. */
export function ProvedorAvisos({ children }: { children: ReactNode }) {
  const [aviso, setAviso] = useState<AvisoAtivo | null>(null)

  /* Substitui o aviso atual por um novo. */
  const mostrar = useCallback((novo: Aviso) => {
    setAviso({ ...novo, id: Date.now() })
  }, [])

  useEffect(() => {
    if (!aviso) return
    const tempo = window.setTimeout(() => setAviso(null), aviso.duracao ?? 6000)
    return () => window.clearTimeout(tempo)
  }, [aviso])

  return (
    <AvisosContexto.Provider value={mostrar}>
      {children}
      <div className={styles.regiao} role="status" aria-live="polite">
        {aviso ? (
          <div key={aviso.id} className={styles.aviso}>
            <span>{aviso.mensagem}</span>
            {aviso.acao ? (
              <button
                type="button"
                className={styles.acao}
                onClick={() => {
                  aviso.acao?.executar()
                  setAviso(null)
                }}
              >
                {aviso.acao.rotulo}
              </button>
            ) : null}
            <button
              type="button"
              className={styles.fechar}
              aria-label="Fechar aviso"
              onClick={() => setAviso(null)}
            >
              ×
            </button>
          </div>
        ) : null}
      </div>
    </AvisosContexto.Provider>
  )
}
/* Fim do ProvedorAvisos. */
