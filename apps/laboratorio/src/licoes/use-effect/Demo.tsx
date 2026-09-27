/*
 * Demo: useEffect com limpeza. O cronômetro cria um intervalo só enquanto
 * está rodando e o desfaz ao pausar ou sair da tela.
 */
import { useEffect, useState } from 'react'
import estilos from '../demo.module.css'

/* Controla o cronômetro. */
export default function Demo() {
  const [segundos, setSegundos] = useState(0)
  const [rodando, setRodando] = useState(false)

  useEffect(() => {
    if (!rodando) return
    const id = window.setInterval(() => setSegundos((s) => s + 1), 1000)
    return () => window.clearInterval(id)
  }, [rodando])

  return (
    <div className={estilos.caixa}>
      <p className={estilos.numero} aria-label={`${segundos} segundos`}>
        {segundos}s
      </p>
      <div className={estilos.linha}>
        <button type="button" className={estilos.botao} onClick={() => setRodando((r) => !r)}>
          {rodando ? 'Pausar' : 'Iniciar'}
        </button>
        <button
          type="button"
          className={[estilos.botao, estilos.vazado].join(' ')}
          onClick={() => setSegundos(0)}
        >
          Zerar
        </button>
      </div>
    </div>
  )
}
/* Fim da demo. */
