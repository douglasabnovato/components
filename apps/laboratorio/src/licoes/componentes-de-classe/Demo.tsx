/*
 * Demo histórica: o mesmo relógio como componente de classe (como no React
 * antigo e no projeto original) e como função com hooks, lado a lado.
 */
import { Component, useEffect, useState } from 'react'
import estilos from '../demo.module.css'

type EstadoRelogio = { segundos: number }

/* Versão de classe: estado em this.state e ciclo de vida em métodos. */
class RelogioClasse extends Component<object, EstadoRelogio> {
  state: EstadoRelogio = { segundos: 0 }
  private id = 0

  componentDidMount() {
    this.id = window.setInterval(() => this.setState((s) => ({ segundos: s.segundos + 1 })), 1000)
  }

  componentWillUnmount() {
    window.clearInterval(this.id)
  }

  render() {
    return <p>Classe: {this.state.segundos}s</p>
  }
}

/* Versão com hooks: mesmo comportamento em poucas linhas. */
function RelogioHooks() {
  const [segundos, setSegundos] = useState(0)
  useEffect(() => {
    const id = window.setInterval(() => setSegundos((s) => s + 1), 1000)
    return () => window.clearInterval(id)
  }, [])
  return <p>Hooks: {segundos}s</p>
}

/* Mostra os dois relógios juntos. */
export default function Demo() {
  return (
    <div className={[estilos.caixa, estilos.linha].join(' ')}>
      <RelogioClasse />
      <RelogioHooks />
    </div>
  )
}
/* Fim da demo. */
