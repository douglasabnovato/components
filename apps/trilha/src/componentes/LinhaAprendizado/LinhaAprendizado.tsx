/*
 * LinhaAprendizado: um item da trilha com caixa de "assistido", número,
 * título (link para a página do aprendizado), duração e etiquetas.
 */
import { Link } from 'react-router'
import type { Aprendizado } from '../../dominio/tipos'
import styles from './LinhaAprendizado.module.css'

type Props = {
  aprendizado: Aprendizado
  assistido: boolean
  aoAlternar: (numero: number) => void
}

/* Renderiza o item; a caixa marca ou desmarca sem sair da lista. */
export function LinhaAprendizado({ aprendizado: a, assistido, aoAlternar }: Props) {
  const id = `assistido-${a.numero}`
  return (
    <li className={styles.linha} data-assistido={assistido}>
      <input
        id={id}
        type="checkbox"
        className={styles.caixa}
        checked={assistido}
        onChange={() => aoAlternar(a.numero)}
      />
      <label htmlFor={id} className="visualmente-oculto">
        Assistido: {a.titulo}
      </label>
      <span className={styles.numero} aria-hidden="true">
        {String(a.numero).padStart(3, '0')}
      </span>
      <div className={styles.textos}>
        <Link to={`/aprendizado/${a.numero}`} className={styles.titulo}>
          {a.titulo}
        </Link>
        <p className={styles.meta}>
          <span>{a.duracao}</span>
          {a.autor ? <span>{a.autor}</span> : null}
          {a.idioma === 'en' ? <span className={styles.etiqueta}>Em inglês</span> : null}
          {a.historico ? (
            <span className={[styles.etiqueta, styles.historico].join(' ')}>Histórico</span>
          ) : null}
        </p>
      </div>
    </li>
  )
}
/* Fim da LinhaAprendizado. */
