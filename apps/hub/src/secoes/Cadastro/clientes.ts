/*
 * Modelo e repositório em memória da demonstração do Cadastro.
 * O contrato RepositorioCliente é o mesmo que a versão via API vai cumprir.
 */

export type Cliente = {
  id: string
  nome: string
  idade: number
}

export type RepositorioCliente = {
  listar(): Cliente[]
  salvar(cliente: Omit<Cliente, 'id'> & { id?: string }): Cliente
  excluir(id: string): void
}

export type ErrosCliente = Partial<Record<'nome' | 'idade', string>>

/* Cria um repositório em memória com dados iniciais. */
export function criarRepositorioMemoria(iniciais: Cliente[] = []): RepositorioCliente {
  let clientes = [...iniciais]
  let sequencia = iniciais.length
  return {
    listar: () => [...clientes],
    salvar(dados) {
      if (dados.id) {
        const atualizado = { ...dados, id: dados.id }
        clientes = clientes.map((c) => (c.id === dados.id ? atualizado : c))
        return atualizado
      }
      sequencia += 1
      const novo = { ...dados, id: String(sequencia) }
      clientes = [...clientes, novo]
      return novo
    },
    excluir(id) {
      clientes = clientes.filter((c) => c.id !== id)
    },
  }
}

/* Valida nome (3+ letras) e idade (inteiro entre 0 e 130). */
export function validarCliente(nome: string, idade: string): ErrosCliente {
  const erros: ErrosCliente = {}
  if (nome.trim().length < 3) erros.nome = 'Informe um nome com pelo menos 3 letras.'
  const numero = Number(idade)
  if (idade.trim() === '' || !Number.isInteger(numero) || numero < 0 || numero > 130) {
    erros.idade = 'Informe uma idade entre 0 e 130.'
  }
  return erros
}
/* Fim do modelo de clientes. */
