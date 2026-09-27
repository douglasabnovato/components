/*
 * Apaga o banco local (pasta .dados). Na próxima vez que a API subir, as
 * tabelas e os exemplos são criados de novo.
 */
import { rm } from 'node:fs/promises'
import { PASTA_DADOS } from '../config'

await rm(PASTA_DADOS, { recursive: true, force: true })
console.log(`Banco local apagado: ${PASTA_DADOS}`)
/* Fim da limpeza. */
