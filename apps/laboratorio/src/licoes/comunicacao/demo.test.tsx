/*
 * Teste da demo de comunicação: o valor sobe do filho para o pai.
 */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, it, vi } from 'vitest'
import Demo from './Demo'

it('passa texto para baixo e recebe o sorteio de volta', async () => {
  vi.spyOn(Math, 'random').mockReturnValue(0.5)
  const usuario = userEvent.setup()
  render(<Demo />)
  expect(screen.getByText('O pai me disse: olá, filho')).toBeInTheDocument()
  await usuario.click(screen.getByRole('button', { name: 'Sortear no filho' }))
  expect(screen.getByText('O filho sorteou 31')).toBeInTheDocument()
  vi.restoreAllMocks()
})
/* Fim do teste. */
