/*
 * Prepara o banco antes de o servidor subir: apaga a pasta, cria as tabelas e
 * os exemplos e fecha. Usado no build do Render, para que o servidor de
 * produção encontre o banco pronto e não rode o initdb na inicialização
 * (o maior pico de memória da subida).
 */
import { rm } from 'node:fs/promises'
import { PASTA_DADOS } from '../config'
import { abrirBanco } from './conexao'

await rm(PASTA_DADOS, { recursive: true, force: true })
const { cliente } = await abrirBanco({ pasta: PASTA_DADOS, memoriaReduzida: true })
await cliente.close()
console.log(`Banco preparado com os dados de exemplo: ${PASTA_DADOS}`)
/* Fim da preparação. */
