/*
 * Marca: símbolo e nome do hub. O símbolo é um par de chaves angulares
 * com uma barra, desenhado para o projeto.
 */
import { site } from '../dados/projetos'

/* Desenha o símbolo em SVG e o nome ao lado. */
export function Marca() {
  return (
    <>
      <svg viewBox="0 0 64 64" width="28" height="28" aria-hidden="true">
        <rect width="64" height="64" rx="16" fill="var(--superficie-2)" />
        <path
          d="M24 20 12 32l12 12M40 20l12 12-12 12"
          fill="none"
          stroke="var(--acento-ativo, #c4f042)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="m35 16-6 32" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
      </svg>
      <span>{site.nome}</span>
    </>
  )
}
/* Fim da Marca. */
