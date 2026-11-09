/*
 * Entrada da pré-renderização (#36): gera, no build, o HTML do cabeçalho, do
 * topo e do rodapé para o index.html. O título aparece no primeiro quadro,
 * antes do JavaScript, e o main.tsx hidrata esse HTML. As seções de projeto
 * chegam depois da primeira pintura, então aqui sai só o espaço reservado.
 */
import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { App } from './App'

/* Devolve o HTML inicial do App. */
export function renderizar() {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
/* Fim da entrada da pré-renderização. */
