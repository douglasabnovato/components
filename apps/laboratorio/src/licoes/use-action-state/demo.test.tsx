/*
 * Testes da ação (sem tela) e da demo com useActionState.
 */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeAll, expect, it } from 'vitest'
import Demo from './Demo'
import { esperar, estadoInicial, inscrever } from './inscricao'

beforeAll(() => {
  esperar.ms = 10
})

/* Monta um FormData com o e-mail. */
function comEmail(email: string) {
  const dados = new FormData()
  dados.set('email', email)
  return dados
}

it('a ação valida, normaliza e recusa repetidos', async () => {
  const primeiro = await inscrever(estadoInicial, comEmail(' ANA@Exemplo.com '))
  expect(primeiro).toMatchObject({ erro: false, inscritos: ['ana@exemplo.com'] })
  expect((await inscrever(primeiro, comEmail('ana@exemplo.com'))).erro).toBe(true)
  expect((await inscrever(primeiro, comEmail('x'))).mensagem).toBe('Informe um e-mail válido.')
})

it('mostra pendente e depois o resultado', async () => {
  const usuario = userEvent.setup()
  render(<Demo />)
  await usuario.type(screen.getByLabelText('E-mail'), 'ana@exemplo.com')
  await usuario.click(screen.getByRole('button', { name: 'Inscrever' }))
  expect(await screen.findByText('ana@exemplo.com inscrito!')).toBeInTheDocument()
  expect(screen.getByText('Inscritos: 1')).toBeInTheDocument()
})
/* Fim dos testes. */
