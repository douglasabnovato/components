/*
 * Logo do Flix: moldura de tela com o símbolo de play, desenhada para o projeto.
 */

/* Desenha o símbolo e o nome. */
export function Logo() {
  return (
    <>
      <svg viewBox="0 0 64 64" width="32" height="32" aria-hidden="true">
        <rect width="64" height="64" rx="16" fill="var(--acento)" />
        <rect
          x="12"
          y="16"
          width="40"
          height="32"
          rx="8"
          fill="none"
          stroke="#fff"
          strokeWidth="4"
        />
        <path d="M28 25v14l12-7z" fill="#fff" />
      </svg>
      <span>Flix</span>
    </>
  )
}
/* Fim do Logo. */
