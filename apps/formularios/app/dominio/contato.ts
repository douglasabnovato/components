/*
 * Regras do formulário de contato. A validação roda no servidor (action) e é
 * a única fonte da verdade: o formulário funciona igual com ou sem JavaScript.
 */
import { z } from 'zod'

export const ASSUNTOS = [
  { valor: 'duvida', rotulo: 'Dúvida sobre um projeto' },
  { valor: 'sugestao', rotulo: 'Sugestão de conteúdo' },
  { valor: 'parceria', rotulo: 'Parceria ou evento' },
] as const

export const esquemaContato = z.object({
  nome: z
    .string()
    .trim()
    .min(3, 'Informe seu nome, com pelo menos 3 letras.')
    .max(80, 'Use até 80 letras.'),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email('Informe um e-mail válido, como voce@exemplo.com.')),
  assunto: z.enum(['duvida', 'sugestao', 'parceria'], { error: 'Escolha um assunto.' }),
  mensagem: z
    .string()
    .trim()
    .min(10, 'Escreva uma mensagem com pelo menos 10 caracteres.')
    .max(1000, 'Use até 1000 caracteres.'),
  resposta: z.boolean(),
})

export type DadosContato = z.infer<typeof esquemaContato>
export type CampoContato = keyof Omit<DadosContato, 'resposta'>
export type ValoresContato = Record<CampoContato, string> & { resposta: boolean }

export type ResultadoValidacao =
  | { ok: true; dados: DadosContato; robo: boolean }
  | { ok: false; erros: Partial<Record<CampoContato, string>>; valores: ValoresContato }

export const ORDEM_CAMPOS: CampoContato[] = ['nome', 'email', 'assunto', 'mensagem']

/* Lê o FormData como texto (campos ausentes viram vazio). */
export function lerFormulario(formulario: FormData): ValoresContato {
  const texto = (campo: string) => String(formulario.get(campo) ?? '')
  return {
    nome: texto('nome'),
    email: texto('email'),
    assunto: texto('assunto'),
    mensagem: texto('mensagem'),
    resposta: formulario.get('resposta') === 'sim',
  }
}

/*
 * Valida o envio. O campo "site" é uma armadilha escondida: pessoas não o
 * veem; robôs costumam preenchê-lo. Nesse caso a resposta parece sucesso,
 * mas nada é guardado.
 */
export function validarContato(formulario: FormData): ResultadoValidacao {
  const valores = lerFormulario(formulario)
  const resultado = esquemaContato.safeParse(valores)
  if (!resultado.success) {
    const erros: Partial<Record<CampoContato, string>> = {}
    for (const problema of resultado.error.issues) {
      const campo = problema.path[0] as CampoContato
      erros[campo] ??= problema.message
    }
    return { ok: false, erros, valores }
  }
  return { ok: true, dados: resultado.data, robo: String(formulario.get('site') ?? '') !== '' }
}

/* Rótulo legível do assunto. */
export function rotuloAssunto(valor: string) {
  return ASSUNTOS.find((a) => a.valor === valor)?.rotulo ?? valor
}
/* Fim das regras do contato. */
