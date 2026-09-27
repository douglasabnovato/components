/*
 * API pública do domínio da Trilha para outros projetos do monorepo: o hub
 * mostra os módulos na seção 08 e o Laboratório liga lições aos aprendizados.
 */
export { categorias, tecnologias } from '../dados/stack'
export { aprendizados, modulos } from '../dados/trilha'
export { formatarMinutos, paraMinutos } from './duracao'
export { contarStack } from './stack'
export { aprendizadoPorNumero, aprendizadosDoModulo, resumir } from './trilha'
export type { Aprendizado, Modulo, Tecnologia } from './tipos'
/* Fim da API pública do domínio. */
