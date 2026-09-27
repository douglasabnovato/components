/*
 * Ação assíncrona da inscrição: recebe o estado anterior e o FormData, valida
 * e devolve o próximo estado. A espera simula a ida ao servidor.
 */
export type EstadoInscricao = { mensagem: string; erro: boolean; inscritos: string[] }

export const estadoInicial: EstadoInscricao = { mensagem: '', erro: false, inscritos: [] }

export const esperar = { ms: 600 }

/* Valida o e-mail, simula a rede e acumula os inscritos. */
export async function inscrever(
  anterior: EstadoInscricao,
  dados: FormData,
): Promise<EstadoInscricao> {
  const email = String(dados.get('email') ?? '')
    .trim()
    .toLowerCase()
  await new Promise((resolver) => setTimeout(resolver, esperar.ms))
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ...anterior, mensagem: 'Informe um e-mail válido.', erro: true }
  }
  if (anterior.inscritos.includes(email)) {
    return { ...anterior, mensagem: `${email} já está inscrito.`, erro: true }
  }
  return { mensagem: `${email} inscrito!`, erro: false, inscritos: [...anterior.inscritos, email] }
}
/* Fim da ação de inscrição. */
