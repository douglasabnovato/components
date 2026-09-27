/*
 * Página do jogo: confirmação com limite de vagas e espera, listas com
 * "retirar", sorteio equilibrado, copiar a lista para o grupo e excluir o jogo
 * com desfazer. Cada ação chama uma regra pura do domínio e despacha o resultado.
 */
import { BotaoPilula, Campo, useAvisos } from '@components/ui'
import { useId, useRef, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { EstadoVazio } from '../../componentes/Estados/Estados'
import { ListaJogadores } from '../../componentes/ListaJogadores/ListaJogadores'
import { Times } from '../../componentes/Times/Times'
import { usePelada } from '../../dados/estado'
import {
  confirmar,
  desistir,
  formatarData,
  situacaoDoJogo,
  sortearTimes,
  textoParaCompartilhar,
  timesDoSorteio,
} from '../../dominio/pelada'
import { NIVEIS, type Jogador } from '../../dominio/tipos'
import styles from './Jogo.module.css'

const rotulosSituacao = {
  aberto: 'Vagas abertas',
  lotado: 'Lista cheia · entra na espera',
  encerrado: 'Jogo encerrado',
}

/* Renderiza o jogo da URL ou o aviso de não encontrado. */
export function Jogo() {
  const { id } = useParams()
  const { estado, despachar, agora, novoId } = usePelada()
  const avisar = useAvisos()
  const navegar = useNavigate()
  const idForm = useId()
  const campoNome = useRef<HTMLInputElement>(null)
  const [nome, setNome] = useState('')
  const [nivel, setNivel] = useState(3)
  const [erro, setErro] = useState('')
  const [erroSorteio, setErroSorteio] = useState('')

  const jogo = estado.jogos.find((j) => j.id === id)
  if (!jogo) {
    return (
      <EstadoVazio
        nivel="h1"
        titulo="Jogo não encontrado"
        acoes={
          <BotaoPilula comoFilho>
            <Link to="/">Ver jogos</Link>
          </BotaoPilula>
        }
      >
        Talvez ele tenha sido excluído.
      </EstadoVazio>
    )
  }

  const atual = jogo
  const situacao = situacaoDoJogo(atual, agora())
  const sorteio = timesDoSorteio(atual)

  /* Confirma presença e avisa se entrou na lista ou na espera. */
  function enviar(evento: FormEvent) {
    evento.preventDefault()
    const resultado = confirmar(atual, { nome, nivel }, novoId(), agora())
    if (!resultado.ok) {
      setErro(resultado.erro)
      campoNome.current?.focus()
      return
    }
    setErro('')
    setNome('')
    despachar({ tipo: 'atualizar', jogo: resultado.valor.jogo })
    const nomeLimpo = nome.trim()
    avisar({
      mensagem:
        resultado.valor.destino === 'confirmados'
          ? `${nomeLimpo} confirmado.`
          : `Lista cheia: ${nomeLimpo} entrou na espera (posição ${resultado.valor.jogo.espera.length}).`,
    })
    campoNome.current?.focus()
  }

  /* Retira um jogador; se abrir vaga, o primeiro da espera sobe. */
  function retirar(jogador: Jogador) {
    const { jogo: novo, promovido } = desistir(atual, jogador.id)
    despachar({ tipo: 'atualizar', jogo: novo })
    avisar({
      mensagem: promovido
        ? `${jogador.nome} saiu. ${promovido.nome} subiu da espera.`
        : `${jogador.nome} saiu da lista.`,
      acao: { rotulo: 'Desfazer', executar: () => despachar({ tipo: 'atualizar', jogo: atual }) },
    })
  }

  /* Sorteia os times ou mostra quantos jogadores faltam. */
  function sortear() {
    const resultado = sortearTimes(atual, agora())
    if (!resultado.ok) {
      setErroSorteio(resultado.erro)
      return
    }
    setErroSorteio('')
    despachar({ tipo: 'atualizar', jogo: resultado.valor })
  }

  /* Copia o texto da lista para a área de transferência. */
  async function copiar() {
    try {
      await navigator.clipboard.writeText(textoParaCompartilhar(atual))
      avisar({ mensagem: 'Lista copiada. É só colar no grupo.' })
    } catch {
      avisar({ mensagem: 'Não foi possível copiar. Use o texto em "Ver texto da lista".' })
    }
  }

  /* Exclui o jogo e oferece desfazer. */
  function excluir() {
    const posicao = estado.jogos.findIndex((j) => j.id === atual.id)
    despachar({ tipo: 'excluir', id: atual.id })
    navegar('/')
    avisar({
      mensagem: `Jogo "${atual.titulo}" excluído.`,
      acao: {
        rotulo: 'Desfazer',
        executar: () => despachar({ tipo: 'restaurar', jogo: atual, posicao }),
      },
    })
  }

  return (
    <article className={styles.pagina}>
      <header className={styles.cabecalho}>
        <p className={styles.rotulo}>{atual.modalidade}</p>
        <h1 className={styles.titulo}>{atual.titulo}</h1>
        <dl className={styles.meta}>
          <div>
            <dt>Quando</dt>
            <dd>
              <time dateTime={atual.data}>{formatarData(atual.data)}</time>
            </dd>
          </div>
          <div>
            <dt>Onde</dt>
            <dd>{atual.local}</dd>
          </div>
          <div>
            <dt>Vagas</dt>
            <dd>
              {atual.confirmados.length}/{atual.vagas} · {atual.porTime} por time
            </dd>
          </div>
        </dl>
        <p className={styles.situacao} data-situacao={situacao}>
          {rotulosSituacao[situacao]}
        </p>
        <div className={styles.acoes}>
          <BotaoPilula variante="vazado" onClick={copiar} icone="⧉">
            Copiar lista
          </BotaoPilula>
          <BotaoPilula variante="vazado" onClick={excluir}>
            Excluir jogo
          </BotaoPilula>
        </div>
      </header>

      {situacao !== 'encerrado' ? (
        <form className={styles.confirmar} onSubmit={enviar} aria-labelledby={`${idForm}-titulo`}>
          <h2 id={`${idForm}-titulo`} className={styles.subtitulo}>
            Confirmar presença
          </h2>
          <div className={styles.campos}>
            <Campo rotulo="Seu nome" htmlFor={`${idForm}-nome`} erro={erro || undefined}>
              <input
                ref={campoNome}
                id={`${idForm}-nome`}
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                autoComplete="given-name"
                aria-invalid={erro ? true : undefined}
                aria-describedby={erro ? `${idForm}-nome-erro` : undefined}
              />
            </Campo>
            <Campo rotulo="Nível" htmlFor={`${idForm}-nivel`}>
              <select
                id={`${idForm}-nivel`}
                value={nivel}
                onChange={(e) => setNivel(Number(e.target.value))}
              >
                {NIVEIS.map((n) => (
                  <option key={n.valor} value={n.valor}>
                    {n.valor} · {n.rotulo}
                  </option>
                ))}
              </select>
            </Campo>
            <button type="submit" className={styles.enviar}>
              {situacao === 'lotado' ? 'Entrar na espera' : 'Confirmar presença'}
            </button>
          </div>
        </form>
      ) : null}

      <div className={styles.listas}>
        <ListaJogadores
          titulo="Confirmados"
          jogadores={atual.confirmados}
          vazio="Ninguém confirmou ainda. Seja o primeiro!"
          aoRetirar={situacao === 'encerrado' ? undefined : retirar}
        />
        <ListaJogadores
          titulo="Lista de espera"
          jogadores={atual.espera}
          vazio="Sem espera por enquanto."
          aoRetirar={situacao === 'encerrado' ? undefined : retirar}
        />
      </div>

      <section className={styles.sorteio} aria-labelledby="sorteio">
        <div className={styles.cabecalhoSorteio}>
          <h2 id="sorteio" className={styles.subtitulo}>
            Sorteio dos times
          </h2>
          <BotaoPilula onClick={sortear} icone="⚄">
            {sorteio ? 'Sortear de novo' : 'Sortear times'}
          </BotaoPilula>
        </div>
        <p className={styles.explicacao}>
          Quem confirmou primeiro joga primeiro. Os níveis são distribuídos em serpente (A, B, B,
          A…) para os times ficarem parecidos. Qualquer mudança na lista apaga o sorteio.
        </p>
        {erroSorteio ? (
          <p className={styles.erro} role="alert">
            {erroSorteio}
          </p>
        ) : null}
        {sorteio ? <Times times={sorteio.times} reservas={sorteio.reservas} /> : null}
      </section>

      <details className={styles.texto}>
        <summary>Ver texto da lista</summary>
        <pre>{textoParaCompartilhar(atual)}</pre>
      </details>
    </article>
  )
}
/* Fim da página do jogo. */
