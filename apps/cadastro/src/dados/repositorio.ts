/*
 * Contrato do repositório de clientes. A tela só conhece este contrato; a
 * origem dos dados (memória ou API) é escolhida por configuração, e as duas
 * implementações passam pela mesma bateria de testes (contrato.ts).
 */
import type { Cliente, ConsultaClientes, DadosCliente } from '@components/contratos'

export type TipoErro = 'validacao' | 'conflito' | 'nao-encontrado' | 'indisponivel'

/* Erro de repositório com tipo e mensagens por campo, igual para as duas origens. */
export class ErroRepositorio extends Error {
  constructor(
    readonly tipo: TipoErro,
    mensagem: string,
    readonly campos: Record<string, string> = {},
  ) {
    super(mensagem)
    this.name = 'ErroRepositorio'
  }
}

export type RepositorioClientes = {
  listar(consulta?: ConsultaClientes): Promise<Cliente[]>
  obter(id: string): Promise<Cliente>
  criar(dados: DadosCliente): Promise<Cliente>
  atualizar(id: string, dados: DadosCliente): Promise<Cliente>
  excluir(id: string): Promise<void>
}

export type Origem = 'memoria' | 'api'
/* Fim do contrato do repositório. */
