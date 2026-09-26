/*
 * Testes de integração do Flix: telas, fluxos principais (criar, excluir com
 * desfazer, banner, busca, player) e verificação de acessibilidade com axe.
 */
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { violacoesAxe } from '@components/ui/testes/axe'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { App } from '../App'
import { criarRepositorioLocal } from '../dados/repositorioLocal'

/* Renderiza o App numa rota inicial, com repositório limpo. */
function abrir(rota = '/') {
  const usuario = userEvent.setup()
  const resultado = render(
    <MemoryRouter initialEntries={[rota]}>
      <App repositorio={criarRepositorioLocal()} />
    </MemoryRouter>,
  )
  return { usuario, ...resultado }
}

describe('Início', () => {
  it('mostra um destaque por categoria, com o banner primeiro, e abas por categoria', async () => {
    const { usuario } = abrir()
    const carrossel = await screen.findByRole('region', {
      name: 'Vídeos em destaque por categoria',
    })
    const slides = within(carrossel).getAllByRole('group')
    expect(slides).toHaveLength(4)
    expect(within(slides[0]!).getByText('Banner')).toBeInTheDocument()
    expect(
      within(slides[0]!).getByRole('heading', { name: 'React in 100 Seconds' }),
    ).toBeInTheDocument()

    await usuario.click(screen.getByRole('tab', { name: 'Mobile (4)' }))
    const painel = screen.getByRole('tabpanel')
    expect(within(painel).getByRole('link', { name: 'Flutter in 100 seconds' })).toBeInTheDocument()
  })

  it('busca por texto ignorando acentos', async () => {
    const { usuario } = abrir()
    await usuario.type(
      await screen.findByRole('searchbox', { name: 'Buscar vídeos' }),
      'contêineres{Enter}',
    )
    expect(await screen.findByRole('heading', { name: 'Busca: “contêineres”' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Docker in 100 Seconds' })).toBeInTheDocument()
  })
})

describe('Assistir', () => {
  it('carrega o player só depois do clique', async () => {
    const { usuario } = abrir('/assistir/git-100')
    const botao = await screen.findByRole('button', {
      name: 'Reproduzir Git Explained in 100 Seconds',
    })
    expect(document.querySelector('iframe')).toBeNull()
    await usuario.click(botao)
    expect(screen.getByTitle('Vídeo: Git Explained in 100 Seconds')).toHaveAttribute(
      'src',
      expect.stringContaining('youtube-nocookie.com/embed/hwP7WQkmECE'),
    )
    expect(screen.getByRole('heading', { name: 'Mais de Ferramentas' })).toBeInTheDocument()
  })

  it('mostra 404 para vídeo inexistente', async () => {
    abrir('/assistir/nao-existe')
    expect(await screen.findByRole('heading', { name: 'Vídeo não encontrado' })).toBeInTheDocument()
  })
})

describe('Formulário de vídeo', () => {
  it('valida o link do YouTube e cria o vídeo', async () => {
    const { usuario } = abrir('/painel/videos/novo')
    const link = await screen.findByLabelText('Link do YouTube')
    await usuario.type(link, 'https://vimeo.com/123')
    await usuario.type(screen.getByLabelText('Título'), 'Meu vídeo')
    await usuario.click(screen.getByRole('button', { name: 'Adicionar vídeo' }))
    expect(await screen.findByText(/Use um link de vídeo do YouTube/)).toBeInTheDocument()

    await usuario.clear(link)
    await usuario.type(link, 'https://youtu.be/dQw4w9WgXcQ')
    expect(screen.getByAltText('Capa do vídeo informado')).toHaveAttribute(
      'src',
      'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
    )
    await usuario.selectOptions(screen.getByLabelText('Categoria'), 'Ferramentas')
    await usuario.click(screen.getByRole('button', { name: 'Adicionar vídeo' }))
    expect(await screen.findByRole('heading', { level: 1, name: 'Meu vídeo' })).toBeInTheDocument()
  })

  it('cria categoria sem sair do formulário e recusa nome repetido', async () => {
    const { usuario } = abrir('/painel/videos/novo')
    await usuario.click(await screen.findByText('Não achou a categoria? Criar uma nova'))
    await usuario.type(screen.getByLabelText('Nome da categoria'), 'front end')
    await usuario.click(screen.getByRole('button', { name: 'Criar e selecionar' }))
    expect(
      await screen.findByText('Já existe uma categoria chamada "front end".'),
    ).toBeInTheDocument()

    await usuario.clear(screen.getByLabelText('Nome da categoria'))
    await usuario.type(screen.getByLabelText('Nome da categoria'), 'Carreira')
    await usuario.click(screen.getByRole('button', { name: 'Criar e selecionar' }))
    await waitFor(() =>
      expect(
        screen.getByLabelText<HTMLSelectElement>('Categoria').selectedOptions[0]?.textContent,
      ).toBe('Carreira'),
    )
  })
})

describe('Painel', () => {
  it('exclui categoria em cascata e desfaz', async () => {
    const { usuario } = abrir('/painel')
    await usuario.click(await screen.findByRole('button', { name: 'Excluir Mobile' }))
    expect(
      screen.getByText(/Os 4 vídeo\(s\) desta categoria também serão excluídos/),
    ).toBeInTheDocument()
    await usuario.click(screen.getByRole('button', { name: 'Excluir categoria e vídeos' }))
    await waitFor(() => expect(screen.queryByRole('button', { name: 'Excluir Mobile' })).toBeNull())

    await usuario.click(screen.getByRole('button', { name: 'Desfazer' }))
    expect(await screen.findByRole('button', { name: 'Excluir Mobile' })).toBeInTheDocument()
  })

  it('troca a categoria do banner e a Início passa a abrir por ela', async () => {
    const { usuario } = abrir('/painel')
    await usuario.click(await screen.findByRole('radio', { name: 'Banner: Ferramentas' }))
    await usuario.click(screen.getByRole('link', { name: 'Início' }))
    const carrossel = await screen.findByRole('region', {
      name: 'Vídeos em destaque por categoria',
    })
    const primeiro = within(carrossel).getAllByRole('group')[0]!
    expect(within(primeiro).getByText('Ferramentas')).toBeInTheDocument()
  })

  it('exclui vídeo na aba Vídeos e desfaz', async () => {
    const { usuario } = abrir('/painel?aba=videos')
    await usuario.click(
      await screen.findByRole('button', { name: 'Excluir Docker in 100 Seconds' }),
    )
    await waitFor(() =>
      expect(screen.queryByRole('link', { name: 'Docker in 100 Seconds' })).toBeNull(),
    )
    await usuario.click(screen.getByRole('button', { name: 'Desfazer' }))
    expect(await screen.findByRole('link', { name: 'Docker in 100 Seconds' })).toBeInTheDocument()
  })

  it('mostra o contraste da cor escolhida', async () => {
    abrir('/painel')
    const info = await screen.findByText(/Texto branco · \d+,\d:1 · AA/)
    expect(info).toBeInTheDocument()
  })
})

describe('Acessibilidade', () => {
  it.each(['/', '/painel', '/painel?aba=videos', '/assistir/react-100', '/painel/videos/novo'])(
    'sem violações do axe em %s',
    async (rota) => {
      const { container } = abrir(rota)
      await screen.findByRole('main')
      await screen.findAllByRole('heading', { level: 1 })
      expect(await violacoesAxe(container)).toEqual([])
    },
  )
})
/* Fim dos testes de integração. */
