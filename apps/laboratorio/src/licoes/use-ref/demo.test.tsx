/*
 * Teste da demo de useRef.
 */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, it } from 'vitest'
import Demo from './Demo'

it('foca pelo botão e conta renderizações sem renderizar a mais', async () => {
  const usuario = userEvent.setup()
  render(<Demo />)
  await usuario.click(screen.getByRole('button', { name: 'Focar o campo' }))
  expect(screen.getByLabelText('Nome')).toHaveFocus()
  await usuario.keyboard('Ana')
  await usuario.click(screen.getByRole('button', { name: 'Ver renderizações' }))
  expect(screen.getByText('Renderizações contadas até o último clique: 4')).toBeInTheDocument()
})
/* Fim do teste. */
