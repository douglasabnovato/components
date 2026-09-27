/*
 * Rota coringa: qualquer endereço desconhecido responde 404, que o
 * ErrorBoundary da raiz desenha dentro do layout.
 */
import { data } from 'react-router'

/* Lança 404 no servidor e no navegador. */
export function loader() {
  throw data('Não encontrado', { status: 404 })
}

/* Nunca chega a renderizar: o ErrorBoundary assume. */
export default function NaoEncontrado() {
  return null
}
/* Fim da rota coringa. */
