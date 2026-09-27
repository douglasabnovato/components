/*
 * Demo: formulário controlado e estado elevado. Os dois campos de temperatura
 * leem do mesmo estado no pai; cada um converte a partir da escala editada.
 */
import { useState } from 'react'
import estilos from '../demo.module.css'
import { converter, type Escala } from './temperatura'

/* Campo controlado: valor e mudança vêm do pai. */
function CampoTemperatura(props: {
  rotulo: string
  valor: string
  aoMudar: (texto: string) => void
}) {
  return (
    <label className={estilos.campo}>
      {props.rotulo}
      <input
        inputMode="decimal"
        value={props.valor}
        onChange={(e) => props.aoMudar(e.target.value)}
      />
    </label>
  )
}

/* Guarda só o que foi digitado e a escala; o outro campo é calculado. */
export default function Demo() {
  const [texto, setTexto] = useState('100')
  const [escala, setEscala] = useState<Escala>('c')
  const celsius = escala === 'c' ? texto : converter(texto, 'c')
  const fahrenheit = escala === 'f' ? texto : converter(texto, 'f')
  const ferve = Number.parseFloat(celsius) >= 100

  return (
    <div className={estilos.caixa}>
      <div className={estilos.linha}>
        <CampoTemperatura
          rotulo="Celsius"
          valor={celsius}
          aoMudar={(t) => (setTexto(t), setEscala('c'))}
        />
        <CampoTemperatura
          rotulo="Fahrenheit"
          valor={fahrenheit}
          aoMudar={(t) => (setTexto(t), setEscala('f'))}
        />
      </div>
      <p aria-live="polite">{ferve ? 'A água ferve.' : 'A água não ferve.'}</p>
    </div>
  )
}
/* Fim da demo. */
