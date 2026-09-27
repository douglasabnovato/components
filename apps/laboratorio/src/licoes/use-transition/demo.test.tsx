/*
 * Teste da demo de useTransition: o filtro chega ao resultado final.
 */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, it } from 'vitest'
import Demo from './Demo'

it('filtra os 5.000 itens', async () => {
  const usuario = userEvent.setup()
  render(<Demo />)
  expect(screen.getByRole('status')).toHaveTextContent('5000 itens')
  await usuario.type(screen.getByLabelText('Filtrar itens'), '4999')
  expect(await screen.findByText('1 itens')).toBeInTheDocument()
  expect(screen.getByText('Item 4999')).toBeInTheDocument()
})
/* Fim do teste. */
