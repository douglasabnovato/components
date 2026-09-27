/*
 * Tipos de uma lição: metadados, texto em MDX (desafio, conteúdo e solução),
 * a demonstração viva e o código-fonte da demo e do teste, lidos como texto.
 */
import type { MDXContent } from 'mdx/types'
import type { ComponentType } from 'react'

export type Modulo = { id: string; titulo: string; descricao: string }

export type Licao = {
  id: string
  modulo: string
  titulo: string
  resumo: string
  simbolo: string
  aprendizados: number[]
  historico?: boolean
  Texto: MDXContent
  Demo: ComponentType
  codigo: string
  teste: string
}
/* Fim dos tipos das lições. */
