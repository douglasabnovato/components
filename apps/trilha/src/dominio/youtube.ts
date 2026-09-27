/*
 * Endereços do YouTube derivados do ID do vídeo: capa, player sem cookies
 * e link para abrir no site.
 */

/* URL da capa em alta qualidade. */
export function capaDoVideo(youtubeId: string) {
  return `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`
}

/* URL do player sem cookies; autoplay porque só carrega após o clique. */
export function playerDoVideo(youtubeId: string) {
  return `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`
}

/* Link para abrir o vídeo no YouTube. */
export function linkDoVideo(youtubeId: string) {
  return `https://www.youtube.com/watch?v=${youtubeId}`
}
/* Fim dos endereços do YouTube. */
