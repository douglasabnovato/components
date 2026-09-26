/*
 * Contrato de persistência do catálogo. A implementação atual usa o
 * localStorage; uma implementação via API cumprirá o mesmo contrato.
 */
import type { Catalogo } from '../dominio/tipos'

export type RepositorioCatalogo = {
  carregar(): Promise<Catalogo>
  salvar(catalogo: Catalogo): Promise<void>
  restaurar(): Promise<Catalogo>
}
/* Fim do contrato de persistência. */
