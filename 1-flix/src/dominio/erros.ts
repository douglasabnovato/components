/*
 * Erro de regra de negócio do Flix, com mensagem pronta para a interface.
 * Fica fora de tipos.ts para as regras não carregarem o Zod no hub.
 */
export class ErroDominio extends Error {
  constructor(mensagem: string) {
    super(mensagem)
    this.name = 'ErroDominio'
  }
}
/* Fim do erro de domínio. */
