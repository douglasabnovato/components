/*
 * Testes da conexão no modo de memória reduzida, usado pelo servidor de
 * produção: o banco abre, recebe os exemplos e aplica os parâmetros econômicos.
 */
import { abrirBanco } from '../banco/conexao'

describe('abrirBanco com memória reduzida', () => {
  it('abre, migra e aplica os parâmetros econômicos', async () => {
    const { cliente } = await abrirBanco({ memoriaReduzida: true })
    const tarefas = await cliente.query<{ total: number }>(
      'SELECT count(*)::int AS total FROM tarefas',
    )
    const buffers = await cliente.query<{ shared_buffers: string }>('SHOW shared_buffers')
    await cliente.close()

    expect(tarefas.rows[0]?.total).toBeGreaterThan(0)
    expect(buffers.rows[0]?.shared_buffers).toBe('16MB')
  })
})
/* Fim dos testes da conexão. */
