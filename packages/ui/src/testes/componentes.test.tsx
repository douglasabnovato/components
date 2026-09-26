/*
 * Testes dos componentes compartilhados: comportamento de teclado,
 * estados controlados, limites e acessibilidade básica (axe).
 */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import {
  AbasSegmentadas,
  BarraWidget,
  BotaoPausa,
  BotaoPilula,
  BotaoVoltar,
  Campo,
  CardEvento,
  Carrossel,
  Contador,
  MegaMenu,
  NavPilula,
  SeletorPilula,
  SkipLink,
} from '../index'
import { violacoesAxe } from './axe'

const abas = [
  { id: 'desafio', rotulo: 'Desafio', conteudo: <p>Texto do desafio</p> },
  { id: 'conteudo', rotulo: 'Conteúdo', conteudo: <p>Texto do conteúdo</p> },
  { id: 'solucao', rotulo: 'Solução', conteudo: <p>Texto da solução</p> },
]

const itensMega = [
  { href: '#a', titulo: 'Flix', descricao: 'Vídeos', icone: '▶' },
  { href: '#b', titulo: 'Cadastro', descricao: 'Clientes', icone: '◆' },
]

describe('AbasSegmentadas', () => {
  it('troca de painel pelo clique e pelas setas do teclado', async () => {
    const usuario = userEvent.setup()
    render(<AbasSegmentadas abas={abas} rotulo="Etapas" />)

    expect(screen.getByText('Texto do desafio')).toBeVisible()
    await usuario.click(screen.getByRole('tab', { name: 'Conteúdo' }))
    expect(screen.getByText('Texto do conteúdo')).toBeVisible()

    await usuario.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: 'Solução' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: 'Solução' })).toHaveFocus()

    await usuario.keyboard('{Home}')
    expect(screen.getByRole('tab', { name: 'Desafio' })).toHaveAttribute('aria-selected', 'true')
  })
})

describe('SeletorPilula', () => {
  it('marca a opção escolhida com aria-pressed', async () => {
    /* Componente de apoio que guarda o valor escolhido. */
    function Demo() {
      const [valor, setValor] = useState<'a' | 'b'>('a')
      return (
        <SeletorPilula
          rotulo="Vista"
          valor={valor}
          aoMudar={setValor}
          opcoes={[
            { valor: 'a', rotulo: 'Tabela' },
            { valor: 'b', rotulo: 'Formulário' },
          ]}
        />
      )
    }
    const usuario = userEvent.setup()
    render(<Demo />)
    await usuario.click(screen.getByRole('button', { name: 'Formulário' }))
    expect(screen.getByRole('button', { name: 'Formulário' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(screen.getByRole('button', { name: 'Tabela' })).toHaveAttribute('aria-pressed', 'false')
  })
})

describe('Contador', () => {
  it('respeita mínimo e máximo', async () => {
    const aoMudar = vi.fn()
    const usuario = userEvent.setup()
    const { rerender } = render(
      <Contador rotulo="Estimativa" valor={1} min={1} max={3} aoMudar={aoMudar} />,
    )
    expect(screen.getByRole('button', { name: 'Diminuir estimativa' })).toBeDisabled()
    await usuario.click(screen.getByRole('button', { name: 'Aumentar estimativa' }))
    expect(aoMudar).toHaveBeenCalledWith(2)

    rerender(<Contador rotulo="Estimativa" valor={3} min={1} max={3} aoMudar={aoMudar} />)
    expect(screen.getByRole('button', { name: 'Aumentar estimativa' })).toBeDisabled()
  })
})

describe('MegaMenu', () => {
  it('abre, mostra os itens e fecha com Esc devolvendo o foco', async () => {
    const usuario = userEvent.setup()
    render(<MegaMenu rotulo="Projetos" itens={itensMega} />)
    const gatilho = screen.getByRole('button', { name: 'Projetos' })

    await usuario.click(gatilho)
    expect(gatilho).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('link', { name: /Flix/ })).toBeVisible()

    await usuario.keyboard('{Escape}')
    expect(gatilho).toHaveAttribute('aria-expanded', 'false')
    expect(gatilho).toHaveFocus()
  })
})

describe('BotaoPilula', () => {
  it('vira link com href e botão sem href', () => {
    render(
      <>
        <BotaoPilula href="/flix/">Abrir</BotaoPilula>
        <BotaoPilula variante="vazado">Enviar</BotaoPilula>
      </>,
    )
    expect(screen.getByRole('link', { name: 'Abrir' })).toHaveAttribute('href', '/flix/')
    expect(screen.getByRole('button', { name: 'Enviar' })).toHaveAttribute('type', 'button')
  })
})

describe('BotaoPausa', () => {
  it('troca o rótulo acessível conforme o estado', () => {
    const { rerender } = render(<BotaoPausa pausado={false} aoAlternar={() => {}} />)
    expect(screen.getByRole('button', { name: 'Pausar animação' })).toBeInTheDocument()
    rerender(<BotaoPausa pausado aoAlternar={() => {}} />)
    expect(screen.getByRole('button', { name: 'Retomar animação' })).toBeInTheDocument()
  })
})

describe('CardEvento', () => {
  it('mostra lista fechada quando atinge o total', () => {
    render(
      <CardEvento
        titulo="Pelada de quinta"
        data="02 out"
        dataIso="2026-10-02"
        local="Quadra 3"
        categoria="Society"
        status={{ atual: 14, total: 14, rotulo: 'confirmados' }}
      />,
    )
    expect(screen.getByText('Lista fechada')).toBeInTheDocument()
    expect(screen.getByRole('progressbar', { name: '14 de 14 confirmados' })).toBeInTheDocument()
  })
})

describe('Carrossel', () => {
  it('renderiza slides rotulados e a paginação', () => {
    render(<Carrossel rotulo="Destaques" itens={[<p key="1">Um</p>, <p key="2">Dois</p>]} />)
    expect(screen.getByRole('group', { name: '1 de 2' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Ir para o slide 2' })).toBeInTheDocument()
  })
})

describe('BarraWidget', () => {
  it('envia sem recarregar a página', async () => {
    const aoEnviar = vi.fn()
    const usuario = userEvent.setup()
    render(
      <BarraWidget rotulo="Nova tarefa" acao="Adicionar" aoEnviar={aoEnviar}>
        <Campo rotulo="Título" htmlFor="titulo">
          <input id="titulo" />
        </Campo>
      </BarraWidget>,
    )
    await usuario.type(screen.getByLabelText('Título'), 'Estudar{Enter}')
    expect(aoEnviar).toHaveBeenCalledOnce()
  })
})

describe('Acessibilidade', () => {
  it('não tem violações do axe numa composição dos componentes', async () => {
    const { container } = render(
      <>
        <SkipLink />
        <NavPilula
          marca="Hub"
          rotuloMarca="Início"
          links={[{ href: '#sobre', rotulo: 'Sobre' }]}
          mega={{ rotulo: 'Projetos', itens: itensMega }}
        />
        <main id="conteudo">
          <AbasSegmentadas abas={abas} rotulo="Etapas" />
          <Contador rotulo="Pessoas" valor={2} aoMudar={() => {}} />
          <BotaoVoltar href="/#filho-1" />
        </main>
      </>,
    )
    expect(await violacoesAxe(container)).toEqual([])
  })
})
/* Fim dos testes dos componentes. */
