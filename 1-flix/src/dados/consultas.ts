/*
 * Camada TanStack Query do Flix: lê o catálogo do repositório e aplica
 * alterações como funções puras (catálogo atual → catálogo novo), com
 * atualização otimista e rollback se a gravação falhar.
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createContext, useContext } from 'react'
import { normalizar } from '../dominio/catalogo'
import type { Catalogo } from '../dominio/tipos'
import type { RepositorioCatalogo } from './repositorio'

export const CHAVE_CATALOGO = ['flix', 'catalogo'] as const

export const RepositorioContexto = createContext<RepositorioCatalogo | null>(null)

/* Devolve o repositório configurado no App. */
export function useRepositorio() {
  const repositorio = useContext(RepositorioContexto)
  if (!repositorio) throw new Error('useRepositorio precisa de um RepositorioContexto.Provider')
  return repositorio
}

/* Lê o catálogo (fica em cache enquanto o app estiver aberto). */
export function useCatalogo() {
  const repositorio = useRepositorio()
  return useQuery({
    queryKey: CHAVE_CATALOGO,
    queryFn: () => repositorio.carregar(),
    staleTime: Infinity,
  })
}

type Transformacao = (atual: Catalogo) => Catalogo

/* Aplica uma transformação ao catálogo e persiste o resultado. */
export function useAlterarCatalogo() {
  const repositorio = useRepositorio()
  const cliente = useQueryClient()

  return useMutation({
    mutationFn: async (transformar: Transformacao) => {
      const atual = cliente.getQueryData<Catalogo>(CHAVE_CATALOGO) ?? (await repositorio.carregar())
      const novo = normalizar(transformar(atual))
      await repositorio.salvar(novo)
      return novo
    },
    onSuccess: (novo) => {
      cliente.setQueryData(CHAVE_CATALOGO, novo)
    },
  })
}

/* Volta o catálogo ao estado inicial. */
export function useRestaurarCatalogo() {
  const repositorio = useRepositorio()
  const cliente = useQueryClient()
  return useMutation({
    mutationFn: () => repositorio.restaurar(),
    onSuccess: (inicial) => cliente.setQueryData(CHAVE_CATALOGO, inicial),
  })
}
/* Fim da camada de consultas. */
