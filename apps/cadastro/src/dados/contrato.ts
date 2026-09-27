/*
 * Bateria de testes do contrato do repositório. Qualquer implementação
 * (memória, API ou outra no futuro) precisa passar por ela inteira: é o que
 * garante que a tela funciona igual com qualquer origem de dados.
 */
import { describe, expect, it } from 'vitest'
import { ErroRepositorio, type RepositorioClientes } from './repositorio'

const INEXISTENTE = '00000000-0000-0000-0000-000000000000'

/* Espera que a promessa falhe com um ErroRepositorio do tipo indicado. */
async function falhaCom(promessa: Promise<unknown>, tipo: ErroRepositorio['tipo']) {
  const erro = await promessa.then(
    () => null,
    (e: unknown) => e,
  )
  expect(erro).toBeInstanceOf(ErroRepositorio)
  expect((erro as ErroRepositorio).tipo).toBe(tipo)
  return erro as ErroRepositorio
}

/* Registra os testes do contrato para uma fábrica de repositório. */
export function testarContratoRepositorio(nome: string, criar: () => Promise<RepositorioClientes>) {
  describe(`Contrato do repositório · ${nome}`, () => {
    it('lista os 4 clientes iniciais em ordem de nome', async () => {
      const repo = await criar()
      expect((await repo.listar()).map((c) => c.nome)).toEqual([
        'Ana Ribeiro',
        'Bruno Costa',
        'Carla Souza',
        'Diego Lima',
      ])
    })

    it('busca por nome ou e-mail e ordena por idade', async () => {
      const repo = await criar()
      expect((await repo.listar({ busca: 'souza' })).map((c) => c.nome)).toEqual(['Carla Souza'])
      expect((await repo.listar({ busca: 'DIEGO.LIMA@' })).map((c) => c.nome)).toEqual([
        'Diego Lima',
      ])
      expect((await repo.listar({ ordem: 'idade' })).map((c) => c.idade)).toEqual([27, 31, 34, 45])
    })

    it('cria normalizando os dados e depois obtém pelo id', async () => {
      const repo = await criar()
      const novo = await repo.criar({
        nome: '  Elisa Prado ',
        email: 'ELISA@Exemplo.com',
        idade: 29,
      })
      expect(novo).toMatchObject({ nome: 'Elisa Prado', email: 'elisa@exemplo.com', idade: 29 })
      expect(await repo.obter(novo.id)).toEqual(novo)
      expect(await repo.listar()).toHaveLength(5)
    })

    it('atualiza e exclui', async () => {
      const repo = await criar()
      const [ana] = await repo.listar()
      const alterada = await repo.atualizar(ana!.id, {
        nome: 'Ana R.',
        email: ana!.email,
        idade: 35,
      })
      expect(alterada).toMatchObject({ id: ana!.id, nome: 'Ana R.', idade: 35 })
      await repo.excluir(ana!.id)
      expect((await repo.listar()).map((c) => c.id)).not.toContain(ana!.id)
    })

    it('recusa dados inválidos com a mensagem de cada campo', async () => {
      const repo = await criar()
      const erro = await falhaCom(repo.criar({ nome: 'Al', email: 'x', idade: 200 }), 'validacao')
      expect(erro.campos).toEqual({
        nome: 'Informe um nome com pelo menos 3 letras.',
        email: 'Informe um e-mail válido.',
        idade: 'Informe uma idade entre 0 e 130.',
      })
    })

    it('não deixa repetir e-mail ao criar nem ao atualizar', async () => {
      const repo = await criar()
      const erro = await falhaCom(
        repo.criar({ nome: 'Outra Ana', email: 'ana.ribeiro@exemplo.com', idade: 20 }),
        'conflito',
      )
      expect(erro.campos.email).toBe('Este e-mail já está cadastrado.')
      const [, bruno] = await repo.listar()
      await falhaCom(
        repo.atualizar(bruno!.id, {
          nome: bruno!.nome,
          email: 'ana.ribeiro@exemplo.com',
          idade: 1,
        }),
        'conflito',
      )
    })

    it('avisa quando o cliente não existe', async () => {
      const repo = await criar()
      await falhaCom(repo.obter(INEXISTENTE), 'nao-encontrado')
      await falhaCom(repo.excluir(INEXISTENTE), 'nao-encontrado')
      await falhaCom(
        repo.atualizar(INEXISTENTE, { nome: 'Fulano', email: 'f@exemplo.com', idade: 1 }),
        'nao-encontrado',
      )
    })
  })
}
/* Fim da bateria do contrato. */
