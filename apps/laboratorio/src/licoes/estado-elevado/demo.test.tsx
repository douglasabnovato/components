/*
 * Teste da demo de estado elevado: os dois campos ficam sincronizados.
 */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, it } from 'vitest'
import Demo from './Demo'
import { converter } from './temperatura'

it('converte nas duas direções', () => {
  expect(converter('100', 'f')).toBe('212')
  expect(converter('32', 'c')).toBe('0')
  expect(converter('abc', 'f')).toBe('')
})

it('editar um campo atualiza o outro', async () => {
  const usuario = userEvent.setup()
  render(<Demo />)
  expect(screen.getByLabelText('Fahrenheit')).toHaveValue('212')
  await usuario.clear(screen.getByLabelText('Fahrenheit'))
  await usuario.type(screen.getByLabelText('Fahrenheit'), '50')
  expect(screen.getByLabelText('Celsius')).toHaveValue('10')
  expect(screen.getByText('A água não ferve.')).toBeInTheDocument()
})
/* Fim do teste. */
