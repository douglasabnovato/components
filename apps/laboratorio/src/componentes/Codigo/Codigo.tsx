/*
 * Codigo: bloco de código-fonte com título e botão de copiar. O texto vem
 * do próprio arquivo da lição (import ?raw).
 */
import { useState } from 'react'
import estilos from './Codigo.module.css'

type Props = { titulo: string; codigo: string }

/* Mostra o código e copia para a área de transferência. */
export function Codigo({ titulo, codigo }: Props) {
  const [copiado, setCopiado] = useState(false)

  /* Copia e avisa por dois segundos. */
  async function copiar() {
    try {
      await navigator.clipboard.writeText(codigo)
      setCopiado(true)
      window.setTimeout(() => setCopiado(false), 2000)
    } catch {
      setCopiado(false)
    }
  }

  return (
    <figure className={estilos.bloco}>
      <figcaption className={estilos.topo}>
        <span>{titulo}</span>
        <button type="button" className={estilos.copiar} onClick={copiar}>
          {copiado ? 'Copiado!' : 'Copiar'} <span className="visualmente-oculto">{titulo}</span>
        </button>
      </figcaption>
      <pre className={estilos.pre} tabIndex={0} aria-label={`Código: ${titulo}`}>
        <code>{codigo.trimEnd()}</code>
      </pre>
    </figure>
  )
}
/* Fim do Codigo. */
