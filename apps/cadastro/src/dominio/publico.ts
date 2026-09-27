/*
 * API pública do Cadastro para outros projetos do monorepo: o hub usa o
 * repositório em memória real e as regras de validação do contrato.
 */
export { criarRepositorioMemoria } from '../dados/repositorioMemoria'
export { ErroRepositorio, type RepositorioClientes } from '../dados/repositorio'
export { clientesIniciais, iniciais } from './clientes'
export { esquemaDadosCliente, errosPorCampo, type Cliente } from '@components/contratos'
/* Fim da API pública. */
