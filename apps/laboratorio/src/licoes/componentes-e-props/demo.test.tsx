/*
 * Teste da demo de componentes e props.
 */
import { render, screen, within } from '@testing-library/react'
import { expect, it } from 'vitest'
import Demo from './Demo'

it('repassa o sobrenome para cada membro e reaproveita o Cartao', () => {
  render(<Demo />)
  const familia = screen.getByRole('region', { name: 'Família Silva' })
  expect(
    within(familia)
      .getAllByRole('listitem')
      .map((li) => li.textContent),
  ).toEqual(['Ana Silva', 'Bia Silva', 'Caio Silva'])
  expect(screen.getByRole('region', { name: 'Recado' })).toHaveTextContent('outro conteúdo')
})
/* Fim do teste. */
