/*
 * Seção 03 · Portal de Heróis. Referência: ilustração em tela cheia com
 * título sobreposto e chamada com ícone e linha de apoio. As fichas mostram
 * um herói de cada equipe, vindos do próprio projeto 03 (dados originais).
 */
import { equipes, herois as heroisReais, universos } from '@components/herois/dados'
import { projeto } from '../../dados/projetos'
import {
  CabecalhoSecao,
  ChamadaProjeto,
  RecursosProjeto,
  Secao,
} from '../../componentes/Secao/Secao'
import { Revelar } from '../../componentes/Revelar'
import { CenaHerois } from './CenaHerois'
import styles from './SecaoHerois.module.css'

const herois = equipes.map((e) => {
  const h = heroisReais.find((heroi) => heroi.equipe === e.slug)!
  const universo = universos.find((u) => u.slug === e.universo)!
  return { nome: h.nome, poder: h.resumo, universo: universo.nome, cor: h.cor, equipe: e.nome }
})

/* Monta a cena ilustrada, o texto sobreposto e as fichas dos heróis. */
export function SecaoHerois() {
  const p = projeto(3)
  return (
    <Secao projeto={p} largura="total" className={styles.secao}>
      <div className={styles.palco}>
        <CenaHerois />
        <div className={styles.sobreposto}>
          <CabecalhoSecao projeto={p} tamanho="g" />
          <ChamadaProjeto
            projeto={p}
            icone={
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5z" fill="currentColor" />
              </svg>
            }
          />
        </div>
      </div>

      <div className={styles.faixa}>
        <ul className={styles.fichas}>
          {herois.map((h, indice) => (
            <Revelar como="li" key={h.nome} atraso={indice * 0.1} className={styles.ficha}>
              <span className={styles.emblema} style={{ background: h.cor }} aria-hidden="true">
                {h.nome.charAt(0)}
              </span>
              <div>
                <h3 className={styles.nomeHeroi}>{h.nome}</h3>
                <p className={styles.poder}>{h.poder}</p>
              </div>
              <span className={styles.universo}>
                {h.equipe} · {h.universo}
              </span>
            </Revelar>
          ))}
        </ul>
        <RecursosProjeto projeto={p} />
      </div>
    </Secao>
  )
}
/* Fim da seção Portal de Heróis. */
