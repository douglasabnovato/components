/*
 * Testes de integração da Pelada: organizador pelo GitHub (fetch simulado),
 * confirmação com espera, retirada com promoção, sorteio, novo jogo,
 * exclusão com desfazer, persistência e axe.
 */
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { violacoesAxe } from '@components/ui/testes/axe'
import { MemoryRouter } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { App } from '../App'
import { CHAVE_PELADA } from '../dados/estado'
import { limparCachePerfis } from '../dados/github'

const agora = () => new Date('2026-09-26T12:00:00')

/* Renderiza o App numa rota inicial com relógio e ids previsíveis. */
function abrir(rota = '/') {
  let contador = 0
  const usuario = userEvent.setup()
  const resultado = render(
    <MemoryRouter initialEntries={[rota]}>
      <App agora={agora} novoId={() => `id-${++contador}`} />
    </MemoryRouter>,
  )
  return { usuario, ...resultado }
}

beforeEach(() => {
  limparCachePerfis()
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string) => {
      if (url.endsWith('/naoexiste')) return new Response('{}', { status: 404 })
      const login = url.split('/').at(-1)!
      return Response.json({
        login,
        name: login === 'douglasabnovato' ? 'Douglas Novato' : null,
        avatar_url: 'data:image/gif;base64,R0lGODlhAQABAAAAACw=',
        html_url: `https://github.com/${login}`,
      })
    }),
  )
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('Início', () => {
  it('mostra o organizador do GitHub e os próximos jogos', async () => {
    abrir()
    expect(screen.getByText('Buscando @douglasabnovato no GitHub…')).toBeInTheDocument()
    expect(await screen.findByText('Douglas Novato')).toBeInTheDocument()
    const jogos = screen.getByRole('list', { name: 'Próximos jogos' })
    expect(within(jogos).getAllByRole('article')).toHaveLength(3)
    expect(screen.getByRole('progressbar', { name: '10 de 10 confirmados' })).toBeInTheDocument()
  })

  it('troca o organizador e mostra erro de usuário inexistente', async () => {
    const { usuario } = abrir()
    await usuario.click(screen.getByRole('button', { name: 'Trocar organizador' }))
    const campo = screen.getByLabelText('Usuário do GitHub')
    await usuario.clear(campo)
    await usuario.type(campo, 'naoexiste{Enter}')
    expect(
      await screen.findByText('O usuário @naoexiste não existe no GitHub.'),
    ).toBeInTheDocument()
  })

  it('não tem violações do axe', async () => {
    const { container } = abrir()
    await screen.findByText('Douglas Novato')
    expect(await violacoesAxe(container)).toEqual([])
  })
})

describe('Jogo', () => {
  it('confirma, recusa repetido, vai para a espera quando lota e promove ao retirar', async () => {
    const { usuario } = abrir('/jogo/futsal-firma')
    expect(screen.getByRole('heading', { level: 1, name: 'Futsal da firma' })).toBeInTheDocument()
    expect(screen.getByText('Lista cheia · entra na espera')).toBeInTheDocument()

    await usuario.type(screen.getByLabelText('Seu nome'), 'Dani')
    await usuario.click(screen.getByRole('button', { name: 'Entrar na espera' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Dani já está na lista deste jogo.')

    await usuario.clear(screen.getByLabelText('Seu nome'))
    await usuario.type(screen.getByLabelText('Seu nome'), 'Marta{Enter}')
    const espera = screen.getByRole('region', { name: 'Lista de espera (3)' })
    expect(within(espera).getByRole('button', { name: 'Retirar Marta' })).toBeInTheDocument()
    expect(
      await screen.findByText('Lista cheia: Marta entrou na espera (posição 3).'),
    ).toBeInTheDocument()

    await usuario.click(screen.getByRole('button', { name: 'Retirar Téo' }))
    expect(await screen.findByText('Téo saiu. Ana Luiza subiu da espera.')).toBeInTheDocument()
    const confirmados = screen.getByRole('region', { name: 'Confirmados (10)' })
    expect(
      within(confirmados).getByRole('button', { name: 'Retirar Ana Luiza' }),
    ).toBeInTheDocument()

    await usuario.click(screen.getByRole('button', { name: 'Desfazer' }))
    expect(
      within(screen.getByRole('region', { name: 'Confirmados (10)' })).getByRole('button', {
        name: 'Retirar Téo',
      }),
    ).toBeInTheDocument()
  })

  it('sorteia dois times de 5 e explica quando faltam jogadores', async () => {
    const { usuario } = abrir('/jogo/futsal-firma')
    await usuario.click(screen.getByRole('button', { name: 'Sortear times' }))
    expect(screen.getByRole('listitem', { name: 'Time A' })).toBeInTheDocument()
    expect(
      within(screen.getByRole('listitem', { name: 'Time B' })).getAllByRole('listitem'),
    ).toHaveLength(5)

    await usuario.click(screen.getByRole('link', { name: 'Jogos' }))
    await usuario.click(
      screen.getByRole('link', { name: /Ver lista e confirmar de Society dos amigos/ }),
    )
    await usuario.click(screen.getByRole('button', { name: 'Sortear times' }))
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Faltam 4 jogadores para formar 2 times de 7.',
    )
  })

  it('exclui o jogo e desfaz', async () => {
    const { usuario } = abrir('/jogo/society-amigos')
    await usuario.click(screen.getByRole('button', { name: 'Excluir jogo' }))
    expect(await screen.findByText('Jogo "Society dos amigos" excluído.')).toBeInTheDocument()
    expect(
      within(screen.getByRole('list', { name: 'Próximos jogos' })).getAllByRole('article'),
    ).toHaveLength(2)
    await usuario.click(screen.getByRole('button', { name: 'Desfazer' }))
    expect(
      within(screen.getByRole('list', { name: 'Próximos jogos' })).getAllByRole('article'),
    ).toHaveLength(3)
  })

  it('mostra 404 e não tem violações do axe', async () => {
    const { container } = abrir('/jogo/futsal-firma')
    expect(await violacoesAxe(container)).toEqual([])
  })
})

describe('Novo jogo', () => {
  it('valida os campos, cria o jogo e persiste no navegador', async () => {
    const { usuario } = abrir('/novo')
    await usuario.click(screen.getByRole('button', { name: 'Criar jogo' }))
    expect(screen.getByText('Dê um nome com pelo menos 3 letras.')).toBeInTheDocument()
    expect(screen.getByText('Informe o local.')).toBeInTheDocument()
    expect(screen.getByLabelText('Nome do jogo')).toHaveFocus()

    await usuario.type(screen.getByLabelText('Nome do jogo'), 'Areia de domingo')
    await usuario.selectOptions(screen.getByLabelText('Modalidade'), 'Areia')
    await usuario.type(screen.getByLabelText('Local'), 'Praia central')
    await usuario.click(screen.getByRole('button', { name: 'Diminuir jogadores por time' }))
    await usuario.click(screen.getByRole('button', { name: 'Criar jogo' }))

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Areia de domingo' }),
    ).toBeInTheDocument()
    expect(screen.getByText('0/14 · 6 por time')).toBeInTheDocument()
    await waitFor(() => {
      const salvo = JSON.parse(window.localStorage.getItem(CHAVE_PELADA)!)
      expect(salvo.jogos.at(-1).titulo).toBe('Areia de domingo')
    })
  })

  it('não tem violações do axe', async () => {
    const { container } = abrir('/novo')
    expect(await violacoesAxe(container)).toEqual([])
  })
})

describe('404', () => {
  it('avisa jogo e página inexistentes', () => {
    abrir('/jogo/nao-existe')
    expect(
      screen.getByRole('heading', { level: 1, name: 'Jogo não encontrado' }),
    ).toBeInTheDocument()
  })
})
/* Fim dos testes de integração da Pelada. */
