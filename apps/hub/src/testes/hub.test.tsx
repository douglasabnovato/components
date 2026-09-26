/*
 * Testes do hub: integridade dos dados, estrutura da página, regras de
 * negócio das demonstrações e verificação de acessibilidade com axe.
 */
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { violacoesAxe } from '@components/ui/testes/axe'
import { App } from '../App'
import { projetos } from '../dados/projetos'
import { validarCliente } from '../secoes/Cadastro/clientes'

describe('Dados dos projetos', () => {
  it('tem 7 filhos com números, ids e fases únicos', () => {
    expect(projetos).toHaveLength(7)
    expect(new Set(projetos.map((p) => p.id)).size).toBe(7)
    expect(projetos.map((p) => p.numero)).toEqual([1, 2, 3, 4, 5, 6, 7])
    expect([...projetos.map((p) => p.fase)].sort()).toEqual([1, 2, 3, 4, 5, 6, 7])
  })

  it('segue a ordem de construção aprovada: 6, 2, 5, 1, 3, 4, 7', () => {
    const ordem = [...projetos].sort((a, b) => a.fase - b.fase).map((p) => p.numero)
    expect(ordem).toEqual([6, 2, 5, 1, 3, 4, 7])
  })
})

describe('Página do hub', () => {
  it('tem um h1, uma seção por projeto e o menu com os 7 projetos', async () => {
    const usuario = userEvent.setup()
    render(<App />)
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    for (const p of projetos) {
      expect(screen.getByRole('region', { name: p.titulo })).toHaveAttribute('id', p.id)
    }
    await usuario.click(screen.getAllByRole('button', { name: 'Projetos' })[0]!)
    const nav = screen.getByRole('navigation', { name: 'Principal' })
    expect(
      within(nav).getAllByRole('link', { name: /Fase \d|No ar/ }).length,
    ).toBeGreaterThanOrEqual(7)
  })

  it('não tem violações do axe', async () => {
    const { container } = render(<App />)
    expect(await violacoesAxe(container)).toEqual([])
  })
})

describe('Cadastro', () => {
  it('valida nome e idade', () => {
    expect(validarCliente('Al', '200')).toEqual({
      nome: 'Informe um nome com pelo menos 3 letras.',
      idade: 'Informe uma idade entre 0 e 130.',
    })
    expect(validarCliente('Alice', '30')).toEqual({})
  })

  it('cadastra pelo formulário e volta para a tabela', async () => {
    const usuario = userEvent.setup()
    render(<App />)
    const secao = screen.getByRole('region', { name: projetos[1]!.titulo })
    await usuario.click(within(secao).getByRole('button', { name: 'Formulário' }))
    await usuario.click(within(secao).getByRole('button', { name: 'Cadastrar' }))
    expect(within(secao).getByText('Informe um nome com pelo menos 3 letras.')).toBeInTheDocument()

    await usuario.type(within(secao).getByLabelText('Nome'), 'Diego Lima')
    await usuario.type(within(secao).getByLabelText('Idade'), '31')
    await usuario.click(within(secao).getByRole('button', { name: 'Cadastrar' }))
    expect(within(secao).getByRole('cell', { name: 'Diego Lima' })).toBeInTheDocument()
  })
})

describe('Tarefas', () => {
  it('adiciona em destaque e só exclui tarefas concluídas', async () => {
    const usuario = userEvent.setup()
    render(<App />)
    const secao = screen.getByRole('region', { name: projetos[4]!.titulo })

    await usuario.type(within(secao).getByLabelText('Título'), 'Nova demo{Enter}')
    expect(within(secao).getAllByRole('heading', { level: 3 })[0]).toHaveTextContent('Nova demo')

    const excluir = within(secao).getByRole('button', { name: 'Excluir Nova demo' })
    await usuario.click(excluir)
    expect(within(secao).getByRole('heading', { name: 'Nova demo' })).toBeInTheDocument()

    await usuario.click(within(secao).getByRole('button', { name: 'Concluir Nova demo' }))
    await usuario.click(within(secao).getByRole('button', { name: 'Excluir Nova demo' }))
    await waitFor(() =>
      expect(within(secao).queryByRole('heading', { name: 'Nova demo' })).not.toBeInTheDocument(),
    )
  })
})

describe('Lista da Pelada', () => {
  it('confirma presença e respeita a lista cheia', async () => {
    const usuario = userEvent.setup()
    render(<App />)
    const secao = screen.getByRole('region', { name: projetos[5]!.titulo })

    await usuario.click(
      within(secao).getByRole('button', { name: 'Confirmar presença em Rachão de sábado' }),
    )
    expect(
      within(secao).getByRole('progressbar', { name: '22 de 22 confirmados' }),
    ).toBeInTheDocument()

    const cheio = within(secao).getByRole('button', { name: 'Lista cheia em Futsal da firma' })
    await usuario.click(cheio)
    expect(
      within(secao).getByRole('progressbar', { name: '10 de 10 confirmados' }),
    ).toBeInTheDocument()
  })
})

describe('Laboratório', () => {
  it('troca de lição e mostra a solução rodando', async () => {
    const usuario = userEvent.setup()
    render(<App />)
    const secao = screen.getByRole('region', { name: projetos[6]!.titulo })

    await usuario.click(within(secao).getByRole('button', { name: /useContext/ }))
    await usuario.click(within(secao).getByRole('tab', { name: '3 · Solução' }))
    expect(within(secao).getByText('Tema atual: escuro')).toBeInTheDocument()
    await usuario.click(within(secao).getByRole('button', { name: 'Alternar tema' }))
    expect(within(secao).getByText('Tema atual: claro')).toBeInTheDocument()
  })
})
/* Fim dos testes do hub. */
