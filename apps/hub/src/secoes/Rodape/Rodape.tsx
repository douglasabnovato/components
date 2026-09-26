/*
 * Rodape: créditos das ideias originais de cada projeto, aviso de que
 * nomes e artes são próprios e links do autor.
 */
import { projetos, site } from '../../dados/projetos'
import styles from './Rodape.module.css'

/* Lista os créditos a partir dos dados e fecha a página. */
export function Rodape() {
  return (
    <footer id="creditos" className={styles.rodape} aria-labelledby="creditos-titulo">
      <div className={styles.conteudo}>
        <h2 id="creditos-titulo" className={styles.titulo}>
          Créditos
        </h2>
        <dl className={styles.creditos}>
          {projetos.map((p) => (
            <div key={p.id} className={styles.credito}>
              <dt>
                {p.nome} <span className={styles.pasta}>({p.pastaOriginal})</span>
              </dt>
              <dd>{p.creditoIdeia}</dd>
            </div>
          ))}
        </dl>
        <p className={styles.aviso}>
          Projeto de estudo e portfólio. Nomes, ilustrações e personagens são originais e não têm
          vínculo com marcas de terceiros.
        </p>
        <div className={styles.base}>
          <p>
            Feito por <a href={site.perfil}>{site.autor}</a>
          </p>
          <a href={site.github}>Código no GitHub</a>
          <a href="#topo">Voltar ao topo ↑</a>
        </div>
      </div>
    </footer>
  )
}
/* Fim do Rodape. */
