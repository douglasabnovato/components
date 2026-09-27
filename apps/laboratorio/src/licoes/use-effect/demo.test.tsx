/*
 * Teste da demo de useEffect: pausar e retomar não acelera o cronômetro.
 */
import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import Demo from './Demo'

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

it('conta um por segundo, mesmo depois de pausar e retomar', () => {
  render(<Demo />)
  fireEvent.click(screen.getByRole('button', { name: 'Iniciar' }))
  act(() => vi.advanceTimersByTime(3000))
  fireEvent.click(screen.getByRole('button', { name: 'Pausar' }))
  fireEvent.click(screen.getByRole('button', { name: 'Iniciar' }))
  act(() => vi.advanceTimersByTime(2000))
  expect(screen.getByLabelText('5 segundos')).toBeInTheDocument()
})
/* Fim do teste. */
