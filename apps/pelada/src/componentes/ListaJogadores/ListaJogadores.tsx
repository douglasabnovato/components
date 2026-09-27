/*
 * ListaJogadores: lista numerada (confirmados ou espera) com o nível de cada
 * jogador e o botão para retirar o nome.
 */
import { rotuloNivel } from '../../dominio/pelada'
import type { Jogador } from '../../dominio/tipos'
import styles from './ListaJogadores.module.css'

type Props = {
  titulo: string
  jogadores: Jogador[]
  vazio: string
  aoRetirar?: (jogador: Jogador) => void
}

/* Renderiza o título com a contagem e a lista (ou a mensagem de vazio). */
export function ListaJogadores({ titulo, jogadores, vazio, aoRetirar }: Props) {
  const id = titulo.toLowerCase().replace(/\W+/g, '-')
  return (
    <section className={styles.bloco} aria-labelledby={id}>
      <h2 id={id} className={styles.titulo}>
        {titulo} <span className={styles.contagem}>({jogadores.length})</span>
      </h2>
      {jogadores.length === 0 ? (
        <p className={styles.vazio}>{vazio}</p>
      ) : (
        <ol className={styles.lista}>
          {jogadores.map((j) => (
            <li key={j.id} className={styles.item}>
              <span className={styles.nome}>{j.nome}</span>
              <span className={styles.nivel} title="Nível">
                <span className="visualmente-oculto">Nível </span>
                {rotuloNivel(j.nivel)}
              </span>
              {aoRetirar ? (
                <button type="button" className={styles.retirar} onClick={() => aoRetirar(j)}>
                  Retirar <span className="visualmente-oculto">{j.nome}</span>
                </button>
              ) : null}
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
/* Fim da ListaJogadores. */
