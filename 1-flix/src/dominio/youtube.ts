/*
 * Regras de YouTube do Flix: extrai o ID de 11 caracteres de qualquer formato
 * de link aceito e deriva capa, player (sem cookies) e link de origem.
 */

const HOSTS = new Set([
  'youtube.com',
  'www.youtube.com',
  'm.youtube.com',
  'music.youtube.com',
  'youtu.be',
  'www.youtube-nocookie.com',
  'youtube-nocookie.com',
])

const ID_VALIDO = /^[\w-]{11}$/

/* Devolve o ID do vídeo ou null se o link não for de um vídeo do YouTube. */
export function extrairYoutubeId(link: string): string | null {
  let url: URL
  try {
    url = new URL(link.trim())
  } catch {
    return null
  }
  if (!HOSTS.has(url.hostname)) return null

  const partes = url.pathname.split('/').filter(Boolean)
  let candidato: string | null | undefined = null

  if (url.hostname === 'youtu.be') candidato = partes[0]
  else if (partes[0] === 'watch') candidato = url.searchParams.get('v')
  else if (['shorts', 'embed', 'live', 'v'].includes(partes[0] ?? '')) candidato = partes[1]

  return candidato && ID_VALIDO.test(candidato) ? candidato : null
}

/* URL da capa em alta qualidade (sempre disponível para vídeos públicos). */
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
/* Fim das regras de YouTube. */
