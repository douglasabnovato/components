/*
 * Testes do hub: integridade dos dados, estrutura da página, regras de
 * negócio das demonstrações e verificação de acessibilidade com axe.
 */
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { violacoesAxe } from '@components/ui/testes/axe'
import { App } from '../App'
import { projetos } from '../dados/projetos'

/* Baixa o módulo das seções uma vez, para o tempo de transformação não cair no teste. */
beforeAll(async () => {
  await import('../secoes/SecoesProjetos')
}, 120_000)

/* Renderiza o App e espera as seções de projeto, que carregam sob demanda. */
async function renderizarApp() {
  const resultado = render(<App />)
  await waitFor(() => expect(document.getElementById('arquitetura')).not.toBeNull(), {
    timeout: 15_000,
  })
  return resultado
}

describe('Dados dos projetos', () => {
  it('tem 8 filhos publicados, com números, ids e fases únicos', () => {
    expect(projetos).toHaveLength(8)
    expect(new Set(projetos.map((p) => p.id)).size).toBe(8)
    expect(projetos.map((p) => p.numero)).toEqual([1, 2, 3, 4, 5, 6, 7, 8])
    expect([...projetos.map((p) => p.fase)].sort()).toEqual([1, 2, 3, 4, 5, 6, 7, 8])
    expect(projetos.every((p) => p.status === 'publicado')).toBe(true)
  })

  it('registra a ordem real de construção: 1, 8, 6, 2, 5, 3, 4, 7', () => {
    const ordem = [...projetos].sort((a, b) => a.fase - b.fase).map((p) => p.numero)
    expect(ordem).toEqual([1, 8, 6, 2, 5, 3, 4, 7])
  })

  it('aponta cada filho para a porta de desenvolvimento do ecossistema', () => {
    expect(projetos.find((p) => p.numero === 8)?.href).toBe('http://localhost:5178/')
    expect(projetos.find((p) => p.numero === 4)?.href).toBe('http://localhost:5174/formularios/')
  })
})

describe('Página do hub', () => {
  it('tem um h1, uma seção por projeto e o menu com os 8 projetos', async () => {
    const usuario = userEvent.setup()
    await renderizarApp()
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    for (const p of projetos) {
      expect(screen.getByRole('region', { name: p.titulo })).toHaveAttribute('id', p.id)
    }
    await usuario.click(screen.getAllByRole('button', { name: 'Projetos' })[0]!)
    const nav = screen.getByRole('navigation', { name: 'Principal' })
    expect(within(nav).getAllByRole('link', { name: /No ar/ }).length).toBeGreaterThanOrEqual(8)
  })

  it('liga cada seção à pasta do código no GitHub', async () => {
    await renderizarApp()
    for (const p of projetos) {
      const secao = screen.getByRole('region', { name: p.titulo })
      const link = within(secao).getByRole('link', { name: `Ver o código de ${p.nome}` })
      expect(link).toHaveAttribute('href', p.codigo)
      expect(p.codigo).toMatch(/^https:\/\/github\.com\/douglasabnovato\/components\/tree\/main\//)
    }
    expect(new Set(projetos.map((p) => p.codigo)).size).toBe(8)
  })

  it('leva até a âncora do endereço quando as seções montam', async () => {
    const rolar = vi.fn()
    const original = Element.prototype.scrollIntoView
    Element.prototype.scrollIntoView = rolar
    window.history.replaceState(null, '', '#filho-3')
    try {
      render(<App />)
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
      await waitFor(() => expect(rolar).toHaveBeenCalled(), { timeout: 15_000 })
      expect(rolar.mock.contexts[0]).toBe(document.getElementById(projetos[2]!.id))
    } finally {
      Element.prototype.scrollIntoView = original
      window.history.replaceState(null, '', '/')
    }
  })

  it('não tem violações do axe', async () => {
    const { container } = await renderizarApp()
    expect(await violacoesAxe(container)).toEqual([])
  }, 60_000)
})

describe('Cadastro', () => {
  it('valida pelo contrato, recusa e-mail repetido e cadastra', async () => {
    const usuario = userEvent.setup()
    await renderizarApp()
    const secao = screen.getByRole('region', { name: projetos[1]!.titulo })
    await usuario.click(within(secao).getByRole('button', { name: 'Formulário' }))
    await usuario.click(within(secao).getByRole('button', { name: 'Cadastrar' }))
    expect(within(secao).getByText('Informe um nome com pelo menos 3 letras.')).toBeInTheDocument()
    expect(within(secao).getByText('Informe um e-mail válido.')).toBeInTheDocument()

    await usuario.type(within(secao).getByLabelText('Nome'), 'Elisa Prado')
    await usuario.type(within(secao).getByLabelText('E-mail'), 'ana.ribeiro@exemplo.com')
    await usuario.type(within(secao).getByLabelText('Idade'), '29')
    await usuario.click(within(secao).getByRole('button', { name: 'Cadastrar' }))
    expect(await within(secao).findByText('Este e-mail já está cadastrado.')).toBeInTheDocument()

    await usuario.clear(within(secao).getByLabelText('E-mail'))
    await usuario.type(within(secao).getByLabelText('E-mail'), 'elisa@exemplo.com')
    await usuario.click(within(secao).getByRole('button', { name: 'Cadastrar' }))
    expect(await within(secao).findByRole('cell', { name: 'Elisa Prado' })).toBeInTheDocument()
  })
})

describe('Tarefas', () => {
  it('adiciona em destaque e só exclui tarefas concluídas', async () => {
    const usuario = userEvent.setup()
    await renderizarApp()
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
  it('confirma presença e, com a lista cheia, entra na espera', async () => {
    const usuario = userEvent.setup()
    await renderizarApp()
    const secao = screen.getByRole('region', { name: projetos[5]!.titulo })

    await usuario.click(
      within(secao).getByRole('button', { name: 'Confirmar presença em Rachão do fim de semana' }),
    )
    expect(
      within(secao).getByRole('progressbar', { name: '22 de 22 confirmados' }),
    ).toBeInTheDocument()

    await usuario.click(
      within(secao).getByRole('button', { name: 'Entrar na espera em Futsal da firma' }),
    )
    expect(
      within(secao).getByRole('progressbar', { name: '10 de 10 confirmados' }),
    ).toBeInTheDocument()
    expect(within(secao).getByText('5 por time · 3 na espera')).toBeInTheDocument()
  })
})

describe('Laboratório', () => {
  it('troca de lição e mostra a solução rodando', async () => {
    const usuario = userEvent.setup()
    await renderizarApp()
    const secao = screen.getByRole('region', { name: projetos[6]!.titulo })

    await usuario.click(within(secao).getByRole('button', { name: /useContext/ }))
    await usuario.click(within(secao).getByRole('tab', { name: '3 · Solução' }))
    expect(within(secao).getByText('Tema atual: escuro')).toBeInTheDocument()
    await usuario.click(within(secao).getByRole('button', { name: 'Alternar tema' }))
    expect(within(secao).getByText('Tema atual: claro')).toBeInTheDocument()
  })
})
describe('Trilha React', () => {
  it('abre um módulo e lista os aprendizados reais', async () => {
    const usuario = userEvent.setup()
    await renderizarApp()
    const secao = screen.getByRole('region', { name: projetos[7]!.titulo })
    expect(within(secao).getByText('116')).toBeInTheDocument()
    const modulo = within(secao).getByRole('button', { name: /CRUD completo passo a passo/ })
    await usuario.click(modulo)
    expect(modulo).toHaveAttribute('aria-expanded', 'true')
    expect(
      within(secao).getByRole('link', { name: '21. Parte 1: Apresentação do CRUD' }),
    ).toHaveAttribute('href', 'http://localhost:5178/aprendizado/21')
  })
})
/* Fim dos testes do hub. */
