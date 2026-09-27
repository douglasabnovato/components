/*
 * Times: resultado do sorteio, um cartão por time com a força total (soma dos
 * níveis) e a lista de reservas, se houver.
 */
import { forcaDoTime } from '../../dominio/pelada'
import type { Jogador } from '../../dominio/tipos'
import styles from './Times.module.css'

type Props = { times: Jogador[][]; reservas: Jogador[] }

/* Renderiza os times lado a lado. */
export function Times({ times, reservas }: Props) {
  return (
    <div className={styles.times}>
      <ul className={styles.grade}>
        {times.map((time, indice) => {
          const nome = `Time ${String.fromCharCode(65 + indice)}`
          return (
            <li key={nome} className={styles.time} aria-label={nome}>
              <p className={styles.nome}>
                {nome} <span className={styles.forca}>força {forcaDoTime(time)}</span>
              </p>
              <ul className={styles.jogadores}>
                {time.map((j) => (
                  <li key={j.id}>
                    {j.nome} <span className={styles.nivel}>({j.nivel})</span>
                  </li>
                ))}
              </ul>
            </li>
          )
        })}
      </ul>
      {reservas.length ? (
        <p className={styles.reservas}>
          <strong>Próximos a entrar:</strong> {reservas.map((j) => j.nome).join(', ')}
        </p>
      ) : null}
    </div>
  )
}
/* Fim dos Times. */
