/*
 * Demo: useRef. Uma ref aponta para o campo (foco sem estado) e outra guarda
 * quantas vezes o componente renderizou, sem provocar renderização.
 */
import { useEffect, useRef, useState } from 'react'
import estilos from '../demo.module.css'

/* Controla o texto, o foco e a contagem de renderizações. */
export default function Demo() {
  const [texto, setTexto] = useState('')
  const campo = useRef<HTMLInputElement>(null)
  const renderizacoes = useRef(0)
  const [exibido, setExibido] = useState(0)

  useEffect(() => {
    renderizacoes.current += 1
  })

  return (
    <div className={estilos.caixa}>
      <label className={estilos.campo}>
        Nome
        <input ref={campo} value={texto} onChange={(e) => setTexto(e.target.value)} />
      </label>
      <div className={estilos.linha}>
        <button type="button" className={estilos.botao} onClick={() => campo.current?.focus()}>
          Focar o campo
        </button>
        <button
          type="button"
          className={[estilos.botao, estilos.vazado].join(' ')}
          onClick={() => setExibido(renderizacoes.current)}
        >
          Ver renderizações
        </button>
      </div>
      <p className={estilos.suave} aria-live="polite">
        Renderizações contadas até o último clique: {exibido}
      </p>
    </div>
  )
}
/* Fim da demo. */
