/*
 * Teste da demo de useMemo, useCallback e memo: trocar o tema não refaz o
 * cálculo; mudar o limite refaz.
 */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, it } from 'vitest'
import Demo from './Demo'
import { medidas, primosAte } from './primos'

it('calcula os primos corretamente', () => {
  expect(primosAte(20)).toEqual([2, 3, 5, 7, 11, 13, 17, 19])
})

it('só recalcula e renderiza a lista quando o limite muda', async () => {
  const usuario = userEvent.setup()
  render(<Demo />)
  const calculos = medidas.calculos
  const renderizacoes = medidas.renderizacoesDaLista
  await usuario.click(screen.getByRole('button', { name: 'Trocar tema' }))
  await usuario.click(screen.getByRole('button', { name: 'Trocar tema' }))
  expect(medidas.calculos).toBe(calculos)
  expect(medidas.renderizacoesDaLista).toBe(renderizacoes)
  await usuario.selectOptions(screen.getByLabelText('Limite'), '10000')
  expect(medidas.calculos).toBe(calculos + 1)
  expect(medidas.renderizacoesDaLista).toBe(renderizacoes + 1)
  expect(screen.getByText('1229 primos até 10000. Últimos:')).toBeInTheDocument()
})
/* Fim do teste. */
