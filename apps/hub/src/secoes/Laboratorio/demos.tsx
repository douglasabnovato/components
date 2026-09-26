/*
 * Demonstrações vivas das lições do Laboratório: useState, useEffect e
 * useContext. Cada uma é a "solução" rodando ao lado do código mostrado.
 */
import { createContext, useContext, useEffect, useState } from 'react'
import styles from './SecaoLaboratorio.module.css'

/* Contador simples com estado local. */
export function DemoContador() {
  const [cliques, setCliques] = useState(0)
  return (
    <div className={styles.demoCaixa}>
      <output className={styles.demoValor} aria-live="polite">
        {cliques}
      </output>
      <button type="button" className={styles.demoBotao} onClick={() => setCliques((c) => c + 1)}>
        Somar 1
      </button>
    </div>
  )
}

/* Cronômetro que liga e desliga o intervalo com limpeza no efeito. */
export function DemoRelogio() {
  const [segundos, setSegundos] = useState(0)
  const [rodando, setRodando] = useState(false)

  useEffect(() => {
    if (!rodando) return
    const id = window.setInterval(() => setSegundos((s) => s + 1), 1000)
    return () => window.clearInterval(id)
  }, [rodando])

  return (
    <div className={styles.demoCaixa}>
      <output className={styles.demoValor}>{segundos}s</output>
      <button type="button" className={styles.demoBotao} onClick={() => setRodando((r) => !r)}>
        {rodando ? 'Pausar' : 'Iniciar'}
      </button>
    </div>
  )
}

type Tema = 'claro' | 'escuro'
const TemaContexto = createContext<{ tema: Tema; alternar: () => void } | null>(null)

/* Leitor do contexto: falha de forma explícita se não houver Provider. */
function useTema() {
  const valor = useContext(TemaContexto)
  if (!valor) throw new Error('useTema precisa de um <TemaContexto.Provider>')
  return valor
}

/* Componente distante que lê e altera o tema pelo contexto. */
function CartaoComTema() {
  const { tema, alternar } = useTema()
  return (
    <div className={styles.demoCartao} data-tema-demo={tema}>
      <p>Tema atual: {tema}</p>
      <button type="button" className={styles.demoBotao} onClick={alternar}>
        Alternar tema
      </button>
    </div>
  )
}

/* Provider que envolve a árvore: a correção do projeto original. */
export function DemoTema() {
  const [tema, setTema] = useState<Tema>('escuro')
  const alternar = () => setTema((t) => (t === 'claro' ? 'escuro' : 'claro'))
  return (
    <TemaContexto.Provider value={{ tema, alternar }}>
      <CartaoComTema />
    </TemaContexto.Provider>
  )
}
/* Fim das demonstrações do Laboratório. */
