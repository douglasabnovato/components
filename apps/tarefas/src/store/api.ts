/*
 * RTK Query: o estado do servidor (tarefas) fica no cache do Redux, com
 * etiquetas para invalidar a lista e atualização otimista ao concluir.
 * O fetch é injetável para os testes chamarem a API em memória.
 */
import type { AlteracaoTarefa, ConsultaTarefas, NovaTarefa, Tarefa } from '@components/contratos'
import { PRAZO_API_MS, statusForaDoAr } from '@components/ui'
import { createApi, fetchBaseQuery, type FetchBaseQueryError } from '@reduxjs/toolkit/query/react'

/*
 * Cria a fatia de API sobre a URL base e o fetch informados. O prazo cancela
 * o pedido que não responde (status TIMEOUT_ERROR), para a tela não ficar
 * carregando para sempre quando o servidor publicado está fora do ar.
 */
export function criarApiTarefas(base: string, fetchFn?: typeof fetch, prazoMs = PRAZO_API_MS) {
  const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: base, fetchFn, timeout: prazoMs }),
    tagTypes: ['Tarefa'],
    endpoints: (build) => ({
      listarTarefas: build.query<Tarefa[], ConsultaTarefas>({
        query: ({ busca, situacao }) => ({
          url: '/tarefas',
          params: {
            ...(busca ? { busca } : {}),
            ...(situacao && situacao !== 'todas' ? { situacao } : {}),
          },
        }),
        providesTags: (resultado) => [
          { type: 'Tarefa', id: 'LISTA' },
          ...(resultado ?? []).map((t) => ({ type: 'Tarefa' as const, id: t.id })),
        ],
      }),
      criarTarefa: build.mutation<Tarefa, NovaTarefa>({
        query: (corpo) => ({ url: '/tarefas', method: 'POST', body: corpo }),
        invalidatesTags: [{ type: 'Tarefa', id: 'LISTA' }],
      }),
      alterarTarefa: build.mutation<Tarefa, { id: string; alteracao: AlteracaoTarefa }>({
        query: ({ id, alteracao }) => ({ url: `/tarefas/${id}`, method: 'PATCH', body: alteracao }),
        async onQueryStarted({ id, alteracao }, { dispatch, getState, queryFulfilled }) {
          const listas = api.util.selectCachedArgsForQuery(getState(), 'listarTarefas')
          const desfazer = listas.map((args) =>
            dispatch(
              api.util.updateQueryData('listarTarefas', args, (rascunho) => {
                const tarefa = rascunho.find((t) => t.id === id)
                if (tarefa) Object.assign(tarefa, alteracao)
              }),
            ),
          )
          try {
            await queryFulfilled
          } catch {
            desfazer.forEach((d) => d.undo())
          }
        },
        invalidatesTags: [{ type: 'Tarefa', id: 'LISTA' }],
      }),
      excluirTarefa: build.mutation<void, string>({
        query: (id) => ({ url: `/tarefas/${id}`, method: 'DELETE' }),
        invalidatesTags: [{ type: 'Tarefa', id: 'LISTA' }],
      }),
      limparConcluidas: build.mutation<{ removidas: number }, void>({
        query: () => ({ url: '/tarefas/concluidas', method: 'DELETE' }),
        invalidatesTags: [{ type: 'Tarefa', id: 'LISTA' }],
      }),
    }),
  })
  return api
}

export type ApiTarefas = ReturnType<typeof criarApiTarefas>

/*
 * Diz se o erro é de API fora do ar: falha de rede, prazo esgotado ou 502,
 * 503 e 504 do encaminhamento do site publicado.
 */
export function apiForaDoAr(erro: unknown): boolean {
  const e = erro as { status?: unknown; originalStatus?: unknown } | undefined
  /* Página de erro em HTML vira PARSING_ERROR; o status real fica em originalStatus. */
  return (
    e?.status === 'FETCH_ERROR' ||
    e?.status === 'TIMEOUT_ERROR' ||
    statusForaDoAr(e?.status) ||
    statusForaDoAr(e?.originalStatus)
  )
}

/* Extrai a mensagem do corpo de erro da API ({ erro }) ou uma mensagem padrão. */
export function mensagemDeErro(erro: unknown): string {
  const e = erro as FetchBaseQueryError | undefined
  if (!e) return ''
  if (apiForaDoAr(e)) return 'A API não respondeu. Tente de novo em alguns minutos.'
  const dados = (e as { data?: { erro?: string } }).data
  return dados?.erro ?? 'Algo deu errado. Tente de novo.'
}
/* Fim da API de tarefas. */
