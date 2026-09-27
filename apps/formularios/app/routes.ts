/*
 * Mapa de rotas (modo framework). No projeto original, cada rota era um
 * app.get do Express com res.render; aqui cada uma é um módulo com loader,
 * action e componente.
 */
import { index, route, type RouteConfig } from '@react-router/dev/routes'

export default [
  index('routes/inicio.tsx'),
  route('sobre', 'routes/sobre.tsx'),
  route('contato', 'routes/contato.tsx'),
  route('contato/enviado', 'routes/enviado.tsx'),
  route('mensagens', 'routes/mensagens.tsx'),
  route('*', 'routes/nao-encontrado.tsx'),
] satisfies RouteConfig
/* Fim do mapa de rotas. */
