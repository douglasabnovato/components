/*
 * Configuração do Vite dos Formulários no Servidor: o plugin do React Router
 * cuida do servidor de desenvolvimento com SSR, do build do cliente e do servidor.
 */
import { reactRouter } from '@react-router/dev/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/formularios/',
  plugins: [reactRouter()],
  server: { port: 5174, strictPort: true },
})
/* Fim da configuração do Vite. */
