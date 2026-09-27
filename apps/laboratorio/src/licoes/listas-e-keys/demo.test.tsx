/*
 * Teste da demo de listas e keys: a nota precisa acompanhar a tarefa.
 */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, it } from 'vitest'
import Demo from './Demo'

it('com key pelo id, a nota continua com a tarefa certa', async () => {
  const usuario = userEvent.setup()
  render(<Demo />)
  await usuario.type(screen.getByLabelText('Nota de Estudar keys'), 'feito')
  await usuario.click(screen.getByRole('button', { name: 'Adicionar no topo' }))
  expect(screen.getByLabelText('Nota de Estudar keys')).toHaveValue('feito')
})

it('com key pelo índice, a nota pula para a tarefa nova', async () => {
  const usuario = userEvent.setup()
  render(<Demo />)
  await usuario.click(screen.getByLabelText('Usar o índice como key (errado)'))
  await usuario.type(screen.getByLabelText('Nota de Estudar keys'), 'feito')
  await usuario.click(screen.getByRole('button', { name: 'Adicionar no topo' }))
  expect(screen.getByLabelText('Nota de Tarefa nova 3')).toHaveValue('feito')
})
/* Fim do teste. */
