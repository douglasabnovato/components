/*
 * Seção 02 · Cadastro. Referência: faixa preta, título serifado centralizado,
 * seletor em pílula que troca a vista (Tabela ⇄ Formulário) e cards com a
 * ilustração saindo da borda. A demo usa um repositório em memória real.
 */
import { BarraWidget, Campo, CardCategoria, SeletorPilula } from '@components/ui'
import { useId, useState } from 'react'
import { projeto } from '../../dados/projetos'
import { CabecalhoSecao, RodapeSecao, Secao } from '../../componentes/Secao/Secao'
import {
  criarRepositorioMemoria,
  validarCliente,
  type Cliente,
  type ErrosCliente,
} from './clientes'
import styles from './SecaoCadastro.module.css'

type Vista = 'tabela' | 'formulario'

const iniciais: Cliente[] = [
  { id: '1', nome: 'Ana Ribeiro', idade: 34 },
  { id: '2', nome: 'Bruno Costa', idade: 27 },
  { id: '3', nome: 'Carla Souza', idade: 45 },
]

/* Controla a vista, o formulário e as operações no repositório. */
export function SecaoCadastro() {
  const p = projeto(2)
  const [repositorio] = useState(() => criarRepositorioMemoria(iniciais))
  const [clientes, setClientes] = useState(() => repositorio.listar())
  const [vista, setVista] = useState<Vista>('tabela')
  const [editando, setEditando] = useState<string | undefined>()
  const [nome, setNome] = useState('')
  const [idade, setIdade] = useState('')
  const [erros, setErros] = useState<ErrosCliente>({})
  const [aviso, setAviso] = useState('')
  const idPainel = useId()

  /* Abre o formulário vazio ou preenchido com um cliente. */
  function abrirFormulario(cliente?: Cliente) {
    setEditando(cliente?.id)
    setNome(cliente?.nome ?? '')
    setIdade(cliente ? String(cliente.idade) : '')
    setErros({})
    setVista('formulario')
  }

  /* Valida, salva no repositório e volta para a tabela. */
  function salvar() {
    const encontrados = validarCliente(nome, idade)
    setErros(encontrados)
    if (Object.keys(encontrados).length > 0) return
    const salvo = repositorio.salvar({ id: editando, nome: nome.trim(), idade: Number(idade) })
    setClientes(repositorio.listar())
    setAviso(`${salvo.nome} ${editando ? 'atualizado' : 'cadastrado'}.`)
    setVista('tabela')
  }

  /* Remove o cliente e atualiza a lista. */
  function excluir(cliente: Cliente) {
    repositorio.excluir(cliente.id)
    setClientes(repositorio.listar())
    setAviso(`${cliente.nome} excluído.`)
  }

  return (
    <Secao projeto={p} className={styles.secao}>
      <CabecalhoSecao projeto={p} alinhamento="centro" editorial />

      <div className={styles.demo}>
        <div className={styles.barraTopo}>
          <SeletorPilula<Vista>
            rotulo="Vista do cadastro"
            valor={vista}
            aoMudar={(v) => (v === 'formulario' ? abrirFormulario() : setVista(v))}
            controla={idPainel}
            opcoes={[
              { valor: 'tabela', rotulo: 'Tabela' },
              { valor: 'formulario', rotulo: 'Formulário' },
            ]}
          />
        </div>
        <p className="visualmente-oculto" role="status">
          {aviso}
        </p>

        <div id={idPainel} className={styles.painel}>
          {vista === 'tabela' ? (
            <table className={styles.tabela}>
              <caption className="visualmente-oculto">Clientes cadastrados</caption>
              <thead>
                <tr>
                  <th scope="col">Nome</th>
                  <th scope="col">Idade</th>
                  <th scope="col">
                    <span className="visualmente-oculto">Ações</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {clientes.length === 0 ? (
                  <tr>
                    <td colSpan={3} className={styles.vazio}>
                      Nenhum cliente. Use o formulário para cadastrar.
                    </td>
                  </tr>
                ) : (
                  clientes.map((c) => (
                    <tr key={c.id}>
                      <td>{c.nome}</td>
                      <td>{c.idade}</td>
                      <td className={styles.acoes}>
                        <button type="button" onClick={() => abrirFormulario(c)}>
                          Editar <span className="visualmente-oculto">{c.nome}</span>
                        </button>
                        <button type="button" onClick={() => excluir(c)}>
                          Excluir <span className="visualmente-oculto">{c.nome}</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          ) : (
            <BarraWidget
              rotulo={editando ? 'Editar cliente' : 'Novo cliente'}
              acao={editando ? 'Salvar alterações' : 'Cadastrar'}
              aoEnviar={salvar}
              className={styles.formulario}
            >
              <Campo rotulo="Nome" htmlFor="cadastro-nome" erro={erros.nome}>
                <input
                  id="cadastro-nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  aria-invalid={Boolean(erros.nome)}
                  aria-describedby={erros.nome ? 'cadastro-nome-erro' : undefined}
                  autoComplete="off"
                />
              </Campo>
              <Campo rotulo="Idade" htmlFor="cadastro-idade" erro={erros.idade}>
                <input
                  id="cadastro-idade"
                  inputMode="numeric"
                  value={idade}
                  onChange={(e) => setIdade(e.target.value)}
                  aria-invalid={Boolean(erros.idade)}
                  aria-describedby={erros.idade ? 'cadastro-idade-erro' : undefined}
                />
              </Campo>
            </BarraWidget>
          )}
        </div>
      </div>

      <div className={styles.cards}>
        <CardCategoria
          titulo="Em memória"
          descricao="Os dados vivem na sessão. Ideal para demonstrar e testar sem servidor."
          midia={<IlustracaoMemoria />}
        />
        <CardCategoria
          titulo="Via API"
          descricao="Mesmo contrato, agora com HTTP e banco. A tela não muda uma linha."
          midia={<IlustracaoApi />}
        />
      </div>

      <RodapeSecao projeto={p} />
    </Secao>
  )
}

/* Ilustração de um chip de memória. */
function IlustracaoMemoria() {
  return (
    <svg viewBox="0 0 160 120">
      <rect x="20" y="30" width="120" height="60" rx="10" fill="#3DDC97" />
      <rect x="36" y="44" width="24" height="32" rx="4" fill="#0B0C10" />
      <rect x="68" y="44" width="24" height="32" rx="4" fill="#0B0C10" />
      <rect x="100" y="44" width="24" height="32" rx="4" fill="#0B0C10" />
      {[30, 50, 70, 90, 110, 130].map((x) => (
        <rect key={x} x={x - 3} y="90" width="6" height="12" rx="2" fill="#a9aebb" />
      ))}
    </svg>
  )
}

/* Ilustração de um servidor conectado. */
function IlustracaoApi() {
  return (
    <svg viewBox="0 0 160 120">
      <rect x="40" y="16" width="80" height="26" rx="8" fill="#f2f3f5" />
      <rect x="40" y="48" width="80" height="26" rx="8" fill="#f2f3f5" />
      <circle cx="56" cy="29" r="5" fill="#3DDC97" />
      <circle cx="56" cy="61" r="5" fill="#3DDC97" />
      <path d="M80 74v18M50 104h60" stroke="#3DDC97" strokeWidth="6" strokeLinecap="round" />
      <circle cx="80" cy="104" r="9" fill="#3DDC97" />
    </svg>
  )
}
/* Fim da seção Cadastro. */
