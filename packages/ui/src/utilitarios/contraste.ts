/*
 * Utilitários de contraste WCAG 2.x: luminância relativa, razão entre duas
 * cores e escolha automática da cor de texto sobre um fundo qualquer.
 */

export const TEXTO_CLARO = '#FFFFFF'
export const TEXTO_ESCURO = '#0B0C10'

/* Converte "#abc" ou "#aabbcc" em componentes RGB de 0 a 255. */
export function hexParaRgb(hex: string): [number, number, number] {
  const limpo = hex.trim().replace('#', '')
  const cheio =
    limpo.length === 3
      ? limpo
          .split('')
          .map((c) => c + c)
          .join('')
      : limpo
  if (!/^[0-9a-fA-F]{6}$/.test(cheio)) throw new Error(`Cor inválida: ${hex}`)
  return [0, 2, 4].map((i) => parseInt(cheio.slice(i, i + 2), 16)) as [number, number, number]
}

/* Luminância relativa segundo a WCAG. */
export function luminancia(hex: string): number {
  const [r, g, b] = hexParaRgb(hex).map((canal) => {
    const c = canal / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  }) as [number, number, number]
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/* Razão de contraste entre duas cores, de 1 a 21. */
export function razaoContraste(corA: string, corB: string): number {
  const [maior, menor] = [luminancia(corA), luminancia(corB)].sort((a, b) => b - a) as [
    number,
    number,
  ]
  return (maior + 0.05) / (menor + 0.05)
}

/* Escolhe entre texto claro e escuro o que tiver mais contraste com o fundo. */
export function corDoTextoSobre(fundo: string): string {
  return razaoContraste(fundo, TEXTO_CLARO) >= razaoContraste(fundo, TEXTO_ESCURO)
    ? TEXTO_CLARO
    : TEXTO_ESCURO
}

/* Classifica a razão no nível WCAG para texto normal. */
export function nivelWcag(razao: number): 'AAA' | 'AA' | 'Insuficiente' {
  if (razao >= 7) return 'AAA'
  if (razao >= 4.5) return 'AA'
  return 'Insuficiente'
}
/* Fim dos utilitários de contraste. */
