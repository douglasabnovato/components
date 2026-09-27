/*
 * Demo: useState. Um contador com passo configurável: cada setter agenda uma
 * nova renderização com o valor novo.
 */
import { useState } from 'react'
import estilos from '../demo.module.css'

/* Controla contagem e passo. */
export default function Demo() {
  const [contagem, setContagem] = useState(0)
  const [passo, setPasso] = useState(1)

  return (
    <div className={estilos.caixa}>
      <p className={estilos.numero} aria-live="polite" aria-label={`Contagem: ${contagem}`}>
        {contagem}
      </p>
      <label className={estilos.campo}>
        Passo
        <select value={passo} onChange={(e) => setPasso(Number(e.target.value))}>
          {[1, 2, 5, 10].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </label>
      <div className={estilos.linha}>
        <button
          type="button"
          className={estilos.botao}
          onClick={() => setContagem((c) => c - passo)}
        >
          Diminuir
        </button>
        <button
          type="button"
          className={estilos.botao}
          onClick={() => setContagem((c) => c + passo)}
        >
          Aumentar
        </button>
      </div>
      <p className={estilos.suave}>Cada clique chama o setter e a tela acompanha.</p>
    </div>
  )
}
/* Fim da demo. */
