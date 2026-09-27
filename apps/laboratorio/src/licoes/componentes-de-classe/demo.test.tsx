/*
 * Teste da demo histórica: classe e hooks contam igual.
 */
import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import Demo from './Demo'

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

it('os dois relógios contam no mesmo ritmo', () => {
  render(<Demo />)
  act(() => vi.advanceTimersByTime(3000))
  expect(screen.getByText('Classe: 3s')).toBeInTheDocument()
  expect(screen.getByText('Hooks: 3s')).toBeInTheDocument()
})
/* Fim do teste. */
