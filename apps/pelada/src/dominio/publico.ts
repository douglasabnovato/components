/*
 * API pública do domínio da Pelada para outros projetos do monorepo
 * (o hub usa os jogos iniciais e a regra de confirmação na seção 06).
 */
export { confirmar, desistir, formatarData, situacaoDoJogo } from './pelada'
export { jogosIniciais } from './seed'
export type { Jogador, Jogo } from './tipos'
/* Fim da API pública do domínio. */
