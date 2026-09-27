/*
 * Testes das regras e da demo do jogo da velha.
 */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, it } from 'vitest'
import Demo from './Demo'
import { empate, vencedor } from './regras'

it('as regras encontram vencedor e empate', () => {
  expect(vencedor(['X', 'X', 'X', null, 'O', 'O', null, null, null])?.linha).toEqual([0, 1, 2])
  expect(empate(['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'])).toBe(true)
})

it('joga até vencer e volta no tempo', async () => {
  const usuario = userEvent.setup()
  render(<Demo />)
  for (const casa of [1, 4, 2, 5, 3])
    await usuario.click(screen.getByRole('button', { name: `Casa ${casa}` }))
  expect(screen.getByRole('status')).toHaveTextContent('Vencedor: X')
  await usuario.click(screen.getByRole('button', { name: 'Jogada 2' }))
  expect(screen.getByRole('status')).toHaveTextContent('Vez de X')
  expect(screen.getByRole('button', { name: 'Casa 3' })).toHaveTextContent('')
})
/* Fim dos testes. */
