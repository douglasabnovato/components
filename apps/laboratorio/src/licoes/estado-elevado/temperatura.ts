/*
 * Conversão de temperatura como função pura, testável sem tela.
 */
export type Escala = 'c' | 'f'

/* Converte o texto de uma escala para a outra; vazio ou inválido vira vazio. */
export function converter(texto: string, para: Escala) {
  const valor = Number.parseFloat(texto.replace(',', '.'))
  if (Number.isNaN(valor)) return ''
  const resultado = para === 'f' ? (valor * 9) / 5 + 32 : ((valor - 32) * 5) / 9
  return String(Math.round(resultado * 10) / 10)
}
/* Fim da conversão. */
