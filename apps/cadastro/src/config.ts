/*
 * Endereços usados pelo Cadastro: o hub (seção 02) e a API compartilhada vêm
 * do mapa do ecossistema. A API é sempre /api no mesmo site (proxy do Vite).
 */
import { enderecoDaApi, enderecoDoHub } from '@components/ui'

export const URL_HUB = enderecoDoHub(2)
export const URL_API = enderecoDaApi()
/* Fim dos endereços. */
