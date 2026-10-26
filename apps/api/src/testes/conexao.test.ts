/*
 * Testes da conexão no modo de memória reduzida, no mesmo fluxo da produção:
 * o build prepara o banco numa pasta e fecha; o servidor reabre a mesma pasta
 * e já encontra os exemplos e os parâmetros econômicos em vigor.
 */
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { abrirBanco } from '../banco/conexao'

describe('abrirBanco com memória reduzida', () => {
  it('aplica os parâmetros econômicos ao reabrir o banco preparado', async () => {
    const pasta = mkdtempSync(join(tmpdir(), 'banco-'))
    try {
      const preparado = await abrirBanco({ pasta, memoriaReduzida: true })
      await preparado.cliente.close()

      const { cliente } = await abrirBanco({ pasta, memoriaReduzida: true })
      const tarefas = await cliente.query<{ total: number }>(
        'SELECT count(*)::int AS total FROM tarefas',
      )
      const buffers = await cliente.query<{ shared_buffers: string }>('SHOW shared_buffers')
      await cliente.close()

      expect(tarefas.rows[0]?.total).toBeGreaterThan(0)
      expect(buffers.rows[0]?.shared_buffers).toBe('16MB')
    } finally {
      rmSync(pasta, { recursive: true, force: true })
    }
  })
})
/* Fim dos testes da conexão. */
