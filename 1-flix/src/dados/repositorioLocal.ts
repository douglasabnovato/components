/*
 * Repositório do catálogo no localStorage, numa chave exclusiva do Flix
 * (nunca limpa dados de outros projetos do mesmo endereço). Dados inválidos
 * ou corrompidos são descartados e o catálogo inicial volta.
 */
import { normalizar } from '../dominio/catalogo'
import { catalogoInicial } from '../dominio/seed'
import { esquemaCatalogo, type Catalogo } from '../dominio/tipos'
import type { RepositorioCatalogo } from './repositorio'

export const CHAVE_ARMAZENAMENTO = 'components:flix:catalogo:v1'

/* Converte texto JSON em catálogo válido ou devolve null. */
export function lerCatalogo(texto: string | null): Catalogo | null {
  if (!texto) return null
  try {
    const resultado = esquemaCatalogo.safeParse(JSON.parse(texto))
    return resultado.success ? normalizar(resultado.data) : null
  } catch {
    return null
  }
}

/* Cria o repositório sobre um Storage (injetável nos testes). */
export function criarRepositorioLocal(
  armazenamento: Storage = window.localStorage,
): RepositorioCatalogo {
  /* Grava o catálogo serializado na chave do Flix. */
  function gravar(catalogo: Catalogo) {
    armazenamento.setItem(CHAVE_ARMAZENAMENTO, JSON.stringify(catalogo))
  }

  return {
    async carregar() {
      const salvo = lerCatalogo(armazenamento.getItem(CHAVE_ARMAZENAMENTO))
      if (salvo) return salvo
      const inicial = catalogoInicial()
      gravar(inicial)
      return inicial
    },
    async salvar(catalogo) {
      gravar(normalizar(catalogo))
    },
    async restaurar() {
      const inicial = catalogoInicial()
      gravar(inicial)
      return inicial
    },
  }
}
/* Fim do repositório local. */
