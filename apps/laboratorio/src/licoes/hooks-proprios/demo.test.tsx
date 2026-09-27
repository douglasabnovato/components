/*
 * Testes dos hooks próprios (renderHook) e da demo.
 */
import { act, render, renderHook, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, it } from 'vitest'
import Demo from './Demo'
import { useContador } from './hooks'

it('useContador respeita os limites', () => {
  const { result } = renderHook(() => useContador(3, { min: 0, max: 4 }))
  act(() => result.current.somar(5))
  expect(result.current.valor).toBe(4)
  act(() => result.current.subtrair(10))
  expect(result.current.valor).toBe(0)
})

it('cada componente tem o seu estado', async () => {
  const usuario = userEvent.setup()
  render(<Demo />)
  await usuario.click(screen.getByRole('button', { name: 'Mais ingressos' }))
  await usuario.click(screen.getByRole('button', { name: 'Curtir (10)' }))
  expect(screen.getByLabelText('Ingressos: 1')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Curtir (11)' })).toBeInTheDocument()
})
/* Fim dos testes. */
