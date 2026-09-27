/*
 * Testes de integração do Laboratório: índice, abas controladas pela URL,
 * MDX por aba, solução com demo e código, aba Assista ligada à Trilha,
 * progresso e axe.
 */
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { violacoesAxe } from '@components/ui/testes/axe'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { App } from '../App'
import { licoes } from '../licoes/indice'
import { aprendizadoPorNumero } from '@components/trilha/dados'

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

describe('Índice', () => {
  it('agrupa as 17 lições em 4 módulos', () => {
    abrir()
    expect(screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)).toEqual([
      'Fundamentos',
      'Hooks',
      'React 18 e 19',
      'Projetos guiados',
    ])
    expect(
      screen
        .getAllByRole('link', { name: /./ })
        .filter((l) => l.getAttribute('href')?.startsWith('/licao/')),
    ).toHaveLength(17)
  })

  it('toda lição aponta para aprendizados que existem na Trilha', () => {
    for (const l of licoes) {
      expect(l.aprendizados.length).toBeGreaterThan(0)
      for (const n of l.aprendizados) expect(aprendizadoPorNumero(n)).not.toBeNull()
    }
  })

  it('não tem violações do axe', async () => {
    const { container } = abrir()
    expect(await violacoesAxe(container)).toEqual([])
  })
})

describe('Lição', () => {
  it('mostra o desafio, troca de aba e roda a solução ao lado do código', async () => {
    const { usuario } = abrir('/licao/use-effect')
    expect(screen.getByRole('heading', { level: 1, name: 'useEffect' })).toBeInTheDocument()
    expect(screen.getByRole('tabpanel')).toHaveTextContent('O cronômetro acelera')

    await usuario.click(screen.getByRole('tab', { name: '3 · Solução' }))
    const painel = screen.getByRole('tabpanel')
    expect(within(painel).getByRole('button', { name: 'Iniciar' })).toBeInTheDocument()
    expect(within(painel).getByLabelText('Código: Demo.tsx')).toHaveTextContent('clearInterval')
    expect(within(painel).getByLabelText('Código: demo.test.tsx')).toHaveTextContent(
      'vi.useFakeTimers',
    )
    expect(within(painel).getByRole('list')).toBeInTheDocument()
  })

  it('abre direto na aba pedida pela URL e lista os vídeos da Trilha', () => {
    abrir('/licao/use-ref?aba=assista')
    const painel = screen.getByRole('tabpanel')
    expect(
      within(painel).getByRole('link', { name: /React useRef: controle o DOM com precisão/ }),
    ).toHaveAttribute('href', 'http://localhost:5178/aprendizado/15')
  })

  it('marca a lição como concluída e o índice mostra o progresso', async () => {
    const { usuario } = abrir('/licao/use-state')
    await usuario.click(screen.getByRole('button', { name: 'Marcar como concluída' }))
    expect(screen.getByRole('button', { name: 'Concluída' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(screen.getByText('1/17 lições concluídas')).toBeInTheDocument()
    await usuario.click(screen.getByRole('link', { name: 'Lições' }))
    expect(
      screen.getByText(/Do useState aos hooks próprios\. · 1\/7 concluídas/),
    ).toBeInTheDocument()
  })

  it('renderiza a tabela do MDX (remark-gfm) na lição histórica', async () => {
    const { usuario } = abrir('/licao/componentes-de-classe')
    await usuario.click(screen.getByRole('tab', { name: '2 · Conteúdo' }))
    expect(within(screen.getByRole('tabpanel')).getByRole('table')).toBeInTheDocument()
  })

  it('mostra 404 para lição inexistente', () => {
    abrir('/licao/nada')
    expect(
      screen.getByRole('heading', { level: 1, name: 'Lição não encontrada' }),
    ).toBeInTheDocument()
  })

  it('não tem violações do axe na solução', async () => {
    const { container } = abrir('/licao/jogo-da-velha?aba=solucao')
    expect(await violacoesAxe(container)).toEqual([])
  })
})
/* Fim dos testes de integração. */
