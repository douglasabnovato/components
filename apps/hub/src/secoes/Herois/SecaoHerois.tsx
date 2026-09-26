/*
 * Seção 03 · Portal de Heróis. Referência: ilustração em tela cheia com
 * título sobreposto e chamada com ícone e linha de apoio. Heróis e artes
 * são originais do projeto (sem personagens ou marcas de terceiros).
 */
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

const herois = [
  { nome: 'Aurora', poder: 'Transforma luz em escudo', universo: 'Alvorada', cor: '#FFB020' },
  { nome: 'Vértice', poder: 'Dobra o espaço em ângulos', universo: 'Geometria', cor: '#FF5C7A' },
  { nome: 'Maré', poder: 'Controla correntes e marés', universo: 'Oceânica', cor: '#3DDC97' },
]

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
              <span className={styles.universo}>Universo {h.universo}</span>
            </Revelar>
          ))}
        </ul>
        <RecursosProjeto projeto={p} />
      </div>
    </Secao>
  )
}
/* Fim da seção Portal de Heróis. */
