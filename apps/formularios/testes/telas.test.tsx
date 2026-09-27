// @vitest-environment jsdom
/*
 * Testes de tela com createRoutesStub (caminho com JavaScript): o formulário
 * mostra os erros da action ao lado dos campos, leva o foco ao resumo e
 * navega para a confirmação. Com axe.
 */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { violacoesAxe } from '@components/ui/testes/axe'
import { createRoutesStub } from 'react-router'
import { beforeEach, describe, expect, it } from 'vitest'
import { esvaziarCaixa } from '../app/dominio/mensagens.server'
import Contato, { action as acaoContato } from '../app/routes/contato'
import Enviado, { loader as carregarEnviado } from '../app/routes/enviado'
import Inicio, { loader as carregarInicio } from '../app/routes/inicio'

/* Monta as rotas reais sobre um roteador em memória. */
function abrir(rota: string) {
  const Stub = createRoutesStub([
    { path: '/', Component: Inicio, loader: carregarInicio },
    { path: '/contato', Component: Contato, action: acaoContato },
    { path: '/contato/enviado', Component: Enviado, loader: carregarEnviado },
  ] as never)
  return render(<Stub initialEntries={[rota]} />)
}

beforeEach(() => esvaziarCaixa())

describe('Contato com JavaScript', () => {
  it('mostra erros por campo, foca o resumo e depois envia', async () => {
    const usuario = userEvent.setup()
    abrir('/contato')
    await usuario.click(await screen.findByRole('button', { name: 'Enviar mensagem' }))
    const resumo = await screen.findByRole('alert')
    expect(resumo).toHaveTextContent('Corrija 4 campos')
    expect(resumo).toHaveFocus()
    expect(screen.getByLabelText('Nome')).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByLabelText('Nome')).toHaveAccessibleDescription(
      'Informe seu nome, com pelo menos 3 letras.',
    )

    await usuario.type(screen.getByLabelText('Nome'), 'Ana Lima')
    await usuario.type(screen.getByLabelText('E-mail'), 'ana@exemplo.com')
    await usuario.selectOptions(screen.getByLabelText('Assunto'), 'parceria')
    await usuario.type(screen.getByLabelText('Mensagem'), 'Vamos fazer um evento juntos?')
    await usuario.click(screen.getByRole('button', { name: 'Enviar mensagem' }))
    expect(await screen.findByRole('heading', { name: 'Mensagem recebida.' })).toBeInTheDocument()
    expect(screen.getByText('MSG-0001')).toBeInTheDocument()
    expect(screen.getByText('Parceria ou evento')).toBeInTheDocument()
  })

  it('não tem violações do axe', async () => {
    const { container } = abrir('/contato')
    await screen.findByRole('button', { name: 'Enviar mensagem' })
    expect(await violacoesAxe(container)).toEqual([])
  })
})

describe('Início', () => {
  it('desenha os princípios que vêm do loader', async () => {
    const { container } = abrir('/')
    expect(await screen.findByRole('heading', { name: 'Post, redirect, get' })).toBeInTheDocument()
    expect(await violacoesAxe(container)).toEqual([])
  })
})
/* Fim dos testes de tela. */
