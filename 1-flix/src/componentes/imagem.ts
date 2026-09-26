/*
 * Auxiliar de imagens externas: se a capa do YouTube não carregar (sem
 * internet ou vídeo removido), esconde o ícone de imagem quebrada.
 */
import type { SyntheticEvent } from 'react'

/* Oculta a imagem que falhou, mantendo o espaço e o fundo do card. */
export function ocultarSeFalhar(evento: SyntheticEvent<HTMLImageElement>) {
  evento.currentTarget.style.visibility = 'hidden'
}
/* Fim do auxiliar de imagens. */
