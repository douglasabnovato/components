/*
 * Testes de integração da Trilha: início com progresso e filtros na URL,
 * página do aprendizado (player, assistido, anotações), Stack e axe.
 */
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { violacoesAxe } from '@components/ui/testes/axe'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { App } from '../App'
import { criarArmazemProgresso } from '../dados/progresso'

/* Renderiza o App numa rota inicial, com progresso limpo. */
function abrir(rota = '/') {
  const usuario = userEvent.setup()
  const armazem = criarArmazemProgresso()
  const resultado = render(
    <MemoryRouter initialEntries={[rota]}>
      <App armazem={armazem} />
    </MemoryRouter>,
  )
  return { usuario, armazem, ...resultado }
}

describe('Início', () => {
  it('mostra os 12 módulos e começa pelo aprendizado 1', () => {
    abrir()
    expect(
      screen.getByRole('heading', { level: 1, name: 'Trilha React: do zero ao fullstack' }),
    ).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(12)
    expect(
      screen.getByRole('link', { name: /Começar: 1\. Começando no React\.js em 2022/ }),
    ).toHaveAttribute('href', '/aprendizado/1')
  })

  it('marcar como assistido atualiza contagem e o "continuar" (estado derivado)', async () => {
    const { usuario } = abrir()
    await usuario.click(
      screen.getByRole('checkbox', { name: 'Assistido: Começando no React.js em 2022' }),
    )
    expect(
      screen.getByRole('progressbar', { name: 'Progresso geral: 1 de 116 aprendizados' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Continuar: 2\./ })).toBeInTheDocument()
    expect(
      screen.getByRole('progressbar', { name: 'Progresso no módulo 1: 1 de 10' }),
    ).toBeInTheDocument()
  })

  it('filtra por módulo e por busca, e limpa os filtros', async () => {
    const { usuario } = abrir()
    await usuario.selectOptions(screen.getByLabelText('Módulo'), '3')
    expect(screen.getByRole('status', { name: '' })).toHaveTextContent(
      '10 aprendizados encontrados',
    )
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(1)
    expect(
      screen.getByRole('heading', { level: 2, name: 'CRUD completo passo a passo' }),
    ).toBeInTheDocument()

    await usuario.type(screen.getByLabelText('Buscar na trilha'), 'xyzxyz')
    expect(screen.getByRole('heading', { name: 'Nada por aqui' })).toBeInTheDocument()
    await usuario.click(screen.getAllByRole('button', { name: 'Limpar filtros' })[0]!)
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(12)
  })

  it('restaura os filtros a partir da URL', () => {
    abrir('/?modulo=12&historicos=ocultar')
    const secao = screen.getByRole('region', { name: 'Carreira e visão de mercado' })
    expect(within(secao).getAllByRole('checkbox')).toHaveLength(4)
    expect(screen.getByLabelText('Esconder históricos')).toBeChecked()
  })

  it('não tem violações do axe', async () => {
    const { container } = abrir()
    expect(await violacoesAxe(container)).toEqual([])
  })
})

describe('Aprendizado', () => {
  it('carrega o player só no clique, marca como assistido e guarda anotações', async () => {
    const { usuario, armazem } = abrir('/aprendizado/14')
    expect(
      screen.getByRole('heading', { level: 1, name: 'O erro mais comum no React' }),
    ).toBeInTheDocument()
    expect(document.querySelector('iframe')).toBeNull()
    await usuario.click(
      screen.getByRole('button', { name: 'Reproduzir O erro mais comum no React' }),
    )
    expect(screen.getByTitle('Vídeo: O erro mais comum no React')).toHaveAttribute(
      'src',
      expect.stringContaining('youtube-nocookie.com/embed/kCpca2z2cls'),
    )

    await usuario.click(screen.getByRole('button', { name: 'Marcar como assistido' }))
    expect(screen.getByRole('button', { name: 'Assistido' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(armazem.ler().assistidos).toEqual([14])

    await usuario.type(screen.getByLabelText('Suas anotações'), 'Calcular, não guardar')
    expect(armazem.ler().notas['14']).toBe('Calcular, não guardar')

    expect(screen.getByRole('link', { name: 'Estado derivado' })).toHaveAttribute(
      'href',
      '/stack#tec-54',
    )
    expect(screen.getByRole('link', { name: '08 · Trilha React' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Próximo →15\. React useRef/ })).toHaveAttribute(
      'href',
      '/aprendizado/15',
    )
  })

  it('avisa conteúdo histórico', () => {
    abrir('/aprendizado/116')
    expect(screen.getByText(/Conteúdo histórico/)).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Próximo/ })).not.toBeInTheDocument()
  })

  it('mostra 404 para aprendizado inexistente', () => {
    abrir('/aprendizado/999')
    expect(
      screen.getByRole('heading', { level: 1, name: 'Aprendizado não encontrado' }),
    ).toBeInTheDocument()
  })

  it('não tem violações do axe', async () => {
    const { container } = abrir('/aprendizado/35')
    expect(await violacoesAxe(container)).toEqual([])
  })
})

describe('Stack', () => {
  it('mostra a lacuna e filtra por status', async () => {
    const { usuario } = abrir('/stack')
    expect(screen.getByRole('complementary', { name: 'Lacuna da trilha' })).toHaveTextContent(
      'Playwright',
    )
    await usuario.click(screen.getByRole('button', { name: 'Históricas' }))
    expect(screen.getByRole('status', { name: '' })).toHaveTextContent('7 de 93 tecnologias')
    expect(screen.getByRole('heading', { level: 3, name: 'Snowpack' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { level: 3, name: 'Zod' })).not.toBeInTheDocument()
  })

  it('liga tecnologia aos aprendizados e aos projetos do hub', () => {
    abrir('/stack?busca=redux')
    const card = screen.getByRole('heading', { level: 3, name: 'Redux' }).closest('article')!
    expect(within(card).getByRole('link', { name: 'Aprendizado 42' })).toHaveAttribute(
      'href',
      '/aprendizado/42',
    )
    expect(within(card).getByRole('link', { name: '05 · Tarefas' })).toBeInTheDocument()
  })

  it('não tem violações do axe', async () => {
    const { container } = abrir('/stack?status=transicao')
    expect(await violacoesAxe(container)).toEqual([])
  }, 20000)
})

describe('404', () => {
  it('mostra a página não encontrada', () => {
    abrir('/qualquer')
    expect(
      screen.getByRole('heading', { level: 1, name: 'Página não encontrada' }),
    ).toBeInTheDocument()
  })
})
/* Fim dos testes de integração da Trilha. */
