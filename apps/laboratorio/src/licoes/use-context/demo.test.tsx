/*
 * Teste da demo de useContext, inclusive o erro sem Provider.
 */
import { render, renderHook, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, it, vi } from 'vitest'
import Demo from './Demo'
import { useTema } from './tema'

it('o cartão lê e alterna o tema sem props no meio', async () => {
  const usuario = userEvent.setup()
  render(<Demo />)
  expect(screen.getByText('Tema atual: escuro')).toBeInTheDocument()
  await usuario.click(screen.getByRole('button', { name: 'Alternar tema' }))
  expect(screen.getByText('Tema atual: claro')).toBeInTheDocument()
})

it('sem Provider, o hook explica o que falta', () => {
  vi.spyOn(console, 'error').mockImplementation(() => {})
  expect(() => renderHook(() => useTema())).toThrow('useTema precisa de um <TemaContexto.Provider>')
  vi.restoreAllMocks()
})
/* Fim do teste. */
