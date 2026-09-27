/*
 * Regras de duração da Trilha: converte o texto original ("46 min", "2h34")
 * em minutos e formata minutos de volta para leitura humana.
 */

/* Converte "46 min" em 46 e "2h34" em 154; lança erro em formato desconhecido. */
export function paraMinutos(texto: string): number {
  const limpo = texto.trim()
  const horas = /^(\d+)h(\d{2})$/.exec(limpo)
  if (horas) return Number(horas[1]) * 60 + Number(horas[2])
  const minutos = /^(\d+) min$/.exec(limpo)
  if (minutos) return Number(minutos[1])
  throw new Error(`Duração inválida: ${texto}`)
}

/* Formata minutos como "45 min", "1h" ou "12h05". */
export function formatarMinutos(total: number): string {
  if (total < 60) return `${total} min`
  const horas = Math.floor(total / 60)
  const resto = total % 60
  return resto === 0 ? `${horas}h` : `${horas}h${String(resto).padStart(2, '0')}`
}

/* Versão por extenso para leitores de tela: "2 horas e 34 minutos". */
export function minutosPorExtenso(total: number): string {
  const horas = Math.floor(total / 60)
  const resto = total % 60
  const partes = []
  if (horas) partes.push(`${horas} ${horas === 1 ? 'hora' : 'horas'}`)
  if (resto || !horas) partes.push(`${resto} ${resto === 1 ? 'minuto' : 'minutos'}`)
  return partes.join(' e ')
}
/* Fim das regras de duração. */
