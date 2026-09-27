/*
 * Seção Arquitetura: explica como o ecossistema é montado (monorepo,
 * pacote de UI e API) e mostra a ordem de construção dos projetos.
 */
import { doisDigitos, projetos } from '../../dados/projetos'
import { IconeProjeto } from '../../componentes/IconeProjeto'
import { Revelar } from '../../componentes/Revelar'
import styles from './SecaoArquitetura.module.css'

const pilares = [
  {
    titulo: 'Um monorepo, uma instalação',
    texto:
      'pnpm workspaces com catálogo de versões: todos os projetos usam a mesma versão de cada biblioteca.',
    codigo: 'pnpm install',
  },
  {
    titulo: 'Componentes compartilhados',
    texto:
      'packages/ui reúne tokens, navegação, carrossel, abas, cards, o mapa de endereços e o botão de voltar ao hub.',
    codigo: '@components/ui',
  },
  {
    titulo: 'Uma API para quem precisa',
    texto:
      'Clientes (02) e tarefas (05) vêm de um único serviço Hono, com Drizzle e Postgres em WebAssembly (PGlite).',
    codigo: 'apps/api',
  },
  {
    titulo: 'Contratos compartilhados',
    texto: 'Os mesmos esquemas Zod validam o formulário no navegador e a requisição no servidor.',
    codigo: '@components/contratos',
  },
]

/* Monta os pilares e a linha do tempo pela ordem de construção. */
export function SecaoArquitetura() {
  const ordem = [...projetos].sort((a, b) => a.fase - b.fase)
  return (
    <section id="arquitetura" className={styles.secao} aria-labelledby="arquitetura-titulo">
      <div className={styles.conteudo}>
        <div className={styles.cabecalho}>
          <p className={styles.rotulo}>Como é feito</p>
          <h2 id="arquitetura-titulo" className={styles.titulo}>
            Sem código legado. Mesmas ideias, base nova.
          </h2>
        </div>

        <ul className={styles.pilares}>
          {pilares.map((pilar, indice) => (
            <Revelar como="li" key={pilar.titulo} atraso={indice * 0.08} className={styles.pilar}>
              <code className={styles.codigo}>{pilar.codigo}</code>
              <h3 className={styles.tituloPilar}>{pilar.titulo}</h3>
              <p className={styles.texto}>{pilar.texto}</p>
            </Revelar>
          ))}
        </ul>

        <div className={styles.linha}>
          <h3 className={styles.subtitulo}>Ordem de construção</h3>
          <ol className={styles.fases}>
            <li className={styles.fase} data-atual="true">
              <span className={styles.numeroFase}>Fase 0</span>
              <span className={styles.nomeFase}>Hub</span>
              <span className={styles.estado}>No ar</span>
            </li>
            {ordem.map((p) => (
              <li key={p.id} className={styles.fase}>
                <span className={styles.numeroFase}>Fase {p.fase}</span>
                <a href={`#${p.id}`} className={styles.nomeFase}>
                  <IconeProjeto projeto={p} tamanho={24} />
                  {doisDigitos(p.numero)} · {p.nome}
                </a>
                <span className={styles.estado}>
                  {p.status === 'publicado' ? 'No ar' : 'A fazer'}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
/* Fim da seção Arquitetura. */
