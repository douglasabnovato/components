/*
 * Página Stack: as 93 tecnologias da trilha em 13 categorias, com status,
 * aprendizados onde aparecem e onde são aplicadas no hub. Filtros na URL.
 */
import { enderecoDoProjeto, SeletorPilula } from '@components/ui'
import { useEffect, useId } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router'
import { EstadoVazio } from '../../componentes/Estados/Estados'
import { SeloStatus } from '../../componentes/SeloStatus/SeloStatus'
import { categorias, tecnologias } from '../../dados/stack'
import { detalhes, projetosDaTecnologia } from '../../dominio/aplicacoes'
import {
  contarStack,
  filtrarTecnologias,
  lerFiltrosStack,
  paraParametrosStack,
  type FiltroStatus,
  type FiltrosStack,
} from '../../dominio/stack'
import type { Tecnologia } from '../../dominio/tipos'
import styles from './Stack.module.css'

const opcoesStatus: { valor: FiltroStatus; rotulo: string }[] = [
  { valor: 'todas', rotulo: 'Todas' },
  { valor: 'atual', rotulo: 'Atuais' },
  { valor: 'transicao', rotulo: 'Em transição' },
  { valor: 'historico', rotulo: 'Históricas' },
]

/* Linha "No hub": todos os projetos, lista de projetos ou só teoria. */
function NoHub({ tecnologia }: { tecnologia: Tecnologia }) {
  const { todos, projetos } = projetosDaTecnologia(tecnologia)
  const detalhe = detalhes[tecnologia.numero]
  return (
    <div className={styles.hub}>
      <dt>No hub</dt>
      <dd>
        {todos ? <span className={styles.todos}>Todos os projetos</span> : null}
        {projetos.length ? (
          <ul className={styles.projetos}>
            {projetos.map((p) => (
              <li key={p.numero}>
                <a href={enderecoDoProjeto(p.numero)}>
                  {String(p.numero).padStart(2, '0')} · {p.nome}
                </a>
              </li>
            ))}
          </ul>
        ) : null}
        {!todos && !projetos.length ? <span className={styles.teoria}>Só na teoria</span> : null}
        {detalhe ? <p className={styles.detalhe}>{detalhe}</p> : null}
      </dd>
    </div>
  )
}

/* Card de uma tecnologia, com âncora #tec-N para links diretos. */
function CardTecnologia({ tecnologia: t }: { tecnologia: Tecnologia }) {
  return (
    <article id={`tec-${t.numero}`} className={styles.card} tabIndex={-1}>
      <header className={styles.cabecalhoCard}>
        <span className={styles.numero}>#{t.numero}</span>
        <h3 className={styles.nome}>{t.nome}</h3>
        <SeloStatus status={t.status} nota={t.nota} />
      </header>
      <dl className={styles.dados}>
        <div>
          <dt>O que é</dt>
          <dd>{t.oQueE}</dd>
        </div>
        <div>
          <dt>Para que usar</dt>
          <dd>{t.paraQue}</dd>
        </div>
        <div>
          <dt>Aprendizados</dt>
          <dd>
            <ul className={styles.aprendizados}>
              {t.aprendizados.map((n) => (
                <li key={n}>
                  <Link to={`/aprendizado/${n}`} aria-label={`Aprendizado ${n}`}>
                    {n}
                  </Link>
                </li>
              ))}
            </ul>
          </dd>
        </div>
        <NoHub tecnologia={t} />
      </dl>
    </article>
  )
}

/* Monta o resumo, os filtros e as categorias. */
export function Stack() {
  const [parametros, setParametros] = useSearchParams()
  const { hash } = useLocation()
  const filtros = lerFiltrosStack(parametros)
  const idLista = useId()
  const contagem = contarStack()
  const visiveis = filtrarTecnologias(filtros)
  const lacunas = tecnologias.filter((t) => t.nota === 'lacuna')

  useEffect(() => {
    if (!hash) return
    const alvo = document.getElementById(hash.slice(1))
    alvo?.scrollIntoView({ block: 'start' })
    alvo?.focus({ preventScroll: true })
  }, [hash])

  /* Grava uma mudança de filtro na URL. */
  function mudar(parcial: Partial<FiltrosStack>) {
    setParametros(paraParametrosStack({ ...filtros, ...parcial }), { replace: true })
  }

  return (
    <>
      <header className={styles.topo}>
        <p className={styles.rotulo}>Tecnologias, ferramentas e metodologias</p>
        <h1 className={styles.titulo}>Stack da trilha</h1>
        <p className={styles.resumo}>
          Tudo o que os vídeos da trilha ensinam, organizado em {categorias.length} categorias. Cada
          item mostra em quais aprendizados aparece e em quais projetos do hub você pode vê-lo
          funcionando.
        </p>
        <dl className={styles.numeros}>
          <div>
            <dt>Tecnologias</dt>
            <dd>{contagem.total}</dd>
          </div>
          <div>
            <dt>Atuais</dt>
            <dd>{contagem.atual}</dd>
          </div>
          <div>
            <dt>Em transição</dt>
            <dd>{contagem.transicao}</dd>
          </div>
          <div>
            <dt>Históricas</dt>
            <dd>{contagem.historico}</dd>
          </div>
          <div>
            <dt>Aplicadas no hub</dt>
            <dd>{contagem.noHub}</dd>
          </div>
        </dl>
      </header>

      {lacunas.length ? (
        <aside className={styles.lacuna} aria-labelledby="lacunas">
          <h2 id="lacunas">Lacuna da trilha</h2>
          {lacunas.map((t) => (
            <p key={t.numero}>
              <strong>{t.nome}</strong>: nenhum vídeo da trilha ensina. O hub cobre essa lacuna:{' '}
              {detalhes[t.numero]}
            </p>
          ))}
        </aside>
      ) : null}

      <search className={styles.filtros} aria-label="Filtros da stack">
        <div className={styles.busca}>
          <label htmlFor={`${idLista}-busca`}>Buscar tecnologia</label>
          <input
            id={`${idLista}-busca`}
            type="search"
            value={filtros.busca}
            placeholder="Ex.: Zod, cache, rotas"
            onChange={(e) => mudar({ busca: e.target.value })}
            aria-controls={idLista}
          />
        </div>
        <SeletorPilula
          rotulo="Status"
          opcoes={opcoesStatus}
          valor={filtros.status}
          aoMudar={(status) => mudar({ status })}
          controla={idLista}
        />
        <label className={styles.soHub}>
          <input
            type="checkbox"
            checked={filtros.soNoHub}
            onChange={(e) => mudar({ soNoHub: e.target.checked })}
          />
          Só as aplicadas no hub
        </label>
      </search>

      <p className={styles.contagem} role="status">
        {visiveis.length} de {contagem.total} tecnologias
      </p>

      <div id={idLista} className={styles.categorias}>
        {visiveis.length === 0 ? (
          <EstadoVazio titulo="Nenhuma tecnologia encontrada">
            Tente outro termo ou outro status.
          </EstadoVazio>
        ) : (
          categorias.map((c) => {
            const daCategoria = visiveis.filter((t) => t.categoria === c.numero)
            if (!daCategoria.length) return null
            return (
              <section key={c.numero} aria-labelledby={`categoria-${c.numero}`}>
                <h2 id={`categoria-${c.numero}`} className={styles.categoria}>
                  <span>{String(c.numero).padStart(2, '0')}</span> {c.nome}
                </h2>
                <div className={styles.grade}>
                  {daCategoria.map((t) => (
                    <CardTecnologia key={t.numero} tecnologia={t} />
                  ))}
                </div>
              </section>
            )
          })
        )}
      </div>
    </>
  )
}
/* Fim da página Stack. */
