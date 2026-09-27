/*
 * Regras de exibição das Tarefas como funções puras: filtro por situação,
 * contagens derivadas, destaque do trecho encontrado pela expressão regular
 * e a decisão de qual tecla faz o quê.
 */
import type { SituacaoTarefa, Tarefa } from '@components/contratos'

export type Trecho = { texto: string; destaque: boolean }
export type Comando = 'adicionar' | 'buscar' | 'limpar' | null

/* Mantém só as tarefas da situação escolhida. */
export function filtrarPorSituacao(tarefas: Tarefa[], situacao: SituacaoTarefa) {
  if (situacao === 'pendentes') return tarefas.filter((t) => !t.concluida)
  if (situacao === 'concluidas') return tarefas.filter((t) => t.concluida)
  return tarefas
}

/* Conta pendentes e concluídas (sempre calculado, nunca guardado). */
export function contar(tarefas: Tarefa[]) {
  const concluidas = tarefas.filter((t) => t.concluida).length
  return { total: tarefas.length, concluidas, pendentes: tarefas.length - concluidas }
}

/* Divide o texto em trechos, marcando o que casa com o padrão (sem diferenciar maiúsculas). */
export function destacar(texto: string, padrao: string): Trecho[] {
  if (!padrao) return [{ texto, destaque: false }]
  let expressao: RegExp
  try {
    expressao = new RegExp(padrao, 'gi')
  } catch {
    return [{ texto, destaque: false }]
  }
  const trechos: Trecho[] = []
  let inicio = 0
  for (const achado of texto.matchAll(expressao)) {
    const posicao = achado.index ?? 0
    if (achado[0] === '') continue
    if (posicao > inicio) trechos.push({ texto: texto.slice(inicio, posicao), destaque: false })
    trechos.push({ texto: achado[0], destaque: true })
    inicio = posicao + achado[0].length
  }
  if (inicio < texto.length) trechos.push({ texto: texto.slice(inicio), destaque: false })
  return trechos.length ? trechos : [{ texto, destaque: false }]
}

/* Traduz a tecla pressionada no campo em um comando (atalhos do projeto original). */
export function comandoDaTecla(tecla: string, shift: boolean): Comando {
  if (tecla === 'Enter') return shift ? 'buscar' : 'adicionar'
  if (tecla === 'Escape') return 'limpar'
  return null
}

/* "26/09, 14:05" no fuso local. */
export function formatarCriacao(iso: string) {
  const d = new Date(iso)
  const dois = (n: number) => String(n).padStart(2, '0')
  return `${dois(d.getDate())}/${dois(d.getMonth() + 1)}, ${dois(d.getHours())}:${dois(d.getMinutes())}`
}
/* Fim das regras das Tarefas. */
