/*
 * Endereços usados pelas Tarefas: o hub (seção 05) e a API compartilhada,
 * sempre em /api no mesmo site (proxy do Vite em desenvolvimento).
 */
import { enderecoDaApi, enderecoDoHub } from '@components/ui'

export const URL_HUB = enderecoDoHub(5)
export const URL_API = enderecoDaApi()
/* Fim dos endereços. */
