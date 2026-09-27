/*
 * Testes dos contratos: normalização e mensagens que front e back compartilham.
 */
import { describe, expect, it } from 'vitest'
import {
  errosPorCampo,
  esquemaAlteracaoTarefa,
  esquemaDadosCliente,
  esquemaNovaTarefa,
  validarPadrao,
} from './index'

describe('clientes', () => {
  it('normaliza e-mail e nome e valida idade', () => {
    const r = esquemaDadosCliente.parse({
      nome: '  Ana Ribeiro ',
      email: ' ANA@Exemplo.com ',
      idade: 34,
    })
    expect(r).toEqual({ nome: 'Ana Ribeiro', email: 'ana@exemplo.com', idade: 34 })
    const erro = esquemaDadosCliente.safeParse({ nome: 'Al', email: 'x', idade: 200 })
    expect(errosPorCampo(erro.error!.issues)).toEqual({
      nome: 'Informe um nome com pelo menos 3 letras.',
      email: 'Informe um e-mail válido.',
      idade: 'Informe uma idade entre 0 e 130.',
    })
  })
})

describe('tarefas', () => {
  it('exige descrição e pelo menos um campo na alteração', () => {
    expect(esquemaNovaTarefa.safeParse({ descricao: '   ' }).success).toBe(false)
    expect(esquemaAlteracaoTarefa.safeParse({}).success).toBe(false)
    expect(esquemaAlteracaoTarefa.safeParse({ concluida: true }).success).toBe(true)
  })

  it('valida expressões regulares', () => {
    expect(validarPadrao('^comprar')).toBeNull()
    expect(validarPadrao('(')).toBe('Expressão regular inválida.')
  })
})
/* Fim dos testes dos contratos. */
