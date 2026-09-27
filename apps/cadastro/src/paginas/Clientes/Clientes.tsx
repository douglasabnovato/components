/*
 * Página de clientes: tabela e formulário dividem o mesmo espaço (seletor
 * Tabela ⇄ Formulário, como no projeto original) e a origem dos dados muda
 * pelo seletor Memória ⇄ API, sem trocar nenhum componente da tela.
 */
import { ORDENS_CLIENTE, type Cliente, type OrdemCliente } from '@components/contratos'
import { BotaoPilula, Dialogo, SeletorPilula, useAvisos } from '@components/ui'
import { useDeferredValue, useId, useState } from 'react'
import { EstadoVazio } from '../../componentes/Estados/Estados'
import { FormularioCliente } from '../../componentes/FormularioCliente/FormularioCliente'
import { TabelaClientes } from '../../componentes/TabelaClientes/TabelaClientes'
import { useClientes, useExcluirCliente, useOrigem, useSalvarCliente } from '../../dados/consultas'
import { ErroRepositorio, type Origem } from '../../dados/repositorio'
import { rotulosOrdem } from '../../dominio/clientes'
import styles from './Clientes.module.css'

type Vista = 'tabela' | 'formulario'

const origens: { valor: Origem; rotulo: string }[] = [
  { valor: 'memoria', rotulo: 'Memória' },
  { valor: 'api', rotulo: 'API' },
]

const vistas: { valor: Vista; rotulo: string }[] = [
  { valor: 'tabela', rotulo: 'Tabela' },
  { valor: 'formulario', rotulo: 'Formulário' },
]

/* Controla vista, filtros, edição e exclusão. */
export function Clientes() {
  const [origem, setOrigem] = useOrigem()
  const [vista, setVista] = useState<Vista>('tabela')
  const [editando, setEditando] = useState<Cliente | undefined>()
  const [paraExcluir, setParaExcluir] = useState<Cliente | null>(null)
  const [busca, setBusca] = useState('')
  const [ordem, setOrdem] = useState<OrdemCliente>('nome')
  const buscaAdiada = useDeferredValue(busca)
  const avisar = useAvisos()
  const idPainel = useId()

  const consulta = useClientes({ busca: buscaAdiada.trim() || undefined, ordem })
  const excluir = useExcluirCliente()
  const recriar = useSalvarCliente()
  const clientes = consulta.data ?? []
  const indisponivel =
    consulta.error instanceof ErroRepositorio && consulta.error.tipo === 'indisponivel'

  /* Abre o formulário vazio ou com o cliente escolhido. */
  function abrirFormulario(cliente?: Cliente) {
    setEditando(cliente)
    setVista('formulario')
  }

  /* Troca de vista pelo seletor; voltar à tabela descarta a edição. */
  function mudarVista(nova: Vista) {
    if (nova === 'tabela') setEditando(undefined)
    setVista(nova)
  }

  /* Confirma a exclusão e oferece desfazer (recria com os mesmos dados). */
  async function confirmarExclusao() {
    const alvo = paraExcluir
    setParaExcluir(null)
    if (!alvo) return
    try {
      await excluir.mutateAsync(alvo.id)
      avisar({
        mensagem: `${alvo.nome} excluído.`,
        acao: {
          rotulo: 'Desfazer',
          executar: () =>
            recriar.mutate({ dados: { nome: alvo.nome, email: alvo.email, idade: alvo.idade } }),
        },
      })
    } catch (erro) {
      avisar({ mensagem: erro instanceof Error ? erro.message : 'Não foi possível excluir.' })
    }
  }

  return (
    <div className={styles.pagina}>
      <header className={styles.topo}>
        <p className={styles.rotulo}>Projeto 02 · repositório trocável</p>
        <h1 className={styles.titulo}>Clientes em memória ou na API, sem trocar a tela.</h1>
        <p className={styles.resumo}>
          A tela conversa com um contrato. Troque a origem e veja a mesma tabela, o mesmo formulário
          e as mesmas regras funcionando sobre dados diferentes.
        </p>
      </header>

      <div className={styles.controles}>
        <div className={styles.grupo}>
          <span className={styles.legenda} aria-hidden="true">
            Origem dos dados
          </span>
          <SeletorPilula
            rotulo="Origem dos dados"
            opcoes={origens}
            valor={origem}
            aoMudar={setOrigem}
            controla={idPainel}
          />
        </div>
        <div className={styles.grupo}>
          <span className={styles.legenda} aria-hidden="true">
            Vista
          </span>
          <SeletorPilula
            rotulo="Vista"
            opcoes={vistas}
            valor={vista}
            aoMudar={mudarVista}
            controla={idPainel}
          />
        </div>
      </div>

      <div id={idPainel} className={styles.painel}>
        {vista === 'formulario' ? (
          <FormularioCliente
            key={`${origem}-${editando?.id ?? 'novo'}`}
            cliente={editando}
            aoCancelar={() => mudarVista('tabela')}
            aoSalvar={(salvo, criado) => {
              avisar({
                mensagem: criado ? `${salvo.nome} cadastrado.` : `${salvo.nome} atualizado.`,
              })
              mudarVista('tabela')
            }}
          />
        ) : indisponivel ? (
          <EstadoVazio
            titulo="A API não respondeu"
            acoes={
              <>
                <BotaoPilula onClick={() => setOrigem('memoria')}>Usar memória</BotaoPilula>
                <BotaoPilula variante="vazado" onClick={() => consulta.refetch()}>
                  Tentar de novo
                </BotaoPilula>
              </>
            }
          >
            Na raiz do monorepo, rode <code>pnpm dev:api</code> e tente de novo. Enquanto isso, a
            tela funciona igual com os dados em memória.
          </EstadoVazio>
        ) : (
          <>
            <div className={styles.filtros}>
              <div className={styles.campo}>
                <label htmlFor={`${idPainel}-busca`}>Buscar</label>
                <input
                  id={`${idPainel}-busca`}
                  type="search"
                  value={busca}
                  placeholder="Nome ou e-mail"
                  onChange={(e) => setBusca(e.target.value)}
                />
              </div>
              <div className={styles.campo}>
                <label htmlFor={`${idPainel}-ordem`}>Ordenar por</label>
                <select
                  id={`${idPainel}-ordem`}
                  value={ordem}
                  onChange={(e) => setOrdem(e.target.value as OrdemCliente)}
                >
                  {ORDENS_CLIENTE.map((o) => (
                    <option key={o} value={o}>
                      {rotulosOrdem[o]}
                    </option>
                  ))}
                </select>
              </div>
              <BotaoPilula icone="+" onClick={() => abrirFormulario()} className={styles.novo}>
                Novo cliente
              </BotaoPilula>
            </div>
            <p className={styles.contagem} role="status">
              {consulta.isPending
                ? 'Carregando clientes…'
                : `${clientes.length} ${clientes.length === 1 ? 'cliente' : 'clientes'} · origem: ${origem === 'api' ? 'API' : 'memória'}`}
            </p>
            {!consulta.isPending && clientes.length === 0 ? (
              <EstadoVazio titulo={busca ? 'Nenhum cliente encontrado' : 'Nenhum cliente ainda'}>
                {busca
                  ? 'Tente outro nome ou e-mail.'
                  : 'Cadastre o primeiro pelo botão "Novo cliente".'}
              </EstadoVazio>
            ) : (
              <TabelaClientes
                clientes={clientes}
                carregando={consulta.isPending}
                aoEditar={abrirFormulario}
                aoExcluir={setParaExcluir}
              />
            )}
          </>
        )}
      </div>

      <Dialogo
        aberto={paraExcluir !== null}
        titulo={`Excluir ${paraExcluir?.nome ?? ''}?`}
        aoFechar={() => setParaExcluir(null)}
        acoes={
          <>
            <BotaoPilula variante="vazado" onClick={() => setParaExcluir(null)}>
              Cancelar
            </BotaoPilula>
            <BotaoPilula onClick={confirmarExclusao}>Excluir</BotaoPilula>
          </>
        }
      >
        <p>
          O cliente sai da origem {origem === 'api' ? 'API' : 'memória'}. Você poderá desfazer logo
          em seguida.
        </p>
      </Dialogo>
    </div>
  )
}
/* Fim da página de clientes. */
