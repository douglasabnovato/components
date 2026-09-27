/*
 * API pública das Tarefas para outros projetos do monorepo: o hub usa as
 * regras de atalho, destaque e contagem na seção 05.
 */
export { comandoDaTecla, contar, destacar, filtrarPorSituacao } from './tarefas'
export { validarPadrao, type Tarefa } from '@components/contratos'
/* Fim da API pública. */
