/*
 * Teste da demo de renderização condicional.
 */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, it } from 'vitest'
import Demo from './Demo'

it('troca o texto conforme o número e o usuário', async () => {
  const usuario = userEvent.setup()
  render(<Demo />)
  expect(screen.getByText('7 é ímpar')).toBeInTheDocument()
  await usuario.click(screen.getByRole('button', { name: 'Somar 1' }))
  expect(screen.getByText('8 é par')).toBeInTheDocument()
  expect(screen.getByText('Entre para continuar.')).toBeInTheDocument()
  await usuario.click(screen.getByRole('button', { name: 'Entrar como Ana' }))
  expect(screen.getByText('Olá, Ana!')).toBeInTheDocument()
})
/* Fim do teste. */
