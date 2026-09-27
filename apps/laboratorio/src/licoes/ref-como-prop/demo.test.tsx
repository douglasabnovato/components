/*
 * Teste da demo de ref como prop.
 */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, it } from 'vitest'
import Demo from './Demo'

it('o pai foca e limpa o campo pelo controle exposto', async () => {
  const usuario = userEvent.setup()
  render(<Demo />)
  await usuario.click(screen.getByRole('button', { name: 'Focar busca' }))
  expect(screen.getByLabelText('Buscar')).toHaveFocus()
  await usuario.keyboard('react')
  await usuario.click(screen.getByRole('button', { name: 'Limpar busca' }))
  expect(screen.getByLabelText('Buscar')).toHaveValue('')
})
/* Fim do teste. */
