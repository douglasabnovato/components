/*
 * Emblema: símbolo geométrico de cada herói, desenhado para o projeto,
 * sobre um disco na cor do herói. É decorativo quando há texto ao lado.
 */
import type { Emblema as TipoEmblema } from '../dominio/tipos'

const desenhos: Record<TipoEmblema, string> = {
  onda: 'M10 36c6-8 12-8 18 0s12 8 18 0 M10 26c6-8 12-8 18 0s12 8 18 0',
  raiz: 'M32 12v18 M32 30c-6 4-10 10-12 20 M32 30c6 4 10 10 12 20 M32 34v18',
  pena: 'M20 48c4-18 14-30 28-34-4 14-14 26-28 34z M20 48l14-18',
  flor: 'M32 20a6 6 0 1 1 0 12a6 6 0 1 1 0-12 M32 14v-2 M32 40v12 M20 26h-4 M48 26h-4 M24 18l-3-3 M40 18l3-3',
  brasa:
    'M32 50c-9 0-14-6-14-13 0-9 8-12 9-22 5 5 6 10 5 14 3-2 5-5 5-8 5 5 9 10 9 16 0 7-5 13-14 13z',
  nevoa: 'M12 24h28 M18 32h34 M12 40h26 M44 40h8',
  circuito: 'M16 32h10 M38 32h10 M32 16v10 M32 38v10 M26 26h12v12H26z',
  eco: 'M28 32a4 4 0 1 0 8 0a4 4 0 1 0-8 0 M22 22a14 14 0 0 0 0 20 M42 22a14 14 0 0 1 0 20 M16 16a22 22 0 0 0 0 32 M48 16a22 22 0 0 1 0 32',
  prisma: 'M32 14l16 30H16z M10 30h14 M40 34l14-6 M40 38l14 2',
  bussola: 'M32 12v6 M32 46v6 M12 32h6 M46 32h6 M32 20l6 12-6 12-6-12z',
  escudo: 'M32 12l16 6v12c0 12-7 19-16 22-9-3-16-10-16-22V18z M32 22v20',
  lua: 'M40 16a16 16 0 1 0 8 26A13 13 0 1 1 40 16z',
}

type Props = { emblema: TipoEmblema; cor: string; tamanho?: number; className?: string }

/* Desenha o disco e o símbolo. */
export function Emblema({ emblema, cor, tamanho = 64, className }: Props) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={tamanho}
      height={tamanho}
      aria-hidden="true"
      className={className}
    >
      <circle cx="32" cy="32" r="31" fill={cor} />
      <circle
        cx="32"
        cy="32"
        r="26"
        fill="none"
        stroke="#0B0C10"
        strokeOpacity="0.25"
        strokeWidth="2"
      />
      <path
        d={desenhos[emblema]}
        fill="none"
        stroke="#0B0C10"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
/* Fim do Emblema. */
