/*
 * Demo: comunicação entre componentes. Direta: o pai passa um valor ao filho
 * por props. Indireta: o pai passa uma função e o filho a chama para avisar.
 */
import { useState } from 'react'
import estilos from '../demo.module.css'

/* Filho que só recebe dados do pai. */
function FilhoDireto({ texto }: { texto: string }) {
  return <p>O pai me disse: {texto}</p>
}

/* Filho que avisa o pai chamando a função recebida. */
function FilhoIndireto({ aoSortear }: { aoSortear: (numero: number) => void }) {
  return (
    <button
      type="button"
      className={estilos.botao}
      onClick={() => aoSortear(Math.floor(Math.random() * 60) + 1)}
    >
      Sortear no filho
    </button>
  )
}

/* O pai guarda o valor que veio do filho. */
export default function Demo() {
  const [sorteado, setSorteado] = useState<number | null>(null)
  return (
    <div className={estilos.caixa}>
      <FilhoDireto texto="olá, filho" />
      <div className={estilos.linha}>
        <FilhoIndireto aoSortear={setSorteado} />
        <p aria-live="polite">{sorteado ? `O filho sorteou ${sorteado}` : 'Nada sorteado ainda'}</p>
      </div>
    </div>
  )
}
/* Fim da demo. */
