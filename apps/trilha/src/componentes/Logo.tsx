/*
 * Logo da Trilha: três marcos ligados por um caminho, desenhado para o projeto.
 */

/* Desenha o símbolo e o nome. */
export function Logo() {
  return (
    <>
      <svg viewBox="0 0 64 64" width="32" height="32" aria-hidden="true">
        <rect width="64" height="64" rx="16" fill="var(--acento)" />
        <path
          d="M14 46c8-2 10-10 18-14s12-10 18-16"
          fill="none"
          stroke="var(--sobre-acento)"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <circle cx="14" cy="46" r="5" fill="var(--sobre-acento)" />
        <circle cx="32" cy="32" r="5" fill="var(--sobre-acento)" />
        <circle cx="50" cy="16" r="5" fill="var(--sobre-acento)" />
      </svg>
      <span>Trilha React</span>
    </>
  )
}
/* Fim do Logo. */
