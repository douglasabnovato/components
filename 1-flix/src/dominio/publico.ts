/*
 * API pública do domínio do Flix para outros projetos do monorepo
 * (o hub usa para mostrar o catálogo real na seção 01).
 */
export { categoriasComVideos, destaqueDaCategoria, videosDaCategoria } from './catalogo'
export { catalogoInicial } from './seed'
export type { Catalogo, Categoria, Video } from './tipos'
export { capaDoVideo } from './youtube'
/* Fim da API pública do domínio. */
