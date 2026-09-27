/*
 * Testes de integração das Tarefas contra a API de verdade (Hono + PGlite em
 * memória): atalhos, busca por regex com destaque, conclusão otimista,
 * exclusão só de concluídas, limpar concluídas, API desligada e axe. O banco
 * abre uma vez e volta ao estado inicial em cada teste.
 */
import { abrirBanco, criarApp, reiniciarBanco } from '@components/api'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { violacoesAxe } from '@components/ui/testes/axe'
import { describe, expect, it } from 'vitest'
import { App } from '../App'

const bancoDaApi = abrirBanco()

/* Monta um fetch que entrega /api/... para a API em memória, com o banco reiniciado. */
async function fetchDaApi() {
  const { banco, cliente } = await bancoDaApi
  await reiniciarBanco(cliente)
  const app = criarApp(banco)
  return (async (entrada: RequestInfo | URL, init?: RequestInit) => {
    const pedido = entrada instanceof Request ? entrada : new Request(String(entrada), init)
    const url = new URL(pedido.url)
    const corpo =
      pedido.method === 'GET' || pedido.method === 'HEAD' ? undefined : await pedido.text()
    return app.request(url.pathname.replace(/^\/api/, '') + url.search, {
      method: pedido.method,
      headers: pedido.headers,
      body: corpo || undefined,
    })
  }) as typeof fetch
}

/* Renderiza o App com a API em memória. */
async function abrir() {
  const usuario = userEvent.setup()
  const fetchFn = await fetchDaApi()
  const resultado = render(<App base="http://localhost/api" fetchFn={fetchFn} />)
  await screen.findByRole('list', { name: 'Tarefas' })
  return { usuario, ...resultado }
}

/* Nomes das tarefas visíveis (texto de cada rótulo). */
function tarefasVisiveis() {
  return within(screen.getByRole('list', { name: 'Tarefas' }))
    .getAllByRole('checkbox')
    .map((c) =>
      c
        .closest('li')!
        .querySelector('label')!
        .textContent!.replace(/^Concluir\s*/, ''),
    )
}

describe('Tarefas', () => {
  it('lista as tarefas da API e conta pendentes e concluídas', async () => {
    await abrir()
    expect(tarefasVisiveis()[0]).toBe('Preparar a aula de expressões regulares')
    expect(screen.getByText('3 pendentes · 2 concluídas')).toBeInTheDocument()
  })

  it('Enter adiciona, Esc limpa o campo', async () => {
    const { usuario } = await abrir()
    const campo = screen.getByLabelText('Tarefa ou padrão de busca')
    await usuario.type(campo, 'Revisar o PR{Enter}')
    await waitFor(() => expect(tarefasVisiveis()[0]).toBe('Revisar o PR'))
    expect(campo).toHaveValue('')
    expect(campo).toHaveFocus()
    await usuario.type(campo, 'rascunho{Escape}')
    expect(campo).toHaveValue('')
  })

  it('Shift+Enter busca por expressão regular, destaca o trecho e recusa padrão inválido', async () => {
    const { usuario } = await abrir()
    const campo = screen.getByLabelText('Tarefa ou padrão de busca')
    await usuario.type(campo, '^(comprar|estudar){Shift>}{Enter}{/Shift}')
    await waitFor(() => expect(tarefasVisiveis()).toHaveLength(2))
    expect(screen.getByText(/busca: \/\^\(comprar\|estudar\)\/i/)).toBeInTheDocument()
    expect(document.querySelectorAll('mark')).toHaveLength(2)

    await usuario.clear(campo)
    await usuario.type(campo, '({Shift>}{Enter}{/Shift}')
    expect(screen.getByRole('alert')).toHaveTextContent('Expressão regular inválida.')
    expect(tarefasVisiveis()).toHaveLength(2)
  })

  it('só exclui tarefa concluída', async () => {
    const { usuario } = await abrir()
    const pendente = 'Comprar pão e café para a reunião'
    await usuario.click(screen.getByRole('button', { name: `Excluir ${pendente}` }))
    expect(await screen.findByText('Conclua a tarefa antes de excluir.')).toBeInTheDocument()
    expect(tarefasVisiveis()).toContain(pendente)

    await usuario.click(screen.getByRole('checkbox', { name: `Concluir ${pendente}` }))
    expect(screen.getByRole('checkbox', { name: `Concluir ${pendente}` })).toBeChecked()
    await waitFor(() => expect(screen.getByText('2 pendentes · 3 concluídas')).toBeInTheDocument())
    await usuario.click(screen.getByRole('button', { name: `Excluir ${pendente}` }))
    await waitFor(() => expect(tarefasVisiveis()).not.toContain(pendente))
  })

  it('filtra por situação e limpa todas as concluídas', async () => {
    const { usuario } = await abrir()
    await usuario.click(screen.getByRole('button', { name: 'Concluídas' }))
    expect(tarefasVisiveis()).toHaveLength(2)
    await usuario.click(screen.getByRole('button', { name: 'Limpar concluídas' }))
    expect(await screen.findByText('2 tarefas concluídas removidas.')).toBeInTheDocument()
    expect(await screen.findByRole('heading', { name: 'Nenhuma tarefa aqui' })).toBeInTheDocument()
  })

  it('não tem violações do axe', async () => {
    const { container } = await abrir()
    expect(await violacoesAxe(container)).toEqual([])
  })
})

describe('API desligada', () => {
  it('explica como ligar a API', async () => {
    render(
      <App
        base="http://localhost/api"
        fetchFn={() => Promise.reject(new TypeError('Failed to fetch'))}
      />,
    )
    expect(await screen.findByRole('heading', { name: 'A API não respondeu' })).toBeInTheDocument()
  })
})
/* Fim dos testes de integração das Tarefas. */
