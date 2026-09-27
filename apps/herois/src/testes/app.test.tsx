/*
 * Testes de integração do Portal de Heróis: filtros na URL, ficha, equipes,
 * comparação, menu por teclado e axe.
 */
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { violacoesAxe } from '@components/ui/testes/axe'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { App } from '../App'

/* Renderiza o App numa rota. */
function abrir(rota = '/') {
  const usuario = userEvent.setup()
  const resultado = render(
    <MemoryRouter initialEntries={[rota]}>
      <App />
    </MemoryRouter>,
  )
  return { usuario, ...resultado }
}

/* Nomes dos heróis no catálogo. */
function nomesNoCatalogo() {
  const catalogo = screen.getByRole('region', { name: 'Catálogo' })
  return within(catalogo)
    .getAllByRole('heading', { level: 3 })
    .map((h) => h.textContent)
}

describe('Catálogo', () => {
  it('mostra os 12 heróis e filtra por universo, equipe e busca', async () => {
    const { usuario } = abrir()
    expect(nomesNoCatalogo()).toHaveLength(12)
    await usuario.selectOptions(screen.getByLabelText('Universo'), 'cidade-circuito')
    await waitFor(() => expect(nomesNoCatalogo()).toHaveLength(4))
    expect(within(screen.getByLabelText('Equipe')).getAllByRole('option')).toHaveLength(2)

    await usuario.type(screen.getByLabelText('Buscar'), 'luz')
    await waitFor(() => expect(nomesNoCatalogo()).toEqual(['Prisma']))
    expect(screen.getByRole('status')).toHaveTextContent('1 de 12 heróis')
  })

  it('restaura filtros da URL e avisa quando nada é encontrado', async () => {
    const { usuario } = abrir('/?equipe=liga-do-cerrado&busca=xyz')
    expect(screen.getByText('Nenhum herói encontrado')).toBeInTheDocument()
    await usuario.click(screen.getByRole('button', { name: 'Limpar filtros' }))
    await waitFor(() => expect(nomesNoCatalogo()).toHaveLength(12))
  })

  it('não tem violações do axe', async () => {
    const { container } = abrir()
    expect(await violacoesAxe(container)).toEqual([])
  })
})

describe('Ficha', () => {
  it('mostra história, poderes, atributos e colegas', () => {
    abrir('/heroi/mare-alta')
    expect(screen.getByRole('heading', { level: 1, name: 'Maré Alta' })).toBeInTheDocument()
    expect(screen.getByText('Controle de correntes')).toBeInTheDocument()
    expect(screen.getByRole('meter', { name: 'Mente' })).toHaveAttribute('aria-valuenow', '8')
    expect(screen.getByRole('link', { name: 'Raiz' })).toHaveAttribute('href', '/heroi/raiz')
  })

  it('mostra 404 para herói inexistente', () => {
    abrir('/heroi/ninguem')
    expect(
      screen.getByRole('heading', { level: 1, name: 'Herói não encontrado' }),
    ).toBeInTheDocument()
  })

  it('não tem violações do axe', async () => {
    const { container } = abrir('/heroi/eco')
    expect(await violacoesAxe(container)).toEqual([])
  })
})

describe('Comparar e equipes', () => {
  it('compara a partir da ficha e troca o segundo herói', async () => {
    const { usuario } = abrir('/heroi/siriema')
    await usuario.click(screen.getByRole('link', { name: 'Comparar Siriema com outro herói' }))
    await usuario.selectOptions(screen.getByLabelText('Segundo herói'), 'ipe')
    expect(screen.getByRole('heading', { level: 2, name: 'Ipê' })).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Ipê leva vantagem no total.')
  })

  it('lista as equipes por universo', () => {
    abrir('/equipes')
    expect(screen.getByRole('heading', { level: 2, name: 'Terra Firme' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'Coletivo Circuito' })).toBeInTheDocument()
  })
})

describe('Menu', () => {
  it('abre, fecha com Esc devolvendo o foco e fecha ao navegar', async () => {
    const { usuario } = abrir()
    const botao = screen.getByRole('button', { name: 'Menu' })
    await usuario.click(botao)
    expect(botao).toHaveAttribute('aria-expanded', 'true')
    await usuario.keyboard('{Escape}')
    expect(botao).toHaveAttribute('aria-expanded', 'false')
    expect(botao).toHaveFocus()

    await usuario.click(botao)
    await usuario.click(screen.getByRole('link', { name: 'Equipes' }))
    expect(screen.getByRole('button', { name: 'Menu' })).toHaveAttribute('aria-expanded', 'false')
  })
})
/* Fim dos testes de integração. */
