/*
 * Início da Pelada: organizador, próximos jogos (cards com vagas) e jogos
 * encerrados. A situação de cada jogo é derivada da data e das vagas.
 */
import { BotaoPilula, CardEvento } from '@components/ui'
import { Link } from 'react-router'
import { EstadoVazio } from '../../componentes/Estados/Estados'
import { Organizador } from '../../componentes/Organizador/Organizador'
import { usePelada } from '../../dados/estado'
import { dataDoJogo, formatarData, situacaoDoJogo } from '../../dominio/pelada'
import type { Jogo } from '../../dominio/tipos'
import styles from './Inicio.module.css'

/* Card de um jogo com o link para a lista. */
function CartaoJogo({ jogo, agora }: { jogo: Jogo; agora: Date }) {
  const situacao = situacaoDoJogo(jogo, agora)
  return (
    <CardEvento
      titulo={jogo.titulo}
      data={formatarData(jogo.data)}
      dataIso={jogo.data}
      local={jogo.local}
      categoria={jogo.modalidade}
      status={{ atual: jogo.confirmados.length, total: jogo.vagas, rotulo: 'confirmados' }}
    >
      <p className={styles.detalhe}>
        {jogo.porTime} por time
        {jogo.espera.length ? ` · ${jogo.espera.length} na espera` : ''}
        {situacao === 'encerrado' ? ' · encerrado' : ''}
      </p>
      <Link to={`/jogo/${jogo.id}`} className={styles.abrir}>
        {situacao === 'encerrado' ? 'Ver lista' : 'Ver lista e confirmar'}{' '}
        <span className="visualmente-oculto">de {jogo.titulo}</span>
      </Link>
    </CardEvento>
  )
}

/* Monta o organizador e as listas de jogos. */
export function Inicio() {
  const { estado, despachar, agora } = usePelada()
  const hoje = agora()
  const ordenados = [...estado.jogos].sort(
    (a, b) => dataDoJogo(a).getTime() - dataDoJogo(b).getTime(),
  )
  const proximos = ordenados.filter((j) => situacaoDoJogo(j, hoje) !== 'encerrado')
  const encerrados = ordenados.filter((j) => situacaoDoJogo(j, hoje) === 'encerrado').reverse()

  return (
    <div className={styles.pagina}>
      <header className={styles.topo}>
        <div>
          <p className={styles.rotulo}>Projeto 06 · confirmou, entrou</p>
          <h1 className={styles.titulo}>Próximos jogos</h1>
          <p className={styles.resumo}>
            Cada jogo tem limite de vagas. Quem chega depois entra na espera e sobe sozinho quando
            alguém desiste. Com a lista fechada, o sorteio monta times equilibrados.
          </p>
        </div>
        <Organizador
          usuario={estado.organizador}
          aoTrocar={(usuario) => despachar({ tipo: 'organizador', usuario })}
        />
      </header>

      {proximos.length === 0 ? (
        <EstadoVazio
          titulo="Nenhum jogo marcado"
          acoes={
            <BotaoPilula comoFilho>
              <Link to="/novo">Marcar um jogo</Link>
            </BotaoPilula>
          }
        >
          Crie o primeiro jogo e compartilhe a lista com a turma.
        </EstadoVazio>
      ) : (
        <ul className={styles.grade} aria-label="Próximos jogos">
          {proximos.map((jogo) => (
            <li key={jogo.id}>
              <CartaoJogo jogo={jogo} agora={hoje} />
            </li>
          ))}
        </ul>
      )}

      {encerrados.length ? (
        <section aria-labelledby="encerrados" className={styles.encerrados}>
          <h2 id="encerrados">Jogos encerrados</h2>
          <ul className={styles.grade}>
            {encerrados.map((jogo) => (
              <li key={jogo.id}>
                <CartaoJogo jogo={jogo} agora={hoje} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  )
}
/* Fim do Início. */
