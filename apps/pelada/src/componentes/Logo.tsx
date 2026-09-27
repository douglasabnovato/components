/*
 * Logo da Lista da Pelada: bola estilizada, desenhada para o projeto.
 */

/* Desenha o símbolo e o nome. */
export function Logo() {
  return (
    <>
      <svg viewBox="0 0 64 64" width="32" height="32" aria-hidden="true">
        <rect width="64" height="64" rx="16" fill="var(--acento)" />
        <circle cx="32" cy="32" r="18" fill="none" stroke="var(--sobre-acento)" strokeWidth="4" />
        <path d="M32 22l8 6-3 10H27l-3-10z" fill="var(--sobre-acento)" />
      </svg>
      <span>Lista da Pelada</span>
    </>
  )
}
/* Fim do Logo. */
