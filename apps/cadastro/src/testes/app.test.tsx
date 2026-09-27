/*
 * Testes de integração do Cadastro: tabela, busca, formulário com validação
 * e erro do servidor no campo certo, edição, exclusão com confirmação e
 * desfazer, troca de origem (API real em memória) e API desligada. Com axe.
 */
import { abrirBanco, criarApp } from '@components/api'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { violacoesAxe } from '@components/ui/testes/axe'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { App } from '../App'
import type { RepositorioClientes } from '../dados/repositorio'
import { criarRepositorioHttp } from '../dados/repositorioHttp'
import { criarRepositorioMemoria } from '../dados/repositorioMemoria'

const apiDesligada = criarRepositorioHttp('http://localhost:1', () =>
  Promise.reject(new TypeError('Failed to fetch')),
)

/* Renderiza o App com repositórios controlados. */
function abrir(rota = '/', api: RepositorioClientes = apiDesligada) {
  const usuario = userEvent.setup()
  const resultado = render(
    <MemoryRouter initialEntries={[rota]}>
      <App repositorios={{ memoria: criarRepositorioMemoria(), api }} />
    </MemoryRouter>,
  )
  return { usuario, ...resultado }
}

/* Linhas de dados da tabela (sem o cabeçalho). */
function linhas() {
  return within(screen.getByRole('table', { name: 'Clientes cadastrados' }))
    .getAllByRole('row')
    .slice(1)
}

describe('Tabela', () => {
  it('lista os clientes da memória e busca por nome ou e-mail', async () => {
    const { usuario } = abrir()
    expect(await screen.findByRole('rowheader', { name: /Ana Ribeiro/ })).toBeInTheDocument()
    expect(linhas()).toHaveLength(4)
    await usuario.type(screen.getByLabelText('Buscar'), 'souza')
    await waitFor(() => expect(linhas()).toHaveLength(1))
    expect(screen.getByText(/· origem:/)).toHaveTextContent('1 cliente · origem: memória')
  })

  it('ordena por idade', async () => {
    const { usuario } = abrir()
    await screen.findByRole('rowheader', { name: /Ana Ribeiro/ })
    await usuario.selectOptions(screen.getByLabelText('Ordenar por'), 'idade')
    await waitFor(() => expect(linhas()[0]).toHaveTextContent('Bruno Costa'))
  })

  it('não tem violações do axe', async () => {
    const { container } = abrir()
    await screen.findByRole('rowheader', { name: /Ana Ribeiro/ })
    expect(await violacoesAxe(container)).toEqual([])
  })
})

describe('Formulário', () => {
  it('valida pelo contrato, mostra conflito de e-mail no campo e cadastra', async () => {
    const { usuario } = abrir()
    await screen.findByRole('rowheader', { name: /Ana Ribeiro/ })
    await usuario.click(screen.getByRole('button', { name: 'Novo cliente' }))
    await usuario.click(screen.getByRole('button', { name: 'Cadastrar' }))
    expect(await screen.findByText('Informe um nome com pelo menos 3 letras.')).toBeInTheDocument()
    expect(screen.getByText('Informe um e-mail válido.')).toBeInTheDocument()

    await usuario.type(screen.getByLabelText('Nome'), 'Elisa Prado')
    await usuario.type(screen.getByLabelText('E-mail'), 'ana.ribeiro@exemplo.com')
    await usuario.type(screen.getByLabelText('Idade'), '29')
    await usuario.click(screen.getByRole('button', { name: 'Cadastrar' }))
    expect(await screen.findByText('Este e-mail já está cadastrado.')).toBeInTheDocument()
    expect(screen.getByLabelText('E-mail')).toHaveFocus()

    await usuario.clear(screen.getByLabelText('E-mail'))
    await usuario.type(screen.getByLabelText('E-mail'), 'elisa@exemplo.com')
    await usuario.click(screen.getByRole('button', { name: 'Cadastrar' }))
    expect(await screen.findByRole('rowheader', { name: /Elisa Prado/ })).toBeInTheDocument()
    expect(screen.getByText('Elisa Prado cadastrado.')).toBeInTheDocument()
  })

  it('edita um cliente existente', async () => {
    const { usuario } = abrir()
    await usuario.click(await screen.findByRole('button', { name: 'Editar Bruno Costa' }))
    expect(screen.getByRole('heading', { name: 'Editar Bruno Costa' })).toBeInTheDocument()
    const idade = screen.getByLabelText('Idade')
    await usuario.clear(idade)
    await usuario.type(idade, '28')
    await usuario.click(screen.getByRole('button', { name: 'Salvar alterações' }))
    const linha = (await screen.findByRole('rowheader', { name: /Bruno Costa/ })).closest('tr')!
    expect(linha).toHaveTextContent('28')
  })

  it('não tem violações do axe', async () => {
    const { usuario, container } = abrir()
    await usuario.click(await screen.findByRole('button', { name: 'Formulário' }))
    expect(await violacoesAxe(container)).toEqual([])
  })
})

describe('Exclusão', () => {
  it('pede confirmação, exclui e desfaz', async () => {
    const { usuario } = abrir()
    await usuario.click(await screen.findByRole('button', { name: 'Excluir Carla Souza' }))
    const dialogo = screen.getByRole('dialog', { name: 'Excluir Carla Souza?' })
    await usuario.click(within(dialogo).getByRole('button', { name: 'Excluir' }))
    await waitFor(() => expect(linhas()).toHaveLength(3))
    await usuario.click(screen.getByRole('button', { name: 'Desfazer' }))
    expect(await screen.findByRole('rowheader', { name: /Carla Souza/ })).toBeInTheDocument()
  })
})

describe('Origem', () => {
  it('mostra o aviso de API desligada e volta para a memória', async () => {
    const { usuario } = abrir('/?origem=api')
    expect(await screen.findByRole('heading', { name: 'A API não respondeu' })).toBeInTheDocument()
    await usuario.click(screen.getByRole('button', { name: 'Usar memória' }))
    expect(await screen.findByRole('rowheader', { name: /Ana Ribeiro/ })).toBeInTheDocument()
  })

  it('usa a API de verdade (Hono + PGlite) com a mesma tela', async () => {
    const { banco } = await abrirBanco()
    const app = criarApp(banco)
    const api = criarRepositorioHttp('', (url, init) => Promise.resolve(app.request(url, init)))
    const { usuario } = abrir('/', api)
    await screen.findByRole('rowheader', { name: /Ana Ribeiro/ })
    await usuario.click(screen.getByRole('button', { name: 'API' }))
    await waitFor(() =>
      expect(screen.getByText(/· origem:/)).toHaveTextContent('4 clientes · origem: API'),
    )
    await usuario.click(screen.getByRole('button', { name: 'Excluir Diego Lima' }))
    await usuario.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Excluir' }))
    await waitFor(() =>
      expect(screen.getByText(/· origem:/)).toHaveTextContent('3 clientes · origem: API'),
    )
    await usuario.click(screen.getByRole('button', { name: 'Memória' }))
    await waitFor(() =>
      expect(screen.getByText(/· origem:/)).toHaveTextContent('4 clientes · origem: memória'),
    )
  })
})
/* Fim dos testes de integração do Cadastro. */
