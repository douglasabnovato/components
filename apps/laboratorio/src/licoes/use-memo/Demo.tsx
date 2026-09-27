/*
 * Demo: useMemo, useCallback e memo. Trocar o tema não refaz o cálculo dos
 * primos (useMemo) nem renderiza de novo a lista memorizada (memo +
 * useCallback). Mudar o limite refaz as duas coisas, como deve ser.
 */
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import estilos from '../demo.module.css'
import { medidas, primosAte } from './primos'

type ListaProps = { primos: number[]; aoEscolher: (n: number) => void }

/* Lista memorizada: só renderiza de novo quando as props mudam. */
const ListaPrimos = memo(function ListaPrimos({ primos, aoEscolher }: ListaProps) {
  useEffect(() => {
    medidas.renderizacoesDaLista += 1
  })
  return (
    <div className={estilos.linha}>
      {primos.slice(-5).map((p) => (
        <button
          key={p}
          type="button"
          className={[estilos.botao, estilos.vazado].join(' ')}
          onClick={() => aoEscolher(p)}
        >
          {p}
        </button>
      ))}
    </div>
  )
})

/* Controla limite, tema, escolha e a leitura das medidas. */
export default function Demo() {
  const [limite, setLimite] = useState(1000)
  const [escuro, setEscuro] = useState(true)
  const [escolhido, setEscolhido] = useState<number | null>(null)
  const [leitura, setLeitura] = useState<string>('')
  const primos = useMemo(() => primosAte(limite), [limite])
  const escolher = useCallback((n: number) => setEscolhido(n), [])

  return (
    <div className={[estilos.caixa, escuro ? estilos.escuro : estilos.claro].join(' ')}>
      <div className={estilos.linha}>
        <label className={estilos.campo}>
          Limite
          <select value={limite} onChange={(e) => setLimite(Number(e.target.value))}>
            <option value={1000}>1.000</option>
            <option value={10000}>10.000</option>
          </select>
        </label>
        <button type="button" className={estilos.botao} onClick={() => setEscuro((v) => !v)}>
          Trocar tema
        </button>
      </div>
      <p>
        {primos.length} primos até {limite}. Últimos:
      </p>
      <ListaPrimos primos={primos} aoEscolher={escolher} />
      <p aria-live="polite">{escolhido ? `Você escolheu ${escolhido}` : 'Escolha um primo'}</p>
      <div className={estilos.linha}>
        <button
          type="button"
          className={[estilos.botao, estilos.vazado].join(' ')}
          onClick={() =>
            setLeitura(
              `Cálculos: ${medidas.calculos} · renderizações da lista: ${medidas.renderizacoesDaLista}`,
            )
          }
        >
          Ver medidas
        </button>
        <span className={estilos.suave} aria-live="polite">
          {leitura}
        </span>
      </div>
    </div>
  )
}
/* Fim da demo. */
