/*
 * ItemTarefa: caixa de conclusão (atualização otimista), descrição com o
 * trecho da busca destacado, data de criação e excluir, que só funciona
 * depois de concluir (regra herdada do todo-app original).
 */
import type { Tarefa } from '@components/contratos'
import { destacar, formatarCriacao } from '../../dominio/tarefas'
import styles from './ItemTarefa.module.css'

type Props = {
  tarefa: Tarefa
  busca: string
  aoAlternar: (tarefa: Tarefa) => void
  aoExcluir: (tarefa: Tarefa) => void
}

/* Renderiza uma tarefa da lista. */
export function ItemTarefa({ tarefa, busca, aoAlternar, aoExcluir }: Props) {
  const id = `tarefa-${tarefa.id}`
  return (
    <li className={styles.item} data-concluida={tarefa.concluida}>
      <input
        id={id}
        type="checkbox"
        className={styles.caixa}
        checked={tarefa.concluida}
        onChange={() => aoAlternar(tarefa)}
      />
      <div className={styles.textos}>
        <label htmlFor={id} className={styles.descricao}>
          <span className="visualmente-oculto">Concluir</span>{' '}
          {destacar(tarefa.descricao, busca).map((t, i) =>
            t.destaque ? <mark key={i}>{t.texto}</mark> : <span key={i}>{t.texto}</span>,
          )}
        </label>
        <p className={styles.meta}>
          <time dateTime={tarefa.criadaEm}>Criada em {formatarCriacao(tarefa.criadaEm)}</time>
          {tarefa.concluida ? <span className={styles.selo}>Concluída</span> : null}
        </p>
      </div>
      <button
        type="button"
        className={styles.excluir}
        aria-disabled={!tarefa.concluida}
        title={tarefa.concluida ? undefined : 'Conclua a tarefa antes de excluir'}
        onClick={() => aoExcluir(tarefa)}
      >
        Excluir <span className="visualmente-oculto">{tarefa.descricao}</span>
      </button>
    </li>
  )
}
/* Fim do ItemTarefa. */
