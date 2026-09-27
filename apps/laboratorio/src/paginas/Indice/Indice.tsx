/*
 * Índice das lições, agrupado por módulo, com o progresso de cada um.
 */
import { Link } from 'react-router'
import { useConcluidas } from '../../dados/progresso'
import { licoes, modulos } from '../../licoes/indice'
import styles from './Indice.module.css'

/* Monta o topo e a grade de lições por módulo. */
export function Indice() {
  const concluidas = useConcluidas()
  return (
    <div className={styles.pagina}>
      <header className={styles.topo}>
        <p className={styles.rotulo}>Projeto 07 · {licoes.length} lições</p>
        <h1 className={styles.titulo}>
          Lições de React em três tempos: desafio, conteúdo e solução.
        </h1>
        <p className={styles.resumo}>
          Cada lição começa por um problema real, explica o conceito e termina com a solução rodando
          ao lado do código e do teste que a garantem.
        </p>
      </header>
      {modulos.map((m) => {
        const doModulo = licoes.filter((l) => l.modulo === m.id)
        const feitas = doModulo.filter((l) => concluidas.includes(l.id)).length
        return (
          <section key={m.id} aria-labelledby={`modulo-${m.id}`} className={styles.modulo}>
            <div className={styles.cabecalhoModulo}>
              <h2 id={`modulo-${m.id}`}>{m.titulo}</h2>
              <p className={styles.meta}>
                {m.descricao} · {feitas}/{doModulo.length} concluídas
              </p>
            </div>
            <ul className={styles.grade}>
              {doModulo.map((l) => {
                const feita = concluidas.includes(l.id)
                return (
                  <li key={l.id}>
                    <Link to={`/licao/${l.id}`} className={styles.cartao} data-feita={feita}>
                      <span className={styles.simbolo} aria-hidden="true">
                        {l.simbolo}
                      </span>
                      <span className={styles.textos}>
                        <span className={styles.nome}>
                          {l.titulo}
                          {feita ? <span className={styles.selo}>Concluída</span> : null}
                          {l.historico ? (
                            <span className={styles.seloHistorico}>Histórico</span>
                          ) : null}
                        </span>
                        <span className={styles.descricao}>{l.resumo}</span>
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
/* Fim do índice. */
