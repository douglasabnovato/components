/*
 * Demo: ref como prop e useImperativeHandle. O pai controla o campo filho
 * (focar e limpar) sem acessar o input diretamente.
 */
import { useRef } from 'react'
import estilos from '../demo.module.css'
import { CampoBusca, type ControleBusca } from './CampoBusca'

/* Botões do pai chamam o controle exposto pelo filho. */
export default function Demo() {
  const busca = useRef<ControleBusca>(null)
  return (
    <div className={estilos.caixa}>
      <CampoBusca ref={busca} rotulo="Buscar" />
      <div className={estilos.linha}>
        <button type="button" className={estilos.botao} onClick={() => busca.current?.focar()}>
          Focar busca
        </button>
        <button
          type="button"
          className={[estilos.botao, estilos.vazado].join(' ')}
          onClick={() => busca.current?.limpar()}
        >
          Limpar busca
        </button>
      </div>
    </div>
  )
}
/* Fim da demo. */
