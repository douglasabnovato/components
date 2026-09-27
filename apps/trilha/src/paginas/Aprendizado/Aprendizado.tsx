/*
 * Página do aprendizado: player leve, marcar como assistido, anotações,
 * tecnologias do vídeo (com onde praticar no hub) e navegação na ordem da trilha.
 */
import { BotaoPilula, enderecoDoProjeto, type ProjetoEcossistema } from '@components/ui'
import { useId } from 'react'
import { Link, useParams } from 'react-router'
import { EstadoVazio } from '../../componentes/Estados/Estados'
import { Player } from '../../componentes/Player/Player'
import { SeloStatus } from '../../componentes/SeloStatus/SeloStatus'
import { useProgresso } from '../../dados/progresso'
import { aprendizados } from '../../dados/trilha'
import { projetosDaTecnologia } from '../../dominio/aplicacoes'
import {
  aprendizadoPorNumero,
  moduloPorNumero,
  tecnologiasDoAprendizado,
  vizinhos,
} from '../../dominio/trilha'
import { linkDoVideo } from '../../dominio/youtube'
import styles from './Aprendizado.module.css'

/* Junta, sem repetir, os projetos onde as tecnologias do vídeo são aplicadas. */
function projetosParaPraticar(numeros: number[]): ProjetoEcossistema[] {
  const mapa = new Map<number, ProjetoEcossistema>()
  for (const numero of numeros) {
    for (const p of projetosDaTecnologia({ numero }).projetos) mapa.set(p.numero, p)
  }
  return [...mapa.values()].sort((a, b) => a.numero - b.numero)
}

/* Renderiza o aprendizado da URL ou o aviso de não encontrado. */
export function Aprendizado() {
  const { numero } = useParams()
  const { progresso, armazem } = useProgresso()
  const idNotas = useId()
  const aprendizado = aprendizadoPorNumero(Number(numero))

  if (!aprendizado) {
    return (
      <EstadoVazio
        nivel="h1"
        titulo="Aprendizado não encontrado"
        acoes={
          <BotaoPilula comoFilho>
            <Link to="/">Voltar à trilha</Link>
          </BotaoPilula>
        }
      >
        A trilha vai do aprendizado 1 ao {aprendizados.length}.
      </EstadoVazio>
    )
  }

  const a = aprendizado
  const modulo = moduloPorNumero(a.modulo)
  const assistido = progresso.assistidos.includes(a.numero)
  const nota = progresso.notas[String(a.numero)] ?? ''
  const { anterior, proximo } = vizinhos(a.numero)
  const tecnologias = tecnologiasDoAprendizado(a.numero)
  const praticar = projetosParaPraticar(tecnologias.map((t) => t.numero))

  return (
    <article className={styles.pagina}>
      <nav aria-label="Você está em" className={styles.trilha}>
        <ol>
          <li>
            <Link to="/">Trilha</Link>
          </li>
          <li>
            <Link to={`/?modulo=${a.modulo}`}>
              Módulo {a.modulo}: {modulo?.titulo}
            </Link>
          </li>
          <li aria-current="page">Aprendizado {a.numero}</li>
        </ol>
      </nav>

      <header className={styles.cabecalho}>
        <p className={styles.rotulo}>
          Aprendizado {a.numero} de {aprendizados.length}
        </p>
        <h1 className={styles.titulo}>{a.titulo}</h1>
        <p className={styles.meta}>
          <span>{a.duracao}</span>
          {a.autor ? <span>{a.autor}</span> : null}
          {a.idioma === 'en' ? <span className={styles.etiqueta}>Em inglês</span> : null}
          {a.historico ? <span className={styles.etiqueta}>Histórico</span> : null}
        </p>
      </header>

      <div className={styles.grade}>
        <div className={styles.video}>
          <Player key={a.numero} youtubeId={a.youtubeId} titulo={a.titulo} />
          <p className={styles.descricao}>{a.descricao}</p>
          {a.historico ? (
            <p className={styles.aviso}>
              Conteúdo histórico: vale pelo conceito, mas parte das ferramentas mudou. Compare com a
              stack atual antes de aplicar.
            </p>
          ) : null}
        </div>

        <aside className={styles.lateral} aria-label="Ações do aprendizado">
          <BotaoPilula
            variante={assistido ? 'vazado' : 'preenchido'}
            aria-pressed={assistido}
            icone={assistido ? '✓' : '○'}
            onClick={() => armazem.alternarAssistido(a.numero)}
          >
            {assistido ? 'Assistido' : 'Marcar como assistido'}
          </BotaoPilula>
          <a
            className={styles.externo}
            href={linkDoVideo(a.youtubeId)}
            target="_blank"
            rel="noreferrer"
          >
            Abrir no YouTube <span className="visualmente-oculto">(nova aba)</span>
          </a>

          <div className={styles.notas}>
            <label htmlFor={idNotas}>Suas anotações</label>
            <textarea
              id={idNotas}
              rows={6}
              value={nota}
              placeholder="O que você aprendeu? O que quer aplicar?"
              onChange={(e) => armazem.salvarNota(a.numero, e.target.value)}
              aria-describedby={`${idNotas}-dica`}
            />
            <p id={`${idNotas}-dica`} className={styles.dica}>
              Salvo automaticamente neste navegador.
            </p>
          </div>
        </aside>
      </div>

      {tecnologias.length ? (
        <section className={styles.bloco} aria-labelledby="tecnologias">
          <h2 id="tecnologias">Tecnologias deste vídeo</h2>
          <ul className={styles.tecnologias}>
            {tecnologias.map((t) => (
              <li key={t.numero}>
                <Link to={`/stack#tec-${t.numero}`}>{t.nome}</Link>
                <SeloStatus status={t.status} nota={t.nota} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {praticar.length ? (
        <section className={styles.bloco} aria-labelledby="praticar">
          <h2 id="praticar">Pratique no hub</h2>
          <ul className={styles.projetos}>
            {praticar.map((p) => (
              <li key={p.numero}>
                <a href={enderecoDoProjeto(p.numero)}>
                  {String(p.numero).padStart(2, '0')} · {p.nome}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <nav aria-label="Na ordem da trilha" className={styles.vizinhos}>
        {anterior ? (
          <Link to={`/aprendizado/${anterior.numero}`} rel="prev">
            <span>← Anterior</span>
            {anterior.numero}. {anterior.titulo}
          </Link>
        ) : (
          <span />
        )}
        {proximo ? (
          <Link to={`/aprendizado/${proximo.numero}`} rel="next" className={styles.proximo}>
            <span>Próximo →</span>
            {proximo.numero}. {proximo.titulo}
          </Link>
        ) : null}
      </nav>
    </article>
  )
}
/* Fim da página do aprendizado. */
