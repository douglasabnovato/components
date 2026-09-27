/*
 * Demo: useContext. O tema é fornecido uma vez no topo e lido por um cartão
 * três níveis abaixo, sem passar props pelos componentes do meio.
 */
import { useMemo, useState } from 'react'
import estilos from '../demo.module.css'
import { TemaContexto, useTema, type Tema } from './tema'

/* Cartão lá embaixo na árvore: lê o tema direto do contexto. */
function CartaoComTema() {
  const { tema, alternar } = useTema()
  return (
    <div className={[estilos.cartao, tema === 'claro' ? estilos.claro : estilos.escuro].join(' ')}>
      <p>Tema atual: {tema}</p>
      <button type="button" className={estilos.botao} onClick={alternar}>
        Alternar tema
      </button>
    </div>
  )
}

/* Componentes do meio não sabem nada de tema. */
function Painel() {
  return (
    <section aria-label="Painel">
      <Secao />
    </section>
  )
}

/* Outro nível intermediário. */
function Secao() {
  return <CartaoComTema />
}

/* Fornece o tema para toda a árvore abaixo. */
export default function Demo() {
  const [tema, setTema] = useState<Tema>('escuro')
  const valor = useMemo(
    () => ({ tema, alternar: () => setTema((t) => (t === 'claro' ? 'escuro' : 'claro')) }),
    [tema],
  )
  return (
    <div className={estilos.caixa}>
      <TemaContexto.Provider value={valor}>
        <Painel />
      </TemaContexto.Provider>
    </div>
  )
}
/* Fim da demo. */
