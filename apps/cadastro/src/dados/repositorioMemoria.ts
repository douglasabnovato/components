/*
 * Repositório em memória: aplica as mesmas regras da API (validação pelo
 * contrato, e-mail único, busca e ordenação) sem sair do navegador.
 */
import {
  errosPorCampo,
  esquemaDadosCliente,
  type Cliente,
  type DadosCliente,
} from '@components/contratos'
import { clientesIniciais } from '../dominio/clientes'
import { ErroRepositorio, type RepositorioClientes } from './repositorio'

const CONFLITO = { email: 'Este e-mail já está cadastrado.' }

/* Remove acentos e caixa para a busca. */
function normalizar(texto: string) {
  return texto
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
}

/* Cria o repositório com uma lista inicial (cópia) e um gerador de ids. */
export function criarRepositorioMemoria(
  iniciais: Cliente[] = clientesIniciais(),
  gerarId: () => string = () => crypto.randomUUID(),
  agora: () => Date = () => new Date(),
): RepositorioClientes {
  let clientes = iniciais.map((c) => ({ ...c }))

  /* Valida pelo contrato ou lança erro de validação. */
  function validar(dados: DadosCliente) {
    const r = esquemaDadosCliente.safeParse(dados)
    if (!r.success)
      throw new ErroRepositorio('validacao', 'Dados inválidos.', errosPorCampo(r.error.issues))
    return r.data
  }

  /* Busca por id ou lança não encontrado. */
  function achar(id: string) {
    const cliente = clientes.find((c) => c.id === id)
    if (!cliente) throw new ErroRepositorio('nao-encontrado', 'Cliente não encontrado.')
    return cliente
  }

  /* Lança conflito se o e-mail já pertencer a outro cliente. */
  function conferirEmail(email: string, ignorarId?: string) {
    if (clientes.some((c) => c.email === email && c.id !== ignorarId))
      throw new ErroRepositorio('conflito', 'E-mail em uso.', CONFLITO)
  }

  return {
    async listar({ busca, ordem = 'nome' } = {}) {
      const termo = busca ? normalizar(busca.trim()) : ''
      const filtrados = clientes.filter(
        (c) => !termo || normalizar(`${c.nome} ${c.email}`).includes(termo),
      )
      const porNome = (a: Cliente, b: Cliente) => a.nome.localeCompare(b.nome, 'pt-BR')
      const comparar = {
        nome: porNome,
        idade: (a: Cliente, b: Cliente) => a.idade - b.idade || porNome(a, b),
        recentes: (a: Cliente, b: Cliente) => b.criadoEm.localeCompare(a.criadoEm) || porNome(a, b),
      }[ordem]
      return [...filtrados].sort(comparar).map((c) => ({ ...c }))
    },
    async obter(id) {
      return { ...achar(id) }
    },
    async criar(dados) {
      const validos = validar(dados)
      conferirEmail(validos.email)
      const cliente: Cliente = { ...validos, id: gerarId(), criadoEm: agora().toISOString() }
      clientes = [...clientes, cliente]
      return { ...cliente }
    },
    async atualizar(id, dados) {
      const atual = achar(id)
      const validos = validar(dados)
      conferirEmail(validos.email, id)
      const novo = { ...atual, ...validos }
      clientes = clientes.map((c) => (c.id === id ? novo : c))
      return { ...novo }
    },
    async excluir(id) {
      achar(id)
      clientes = clientes.filter((c) => c.id !== id)
    },
  }
}
/* Fim do repositório em memória. */
