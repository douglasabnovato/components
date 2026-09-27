/*
 * Demo: listas e keys. Cada tarefa tem um campo de nota. Com key pelo id, a
 * nota acompanha a tarefa quando outra entra no topo; com key pelo índice,
 * o React reaproveita o elemento errado e a nota "pula" de tarefa.
 */
import { useState } from 'react'
import estilos from '../demo.module.css'

type Tarefa = { id: number; titulo: string }

/* Controla a lista e o tipo de key usado. */
export default function Demo() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([
    { id: 1, titulo: 'Estudar keys' },
    { id: 2, titulo: 'Revisar props' },
  ])
  const [porIndice, setPorIndice] = useState(false)

  /* Adiciona uma tarefa nova no topo da lista. */
  function adicionarNoTopo() {
    setTarefas((atual) => [{ id: Date.now(), titulo: `Tarefa nova ${atual.length + 1}` }, ...atual])
  }

  return (
    <div className={estilos.caixa}>
      <div className={estilos.linha}>
        <button type="button" className={estilos.botao} onClick={adicionarNoTopo}>
          Adicionar no topo
        </button>
        <label className={estilos.linha}>
          <input
            type="checkbox"
            checked={porIndice}
            onChange={(e) => setPorIndice(e.target.checked)}
          />
          Usar o índice como key (errado)
        </label>
      </div>
      <ul className={estilos.lista}>
        {tarefas.map((t, indice) => (
          <li key={porIndice ? indice : t.id} className={estilos.item}>
            <span>{t.titulo}</span>
            <input aria-label={`Nota de ${t.titulo}`} placeholder="nota" />
          </li>
        ))}
      </ul>
    </div>
  )
}
/* Fim da demo. */
