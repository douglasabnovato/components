/*
 * Demo: hooks próprios. Dois componentes diferentes usam o mesmo useContador,
 * cada um com o seu estado independente.
 */
import estilos from '../demo.module.css'
import { useAlternar, useContador } from './hooks'

/* Ingressos: contador de 0 a 4. */
function Ingressos() {
  const { valor, somar, subtrair } = useContador(0, { min: 0, max: 4 })
  return (
    <div className={estilos.linha}>
      <button
        type="button"
        className={estilos.botao}
        onClick={() => subtrair()}
        aria-label="Menos ingressos"
      >
        −
      </button>
      <span aria-label={`Ingressos: ${valor}`}>{valor} ingressos</span>
      <button
        type="button"
        className={estilos.botao}
        onClick={() => somar()}
        aria-label="Mais ingressos"
      >
        +
      </button>
    </div>
  )
}

/* Curtidas: contador sem limite e um detalhe que abre e fecha. */
function Curtidas() {
  const { valor, somar, reiniciar } = useContador(10)
  const [aberto, alternar] = useAlternar()
  return (
    <div className={estilos.linha}>
      <button type="button" className={estilos.botao} onClick={() => somar()}>
        Curtir ({valor})
      </button>
      <button
        type="button"
        className={[estilos.botao, estilos.vazado].join(' ')}
        onClick={reiniciar}
      >
        Reiniciar
      </button>
      <button
        type="button"
        className={[estilos.botao, estilos.vazado].join(' ')}
        aria-expanded={aberto}
        onClick={alternar}
      >
        Detalhes
      </button>
      {aberto ? <span className={estilos.suave}>Mesmo hook, estado separado.</span> : null}
    </div>
  )
}

/* Junta os dois exemplos. */
export default function Demo() {
  return (
    <div className={estilos.caixa}>
      <Ingressos />
      <Curtidas />
    </div>
  )
}
/* Fim da demo. */
