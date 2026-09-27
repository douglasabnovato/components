/*
 * Demo: jogo da velha com histórico (tutorial clássico da documentação do
 * React). O estado é só a lista de tabuleiros e a jogada atual; vez,
 * vencedor e empate são calculados.
 */
import { useState } from 'react'
import estilos from '../demo.module.css'
import { empate, vencedor, vezDe, type Casa } from './regras'

/* Controla histórico e jogada atual. */
export default function Demo() {
  const [historico, setHistorico] = useState<Casa[][]>([Array<Casa>(9).fill(null)])
  const [jogada, setJogada] = useState(0)
  const casas = historico[jogada]!
  const ganhou = vencedor(casas)
  const velha = empate(casas)
  const status = ganhou
    ? `Vencedor: ${ganhou.jogador}`
    : velha
      ? 'Deu velha!'
      : `Vez de ${vezDe(jogada)}`

  /* Marca a casa, descartando o futuro se o jogo tinha voltado no tempo. */
  function jogar(indice: number) {
    if (casas[indice] || ganhou) return
    const proximo = casas.slice()
    proximo[indice] = vezDe(jogada)
    setHistorico([...historico.slice(0, jogada + 1), proximo])
    setJogada(jogada + 1)
  }

  return (
    <div className={estilos.caixa}>
      <p role="status">{status}</p>
      <div className={estilos.tabuleiro}>
        {casas.map((valor, i) => (
          <button
            key={i}
            type="button"
            className={estilos.casa}
            aria-label={`Casa ${i + 1}${valor ? `: ${valor}` : ''}`}
            onClick={() => jogar(i)}
          >
            {valor}
          </button>
        ))}
      </div>
      <ol className={estilos.linha} aria-label="Histórico">
        {historico.map((_, i) => (
          <li key={i} style={{ listStyle: 'none' }}>
            <button
              type="button"
              className={[estilos.botao, estilos.vazado].join(' ')}
              aria-current={i === jogada ? 'step' : undefined}
              onClick={() => setJogada(i)}
            >
              {i === 0 ? 'Início' : `Jogada ${i}`}
            </button>
          </li>
        ))}
      </ol>
    </div>
  )
}
/* Fim da demo. */
