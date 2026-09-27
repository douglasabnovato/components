/*
 * Camada TanStack Query do Cadastro: a origem (memória ou API) vem da URL,
 * cada origem tem seu próprio cache e toda alteração invalida a lista.
 */
import type { ConsultaClientes, DadosCliente } from '@components/contratos'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createContext, useContext } from 'react'
import { useSearchParams } from 'react-router'
import type { Origem, RepositorioClientes } from './repositorio'

export const RepositoriosContexto = createContext<Record<Origem, RepositorioClientes> | null>(null)

/* Lê a origem da URL (?origem=api); o padrão é memória. */
export function useOrigem(): [Origem, (origem: Origem) => void] {
  const [parametros, setParametros] = useSearchParams()
  const origem: Origem = parametros.get('origem') === 'api' ? 'api' : 'memoria'
  /* Troca a origem mantendo os outros parâmetros. */
  function mudar(nova: Origem) {
    const p = new URLSearchParams(parametros)
    if (nova === 'api') p.set('origem', 'api')
    else p.delete('origem')
    setParametros(p, { replace: true })
  }
  return [origem, mudar]
}

/* Devolve o repositório da origem atual. */
export function useRepositorio() {
  const repositorios = useContext(RepositoriosContexto)
  const [origem] = useOrigem()
  if (!repositorios) throw new Error('useRepositorio precisa de um RepositoriosContexto.Provider')
  return { repositorio: repositorios[origem], origem }
}

/* Lista os clientes com busca e ordenação; a chave separa o cache por origem. */
export function useClientes(consulta: ConsultaClientes) {
  const { repositorio, origem } = useRepositorio()
  return useQuery({
    queryKey: ['clientes', origem, consulta],
    queryFn: () => repositorio.listar(consulta),
    retry: false,
  })
}

/* Cria ou atualiza (com id) e invalida a lista da origem. */
export function useSalvarCliente() {
  const { repositorio, origem } = useRepositorio()
  const cliente = useQueryClient()
  return useMutation({
    mutationFn: ({ id, dados }: { id?: string; dados: DadosCliente }) =>
      id ? repositorio.atualizar(id, dados) : repositorio.criar(dados),
    onSuccess: () => cliente.invalidateQueries({ queryKey: ['clientes', origem] }),
  })
}

/* Exclui e invalida a lista da origem. */
export function useExcluirCliente() {
  const { repositorio, origem } = useRepositorio()
  const cliente = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => repositorio.excluir(id),
    onSuccess: () => cliente.invalidateQueries({ queryKey: ['clientes', origem] }),
  })
}
/* Fim da camada de consultas. */
