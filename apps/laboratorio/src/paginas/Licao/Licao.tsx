/*
 * Página da lição: abas Desafio, Conteúdo, Solução e Assista controladas pela
 * URL (?aba=), texto em MDX, e na Solução a demo viva ao lado do código e do
 * teste. A aba Assista liga a lição aos vídeos da Trilha React.
 */
import { AbasSegmentadas, BotaoPilula } from '@components/ui'
import { aprendizadoPorNumero } from '@components/trilha/dados'
import { Link, useParams, useSearchParams } from 'react-router'
import { Codigo } from '../../componentes/Codigo/Codigo'
import { AbaContexto, type Aba } from '../../componentes/Secoes/contexto'
import { Conteudo, Desafio, Solucao } from '../../componentes/Secoes/Secoes'
import { urlDoAprendizado } from '../../config'
import { alternarConcluida, useConcluidas } from '../../dados/progresso'
import { licaoPorId, modulos, vizinhas } from '../../licoes/indice'
import type { Licao as TipoLicao } from '../../licoes/tipos'
import { NaoEncontrado } from '../NaoEncontrado/NaoEncontrado'
import styles from './Licao.module.css'

const ABAS: { id: Aba; rotulo: string }[] = [
  { id: 'desafio', rotulo: '1 · Desafio' },
  { id: 'conteudo', rotulo: '2 · Conteúdo' },
  { id: 'solucao', rotulo: '3 · Solução' },
  { id: 'assista', rotulo: 'Assista' },
]

const componentesMdx = { Desafio, Conteudo, Solucao }

/* Texto MDX da lição mostrando só a seção da aba. */
function TextoDaAba({ licao, aba }: { licao: TipoLicao; aba: Aba }) {
  const { Texto } = licao
  return (
    <AbaContexto.Provider value={aba}>
      <Texto components={componentesMdx} />
    </AbaContexto.Provider>
  )
}

/* Aba Assista: os aprendizados da Trilha ligados à lição. */
function Assista({ licao }: { licao: TipoLicao }) {
  return (
    <div className={styles.assista}>
      <p>Vídeos da Trilha React que ensinam este assunto:</p>
      <ul className={styles.videos}>
        {licao.aprendizados.map((n) => {
          const a = aprendizadoPorNumero(n)
          if (!a) return null
          return (
            <li key={n}>
              <a href={urlDoAprendizado(n)}>
                <span className={styles.numeroVideo}>{String(n).padStart(3, '0')}</span>
                <span>
                  {a.titulo} <span className={styles.duracao}>· {a.duracao}</span>
                </span>
              </a>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/* Renderiza a lição da URL ou o aviso de não encontrada. */
export function Licao() {
  const { id = '' } = useParams()
  const [parametros, setParametros] = useSearchParams()
  const concluidas = useConcluidas()
  const licao = licaoPorId(id)
  if (!licao) return <NaoEncontrado titulo="Lição não encontrada" />

  const pedida = parametros.get('aba') as Aba | null
  const aba: Aba = pedida && ABAS.some((a) => a.id === pedida) ? pedida : 'desafio'
  const { anterior, proxima } = vizinhas(licao.id)
  const modulo = modulos.find((m) => m.id === licao.modulo)
  const feita = concluidas.includes(licao.id)
  const { Demo } = licao

  const conteudoDasAbas = {
    desafio: <TextoDaAba licao={licao} aba="desafio" />,
    conteudo: <TextoDaAba licao={licao} aba="conteudo" />,
    solucao: (
      <div className={styles.solucao}>
        <TextoDaAba licao={licao} aba="solucao" />
        <div className={styles.lado}>
          <section aria-label="Demonstração" className={styles.demo}>
            <p className={styles.legenda}>Rodando agora</p>
            <Demo />
          </section>
          <div className={styles.codigos}>
            <Codigo titulo="Demo.tsx" codigo={licao.codigo} />
            <Codigo titulo="demo.test.tsx" codigo={licao.teste} />
          </div>
        </div>
      </div>
    ),
    assista: <Assista licao={licao} />,
  }

  return (
    <article className={styles.pagina}>
      <nav aria-label="Você está em" className={styles.migalhas}>
        <Link to="/">Lições</Link> / <span>{modulo?.titulo}</span> /{' '}
        <span aria-current="page">{licao.titulo}</span>
      </nav>
      <header className={styles.cabecalho}>
        <span className={styles.simbolo} aria-hidden="true">
          {licao.simbolo}
        </span>
        <div>
          <h1 className={styles.titulo}>{licao.titulo}</h1>
          <p className={styles.resumo}>{licao.resumo}</p>
        </div>
        <BotaoPilula
          variante={feita ? 'vazado' : 'preenchido'}
          aria-pressed={feita}
          icone={feita ? '✓' : '○'}
          onClick={() => alternarConcluida(licao.id)}
        >
          {feita ? 'Concluída' : 'Marcar como concluída'}
        </BotaoPilula>
      </header>

      <AbasSegmentadas
        rotulo="Etapas da lição"
        ativa={aba}
        aoMudar={(nova) => {
          const p = new URLSearchParams(parametros)
          p.set('aba', nova)
          setParametros(p, { replace: true })
        }}
        abas={ABAS.map((a) => ({ id: a.id, rotulo: a.rotulo, conteudo: conteudoDasAbas[a.id] }))}
      />

      <nav aria-label="Outras lições" className={styles.vizinhas}>
        {anterior ? (
          <Link to={`/licao/${anterior.id}`}>
            <span>← Anterior</span>
            {anterior.titulo}
          </Link>
        ) : (
          <span />
        )}
        {proxima ? (
          <Link to={`/licao/${proxima.id}`} className={styles.proxima}>
            <span>Próxima →</span>
            {proxima.titulo}
          </Link>
        ) : null}
      </nav>
    </article>
  )
}
/* Fim da página da lição. */
