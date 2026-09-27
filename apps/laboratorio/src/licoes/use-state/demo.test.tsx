/*
 * Teste da demo de useState.
 */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, it } from 'vitest'
import Demo from './Demo'

it('soma e subtrai pelo passo', async () => {
  const usuario = userEvent.setup()
  render(<Demo />)
  await usuario.click(screen.getByRole('button', { name: 'Aumentar' }))
  expect(screen.getByLabelText('Contagem: 1')).toBeInTheDocument()
  await usuario.selectOptions(screen.getByLabelText('Passo'), '5')
  await usuario.click(screen.getByRole('button', { name: 'Aumentar' }))
  expect(screen.getByLabelText('Contagem: 6')).toBeInTheDocument()
  await usuario.click(screen.getByRole('button', { name: 'Diminuir' }))
  expect(screen.getByLabelText('Contagem: 1')).toBeInTheDocument()
})
/* Fim do teste. */
