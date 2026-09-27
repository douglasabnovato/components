/*
 * Contrato de clientes: esquemas usados pelo formulário do Cadastro (front) e
 * pelas rotas /clientes da API (back). Mudar aqui quebra o build dos dois lados.
 */
import { z } from 'zod'

export const esquemaDadosCliente = z.object({
  nome: z
    .string()
    .trim()
    .min(3, 'Informe um nome com pelo menos 3 letras.')
    .max(80, 'Use até 80 letras.'),
  email: z.string().trim().toLowerCase().pipe(z.email('Informe um e-mail válido.')),
  idade: z
    .number({ error: 'Informe a idade.' })
    .int('Use um número inteiro.')
    .min(0, 'Informe uma idade entre 0 e 130.')
    .max(130, 'Informe uma idade entre 0 e 130.'),
})

export const esquemaCliente = esquemaDadosCliente.extend({
  id: z.string().min(1),
  criadoEm: z.string(),
})

export const ORDENS_CLIENTE = ['nome', 'idade', 'recentes'] as const

export const esquemaConsultaClientes = z.object({
  busca: z.string().trim().max(80).optional(),
  ordem: z.enum(ORDENS_CLIENTE).optional(),
})

export type DadosCliente = z.infer<typeof esquemaDadosCliente>
export type Cliente = z.infer<typeof esquemaCliente>
export type OrdemCliente = (typeof ORDENS_CLIENTE)[number]
export type ConsultaClientes = z.infer<typeof esquemaConsultaClientes>
/* Fim do contrato de clientes. */
