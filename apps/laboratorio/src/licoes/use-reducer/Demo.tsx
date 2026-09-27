/*
 * Demo: useReducer. Os botões só despacham ações; o reducer decide como o
 * estado muda, inclusive o "desfazer".
 */
import { useReducer } from 'react'
import estilos from '../demo.module.css'
import { inicial, reducer } from './contador'

/* Liga os botões às ações do reducer. */
export default function Demo() {
  const [estado, despachar] = useReducer(reducer, inicial)
  return (
    <div className={estilos.caixa}>
      <p className={estilos.numero} aria-label={`Valor: ${estado.valor}`}>
        {estado.valor}
      </p>
      <div className={estilos.linha}>
        <button
          type="button"
          className={estilos.botao}
          onClick={() => despachar({ tipo: 'somar', quanto: 1 })}
        >
          +1
        </button>
        <button
          type="button"
          className={estilos.botao}
          onClick={() => despachar({ tipo: 'somar', quanto: 10 })}
        >
          +10
        </button>
        <button
          type="button"
          className={estilos.botao}
          onClick={() => despachar({ tipo: 'multiplicar', fator: 2 })}
        >
          ×2
        </button>
        <button
          type="button"
          className={[estilos.botao, estilos.vazado].join(' ')}
          disabled={estado.historico.length === 0}
          onClick={() => despachar({ tipo: 'desfazer' })}
        >
          Desfazer
        </button>
        <button
          type="button"
          className={[estilos.botao, estilos.vazado].join(' ')}
          onClick={() => despachar({ tipo: 'zerar' })}
        >
          Zerar
        </button>
      </div>
    </div>
  )
}
/* Fim da demo. */
