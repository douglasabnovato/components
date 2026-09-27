/*
 * Configuração do React Router em modo framework: renderização no servidor
 * (SSR) ligada e o app publicado sob /formularios/, ao lado do hub.
 */
import type { Config } from '@react-router/dev/config'

export default {
  ssr: true,
  basename: '/formularios/',
} satisfies Config
/* Fim da configuração do React Router. */
