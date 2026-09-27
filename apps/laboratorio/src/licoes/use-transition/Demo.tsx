/*
 * Demo: useTransition. Digitar no filtro é urgente; filtrar 5.000 itens não.
 * A transição mantém o campo fluido e mostra "atualizando" enquanto isso.
 */
import { useState, useTransition } from 'react'
import estilos from '../demo.module.css'

const ITENS = Array.from({ length: 5000 }, (_, i) => `Item ${i + 1}`)

/* Controla o texto do campo (urgente) e o filtro aplicado (transição). */
export default function Demo() {
  const [texto, setTexto] = useState('')
  const [filtro, setFiltro] = useState('')
  const [pendente, iniciarTransicao] = useTransition()
  const visiveis = ITENS.filter((i) => i.includes(filtro))

  return (
    <div className={estilos.caixa}>
      <label className={estilos.campo}>
        Filtrar itens
        <input
          value={texto}
          onChange={(e) => {
            setTexto(e.target.value)
            iniciarTransicao(() => setFiltro(e.target.value))
          }}
        />
      </label>
      <p role="status" className={estilos.suave}>
        {pendente ? 'Atualizando…' : `${visiveis.length} itens`}
      </p>
      <ul
        className={estilos.lista}
        style={{ maxHeight: '12rem', overflow: 'auto', opacity: pendente ? 0.6 : 1 }}
      >
        {visiveis.slice(0, 200).map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </div>
  )
}
/* Fim da demo. */
