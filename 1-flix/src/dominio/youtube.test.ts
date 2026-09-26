/*
 * Testes da extração do ID do YouTube em todos os formatos aceitos (B9).
 */
import { describe, expect, it } from 'vitest'
import { capaDoVideo, extrairYoutubeId, playerDoVideo } from './youtube'

describe('extrairYoutubeId', () => {
  it.each([
    'https://www.youtube.com/watch?v=Tn6-PIqc4UM',
    'https://youtube.com/watch?feature=share&v=Tn6-PIqc4UM',
    'https://m.youtube.com/watch?v=Tn6-PIqc4UM&t=30s',
    'https://youtu.be/Tn6-PIqc4UM?si=abc',
    'https://www.youtube.com/shorts/Tn6-PIqc4UM',
    'https://www.youtube.com/embed/Tn6-PIqc4UM',
    'https://www.youtube-nocookie.com/embed/Tn6-PIqc4UM',
    '  https://www.youtube.com/live/Tn6-PIqc4UM  ',
  ])('aceita %s', (link) => {
    expect(extrairYoutubeId(link)).toBe('Tn6-PIqc4UM')
  })

  it.each([
    '',
    'não é link',
    'https://vimeo.com/123456',
    'https://www.youtube.com/watch?v=curto',
    'https://www.youtube.com/@canal',
    'https://evil.com/watch?v=Tn6-PIqc4UM',
  ])('recusa %s', (link) => {
    expect(extrairYoutubeId(link)).toBeNull()
  })

  it('deriva capa e player sem cookies', () => {
    expect(capaDoVideo('Tn6-PIqc4UM')).toBe('https://i.ytimg.com/vi/Tn6-PIqc4UM/hqdefault.jpg')
    expect(playerDoVideo('Tn6-PIqc4UM')).toContain('youtube-nocookie.com/embed/Tn6-PIqc4UM')
  })
})
/* Fim dos testes de YouTube. */
