/*
 * Página das Tarefas: faixa com o formulário sobreposto (um campo para criar
 * e para buscar, como no todo-app original), filtros por situação e a lista.
 * O estado do servidor vem do RTK Query; o do campo, da fatia de interface.
 */
import { SITUACOES_TAREFA, type SituacaoTarefa, type Tarefa } from '@components/contratos'
import { BotaoPilula, BotaoVoltar, SeletorPilula, SkipLink, useAvisos } from '@components/ui'
import { useId, useRef, type KeyboardEvent } from 'react'
import { URL_HUB } from '../../config'
import { EstadoVazio } from '../../componentes/Estados/Estados'
import { ItemTarefa } from '../../componentes/ItemTarefa/ItemTarefa'
import { comandoDaTecla, contar, filtrarPorSituacao } from '../../dominio/tarefas'
import { mensagemDeErro } from '../../store/api'
import { useApiTarefas } from '../../store/contexto'
import { buscar, limpar, situacaoMudou, textoMudou } from '../../store/interface'
import { useDespacho, useSeletor } from '../../store/store'
import styles from './Tarefas.module.css'

const rotulosSituacao: Record<SituacaoTarefa, string> = {
  todas: 'Todas',
  pendentes: 'Pendentes',
  concluidas: 'Concluídas',
}

/* Monta a página inteira e liga os comandos às mutações. */
export function Tarefas() {
  const api = useApiTarefas()
  const despachar = useDespacho()
  const avisar = useAvisos()
  const { texto, busca, situacao, erroBusca } = useSeletor((e) => e.interface)
  const campo = useRef<HTMLInputElement>(null)
  const id = useId()

  const lista = api.useListarTarefasQuery({ busca: busca || undefined })
  const [criar, criacao] = api.useCriarTarefaMutation()
  const [alterar] = api.useAlterarTarefaMutation()
  const [excluir] = api.useExcluirTarefaMutation()
  const [limparConcluidas] = api.useLimparConcluidasMutation()

  const todas = lista.data ?? []
  const visiveis = filtrarPorSituacao(todas, situacao)
  const contagem = contar(todas)
  const erroLista = lista.isError ? mensagemDeErro(lista.error) : ''
  const apiDesligada =
    lista.isError && (lista.error as { status?: unknown }).status === 'FETCH_ERROR'

  /* Cria a tarefa com o texto do campo e devolve o foco a ele. */
  async function adicionar() {
    const descricao = texto.trim()
    if (!descricao) {
      avisar({ mensagem: 'Escreva a tarefa antes de adicionar.' })
      return
    }
    try {
      await criar({ descricao }).unwrap()
      despachar(limpar())
      avisar({ mensagem: `Tarefa "${descricao}" adicionada.` })
    } catch (erro) {
      avisar({ mensagem: mensagemDeErro(erro) })
    }
    campo.current?.focus()
  }

  /* Executa o comando da tecla (Enter, Shift+Enter ou Esc). */
  function aoTeclar(evento: KeyboardEvent<HTMLInputElement>) {
    const comando = comandoDaTecla(evento.key, evento.shiftKey)
    if (!comando) return
    evento.preventDefault()
    if (comando === 'adicionar') void adicionar()
    if (comando === 'buscar') despachar(buscar())
    if (comando === 'limpar') despachar(limpar())
  }

  /* Marca ou desmarca como concluída (atualização otimista no cache). */
  function alternar(tarefa: Tarefa) {
    alterar({ id: tarefa.id, alteracao: { concluida: !tarefa.concluida } })
      .unwrap()
      .catch((erro: unknown) => avisar({ mensagem: mensagemDeErro(erro) }))
  }

  /* Exclui só o que já foi concluído; pendente recebe uma explicação. */
  async function remover(tarefa: Tarefa) {
    if (!tarefa.concluida) {
      avisar({ mensagem: 'Conclua a tarefa antes de excluir.' })
      return
    }
    try {
      await excluir(tarefa.id).unwrap()
      avisar({ mensagem: `Tarefa "${tarefa.descricao}" excluída.` })
    } catch (erro) {
      avisar({ mensagem: mensagemDeErro(erro) })
    }
  }

  /* Remove todas as concluídas de uma vez. */
  async function limparTudo() {
    try {
      const { removidas } = await limparConcluidas().unwrap()
      avisar({
        mensagem: `${removidas} ${removidas === 1 ? 'tarefa concluída removida' : 'tarefas concluídas removidas'}.`,
      })
    } catch (erro) {
      avisar({ mensagem: mensagemDeErro(erro) })
    }
  }

  return (
    <div className={styles.pagina}>
      <SkipLink />
      <header className={styles.faixa}>
        <div className={styles.barraTopo}>
          <BotaoVoltar href={URL_HUB} fixo={false} rotulo="Hub" />
          <p className={styles.marca}>
            <svg viewBox="0 0 64 64" width="32" height="32" aria-hidden="true">
              <rect width="64" height="64" rx="16" fill="#ffffff" />
              <path
                d="M18 33l9 9 19-20"
                fill="none"
                stroke="var(--acento)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Tarefas
          </p>
        </div>
        <div className={styles.chamada}>
          <p className={styles.rotulo}>Projeto 05 · Redux Toolkit + RTK Query</p>
          <h1 className={styles.titulo}>Tarefas com atalhos de teclado e busca por padrão.</h1>
        </div>
      </header>

      <main id="conteudo" tabIndex={-1} className={styles.conteudo}>
        <form
          className={styles.form}
          aria-label="Criar ou buscar tarefas"
          onSubmit={(e) => {
            e.preventDefault()
            void adicionar()
          }}
        >
          <label htmlFor={`${id}-texto`} className={styles.rotuloCampo}>
            Tarefa ou padrão de busca
          </label>
          <input
            ref={campo}
            id={`${id}-texto`}
            className={styles.campo}
            value={texto}
            placeholder="Ex.: Estudar RTK Query  ·  ^compr"
            autoComplete="off"
            aria-describedby={`${id}-atalhos${erroBusca ? ` ${id}-erro` : ''}`}
            aria-invalid={erroBusca ? true : undefined}
            onChange={(e) => despachar(textoMudou(e.target.value))}
            onKeyDown={aoTeclar}
          />
          <div className={styles.botoes}>
            <button type="submit" className={styles.principal} disabled={criacao.isLoading}>
              Adicionar
            </button>
            <button type="button" className={styles.secundario} onClick={() => despachar(buscar())}>
              Buscar
            </button>
            <button type="button" className={styles.secundario} onClick={() => despachar(limpar())}>
              Limpar
            </button>
          </div>
          <p id={`${id}-atalhos`} className={styles.atalhos}>
            <kbd>Enter</kbd> adiciona · <kbd>Shift</kbd>+<kbd>Enter</kbd> busca (aceita expressão
            regular) · <kbd>Esc</kbd> limpa
          </p>
          {erroBusca ? (
            <p id={`${id}-erro`} className={styles.erro} role="alert">
              {erroBusca}
            </p>
          ) : null}
        </form>

        <div className={styles.controles}>
          <SeletorPilula
            rotulo="Situação"
            opcoes={SITUACOES_TAREFA.map((s) => ({ valor: s, rotulo: rotulosSituacao[s] }))}
            valor={situacao}
            aoMudar={(s) => despachar(situacaoMudou(s))}
          />
          <p className={styles.contagem} role="status">
            {lista.isLoading
              ? 'Carregando tarefas…'
              : `${contagem.pendentes} ${contagem.pendentes === 1 ? 'pendente' : 'pendentes'} · ${contagem.concluidas} ${contagem.concluidas === 1 ? 'concluída' : 'concluídas'}${busca ? ` · busca: /${busca}/i` : ''}`}
          </p>
          {contagem.concluidas ? (
            <BotaoPilula variante="vazado" onClick={limparTudo}>
              Limpar concluídas
            </BotaoPilula>
          ) : null}
        </div>

        {lista.isLoading ? (
          <ul className={styles.lista} aria-hidden="true">
            {[1, 2, 3].map((n) => (
              <li key={n} className={styles.esqueleto}>
                <span />
                <span />
              </li>
            ))}
          </ul>
        ) : apiDesligada ? (
          <EstadoVazio
            titulo="A API não respondeu"
            acoes={<BotaoPilula onClick={() => lista.refetch()}>Tentar de novo</BotaoPilula>}
          >
            Na raiz do monorepo, rode <code>pnpm dev:api</code>. As tarefas ficam no banco SQL da
            API compartilhada.
          </EstadoVazio>
        ) : erroLista ? (
          <EstadoVazio titulo="Não foi possível listar">{erroLista}</EstadoVazio>
        ) : visiveis.length === 0 ? (
          <EstadoVazio
            titulo={busca ? 'Nada casa com esse padrão' : 'Nenhuma tarefa aqui'}
            acoes={
              busca ? (
                <BotaoPilula variante="vazado" onClick={() => despachar(limpar())}>
                  Limpar busca
                </BotaoPilula>
              ) : undefined
            }
          >
            {busca
              ? `A busca /${busca}/i não encontrou tarefas.`
              : 'Escreva no campo acima e aperte Enter.'}
          </EstadoVazio>
        ) : (
          <ul className={styles.lista} aria-label="Tarefas">
            {visiveis.map((t) => (
              <ItemTarefa
                key={t.id}
                tarefa={t}
                busca={busca}
                aoAlternar={alternar}
                aoExcluir={remover}
              />
            ))}
          </ul>
        )}
      </main>

      <footer className={styles.rodape}>
        <p>
          <strong>Tarefas</strong> é o projeto 05 do hub components. Evolução do todo-app (Express +
          MongoDB + Redux) do curso React + Redux da Cod3r, agora com Redux Toolkit, RTK Query e
          banco SQL.
        </p>
      </footer>
    </div>
  )
}
/* Fim da página das Tarefas. */
