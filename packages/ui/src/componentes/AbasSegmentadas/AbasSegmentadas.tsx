/*
 * AbasSegmentadas: abas em pílula no padrão ARIA de tabs, com ativação
 * automática e navegação por setas, Home e End. Funciona sozinha (inicial)
 * ou controlada pelo pai (ativa + aoMudar), por exemplo pela URL.
 */
import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import styles from './AbasSegmentadas.module.css'

export type Aba = {
  id: string
  rotulo: string
  conteudo: ReactNode
}

type Props = {
  abas: Aba[]
  rotulo: string
  inicial?: string
  ativa?: string
  aoMudar?: (id: string) => void
  className?: string
}

/* Controla a aba ativa e liga cada aba ao seu painel. */
export function AbasSegmentadas({
  abas,
  rotulo,
  inicial,
  ativa: controlada,
  aoMudar,
  className,
}: Props) {
  const base = useId()
  const [interna, setAtiva] = useState(inicial ?? abas[0]?.id)
  const ativa = controlada ?? interna
  const refs = useRef<Array<HTMLButtonElement | null>>([])

  /* Ativa uma aba pelo índice e move o foco para ela. */
  function ativar(indice: number) {
    const aba = abas[indice]
    if (!aba) return
    setAtiva(aba.id)
    aoMudar?.(aba.id)
    refs.current[indice]?.focus()
  }

  /* Trata as teclas de navegação do padrão de abas. */
  function aoTeclar(evento: KeyboardEvent, indice: number) {
    const total = abas.length
    const mapa: Record<string, number> = {
      ArrowRight: (indice + 1) % total,
      ArrowLeft: (indice - 1 + total) % total,
      Home: 0,
      End: total - 1,
    }
    const destino = mapa[evento.key]
    if (destino === undefined) return
    evento.preventDefault()
    ativar(destino)
  }

  return (
    <div className={className}>
      <div className={styles.lista} role="tablist" aria-label={rotulo}>
        {abas.map((aba, indice) => {
          const selecionada = aba.id === ativa
          return (
            <button
              key={aba.id}
              ref={(el) => {
                refs.current[indice] = el
              }}
              type="button"
              role="tab"
              id={`${base}-aba-${aba.id}`}
              aria-selected={selecionada}
              aria-controls={`${base}-painel-${aba.id}`}
              tabIndex={selecionada ? 0 : -1}
              className={styles.aba}
              onClick={() => ativar(indice)}
              onKeyDown={(e) => aoTeclar(e, indice)}
            >
              {aba.rotulo}
            </button>
          )
        })}
      </div>
      {abas.map((aba) => (
        <div
          key={aba.id}
          role="tabpanel"
          id={`${base}-painel-${aba.id}`}
          aria-labelledby={`${base}-aba-${aba.id}`}
          hidden={aba.id !== ativa}
          tabIndex={0}
          className={styles.painel}
        >
          {aba.conteudo}
        </div>
      ))}
    </div>
  )
}
/* Fim das AbasSegmentadas. */
