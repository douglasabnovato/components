/*
 * Repositório via API REST (camada de serviço): uma única função de
 * requisição trata JSON, status HTTP e falhas de rede, e converte tudo em
 * ErroRepositorio, o mesmo erro do repositório em memória.
 */
import {
  esquemaCliente,
  esquemaErroApi,
  type Cliente,
  type DadosCliente,
} from '@components/contratos'
import { z } from 'zod'
import { ErroRepositorio, type RepositorioClientes, type TipoErro } from './repositorio'

type Buscar = (url: string, init?: RequestInit) => Promise<Response>

const TIPOS: Record<number, TipoErro> = { 400: 'validacao', 404: 'nao-encontrado', 409: 'conflito' }

/* Cria o repositório sobre a URL base da API e um fetch injetável. */
export function criarRepositorioHttp(
  base: string,
  buscar: Buscar = fetch.bind(globalThis),
): RepositorioClientes {
  /* Faz a requisição e devolve o corpo já validado pelo esquema. */
  async function requisitar<T>(caminho: string, esquema: z.ZodType<T> | null, init?: RequestInit) {
    let resposta: Response
    try {
      resposta = await buscar(`${base}${caminho}`, {
        ...init,
        headers: init?.body ? { 'Content-Type': 'application/json' } : undefined,
      })
    } catch {
      throw new ErroRepositorio('indisponivel', 'A API não respondeu. Ela está ligada?')
    }
    if (!resposta.ok) {
      const corpo = esquemaErroApi.safeParse(await resposta.json().catch(() => null))
      const mensagem = corpo.success ? corpo.data.erro : `Erro ${resposta.status} da API.`
      throw new ErroRepositorio(
        TIPOS[resposta.status] ?? 'indisponivel',
        mensagem,
        corpo.data?.campos,
      )
    }
    if (!esquema) return undefined as T
    return esquema.parse(await resposta.json())
  }

  return {
    listar(consulta = {}) {
      const p = new URLSearchParams()
      if (consulta.busca) p.set('busca', consulta.busca)
      if (consulta.ordem) p.set('ordem', consulta.ordem)
      const sufixo = p.size ? `?${p}` : ''
      return requisitar(`/clientes${sufixo}`, z.array(esquemaCliente))
    },
    obter(id) {
      return requisitar(`/clientes/${encodeURIComponent(id)}`, esquemaCliente)
    },
    criar(dados: DadosCliente): Promise<Cliente> {
      return requisitar('/clientes', esquemaCliente, {
        method: 'POST',
        body: JSON.stringify(dados),
      })
    },
    atualizar(id, dados) {
      return requisitar(`/clientes/${encodeURIComponent(id)}`, esquemaCliente, {
        method: 'PUT',
        body: JSON.stringify(dados),
      })
    },
    excluir(id) {
      return requisitar(`/clientes/${encodeURIComponent(id)}`, null, { method: 'DELETE' })
    },
  }
}
/* Fim do repositório via API. */
