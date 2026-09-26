/*
 * Exportação e importação do catálogo em arquivo JSON (backup dos dados
 * que ficam no navegador). A importação passa pela mesma validação do Zod.
 */
import { esquemaCatalogo, ErroDominio, type Catalogo } from '../dominio/tipos'
import { normalizar } from '../dominio/catalogo'

/* Gera o download de um arquivo .json com o catálogo atual. */
export function exportarCatalogo(catalogo: Catalogo) {
  const blob = new Blob([JSON.stringify(catalogo, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `flix-catalogo-${new Date().toISOString().slice(0, 10)}.json`
  link.click()
  URL.revokeObjectURL(url)
}

/* Lê o texto de um arquivo importado e devolve um catálogo válido. */
export function importarCatalogo(texto: string): Catalogo {
  let dados: unknown
  try {
    dados = JSON.parse(texto)
  } catch {
    throw new ErroDominio('O arquivo não é um JSON válido.')
  }
  const resultado = esquemaCatalogo.safeParse(dados)
  if (!resultado.success) throw new ErroDominio('O arquivo não é um catálogo do Flix.')
  return normalizar(resultado.data)
}
/* Fim da exportação e importação. */
