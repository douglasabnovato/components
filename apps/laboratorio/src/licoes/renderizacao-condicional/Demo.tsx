/*
 * Demo: renderização condicional. O texto muda conforme o número (ternário)
 * e a saudação só aparece com alguém logado (&&, com retorno antecipado).
 */
import { useState } from 'react'
import estilos from '../demo.module.css'

/* Diz se o número é par ou ímpar. */
function ParOuImpar({ numero }: { numero: number }) {
  return <p aria-live="polite">{numero % 2 === 0 ? `${numero} é par` : `${numero} é ímpar`}</p>
}

/* Saúda o usuário ou pede para entrar. */
function UsuarioInfo({ nome }: { nome: string | null }) {
  if (!nome) return <p className={estilos.suave}>Entre para continuar.</p>
  return <p>Olá, {nome}!</p>
}

/* Controla o número e o usuário. */
export default function Demo() {
  const [numero, setNumero] = useState(7)
  const [nome, setNome] = useState<string | null>(null)
  return (
    <div className={estilos.caixa}>
      <div className={estilos.linha}>
        <button type="button" className={estilos.botao} onClick={() => setNumero((n) => n + 1)}>
          Somar 1
        </button>
        <ParOuImpar numero={numero} />
      </div>
      <div className={estilos.linha}>
        <button
          type="button"
          className={[estilos.botao, estilos.vazado].join(' ')}
          onClick={() => setNome((atual) => (atual ? null : 'Ana'))}
        >
          {nome ? 'Sair' : 'Entrar como Ana'}
        </button>
        <UsuarioInfo nome={nome} />
      </div>
    </div>
  )
}
/* Fim da demo. */
