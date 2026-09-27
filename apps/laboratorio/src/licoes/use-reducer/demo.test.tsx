/*
 * Testes do reducer (sem tela) e da demo.
 */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, it } from 'vitest'
import { inicial, reducer } from './contador'
import Demo from './Demo'

it('o reducer é uma função pura com desfazer', () => {
  let e = reducer(inicial, { tipo: 'somar', quanto: 5 })
  e = reducer(e, { tipo: 'multiplicar', fator: 3 })
  expect(e.valor).toBe(15)
  expect(reducer(e, { tipo: 'desfazer' }).valor).toBe(5)
  expect(reducer(inicial, { tipo: 'desfazer' })).toBe(inicial)
})

it('os botões despacham ações', async () => {
  const usuario = userEvent.setup()
  render(<Demo />)
  await usuario.click(screen.getByRole('button', { name: '+10' }))
  await usuario.click(screen.getByRole('button', { name: '×2' }))
  expect(screen.getByLabelText('Valor: 20')).toBeInTheDocument()
  await usuario.click(screen.getByRole('button', { name: 'Desfazer' }))
  expect(screen.getByLabelText('Valor: 10')).toBeInTheDocument()
})
/* Fim dos testes. */
