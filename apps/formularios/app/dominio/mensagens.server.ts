/*
 * Caixa de mensagens do servidor. Fica na memória do processo Node (some ao
 * reiniciar), o suficiente para demonstrar o ciclo loader → action → redirect.
 * O sufixo .server garante que este arquivo nunca vai para o navegador.
 */
import type { DadosContato } from './contato'

export type Mensagem = DadosContato & { protocolo: string; recebidaEm: string }

let caixa: Mensagem[] = []
let contador = 0

/* Guarda a mensagem e devolve o protocolo gerado (MSG-0001, MSG-0002...). */
export function guardarMensagem(dados: DadosContato, agora = new Date()): Mensagem {
  contador += 1
  const mensagem = {
    ...dados,
    protocolo: `MSG-${String(contador).padStart(4, '0')}`,
    recebidaEm: agora.toISOString(),
  }
  caixa = [mensagem, ...caixa]
  return mensagem
}

/* Todas as mensagens, da mais recente para a mais antiga. */
export function listarMensagens() {
  return caixa
}

/* Uma mensagem pelo protocolo, ou null. */
export function buscarMensagem(protocolo: string) {
  return caixa.find((m) => m.protocolo === protocolo) ?? null
}

/* Esvazia a caixa (botão da página Mensagens e testes). */
export function esvaziarCaixa() {
  caixa = []
  contador = 0
}
/* Fim da caixa de mensagens. */
