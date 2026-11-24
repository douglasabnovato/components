/*
 * Perfil do organizador pela API pública do GitHub. O hook usa useEffect com
 * AbortController (cancela a busca anterior quando o usuário muda) e um cache
 * em memória para não repetir a mesma requisição.
 */
import { useEffect, useState } from 'react'

export type Perfil = { usuario: string; nome: string; avatar: string; url: string }

export type EstadoPerfil =
  | { tipo: 'vazio' }
  | { tipo: 'carregando' }
  | { tipo: 'pronto'; perfil: Perfil }
  | { tipo: 'erro'; mensagem: string }

const cache = new Map<string, Perfil>()

const MENSAGEM_SEM_GITHUB = 'Não foi possível falar com o GitHub agora.'

/* Limpa o cache (usado nos testes). */
export function limparCachePerfis() {
  cache.clear()
}

/* Busca o perfil; lança erro com mensagem amigável. */
export async function buscarPerfil(
  usuario: string,
  sinal?: AbortSignal,
  buscar: typeof fetch = fetch,
): Promise<Perfil> {
  const guardado = cache.get(usuario.toLowerCase())
  if (guardado) return guardado
  let resposta: Response
  try {
    resposta = await buscar(`https://api.github.com/users/${encodeURIComponent(usuario)}`, {
      signal: sinal,
      headers: { Accept: 'application/vnd.github+json' },
    })
  } catch (falha) {
    /* O cancelamento segue para o hook, que o ignora. Sem rede, DNS ou CORS, o fetch
       rejeita com TypeError ("Failed to fetch"): a tela mostra a mensagem amigável. */
    if (falha instanceof DOMException && falha.name === 'AbortError') throw falha
    throw new Error(MENSAGEM_SEM_GITHUB, { cause: falha })
  }
  if (resposta.status === 404) throw new Error(`O usuário @${usuario} não existe no GitHub.`)
  if (!resposta.ok) throw new Error(MENSAGEM_SEM_GITHUB)
  const dados = (await resposta.json()) as {
    login: string
    name: string | null
    avatar_url: string
    html_url: string
  }
  const perfil = {
    usuario: dados.login,
    nome: dados.name ?? dados.login,
    avatar: dados.avatar_url,
    url: dados.html_url,
  }
  cache.set(usuario.toLowerCase(), perfil)
  return perfil
}

/*
 * Acompanha o perfil do usuário informado. "Carregando" não é um estado
 * guardado: é derivado de a última resposta ser de outro usuário.
 */
export function usePerfilGithub(usuario: string): EstadoPerfil {
  const [resposta, setResposta] = useState<{ usuario: string; estado: EstadoPerfil } | null>(null)

  useEffect(() => {
    if (!usuario) return
    const controle = new AbortController()
    buscarPerfil(usuario, controle.signal)
      .then((perfil) => setResposta({ usuario, estado: { tipo: 'pronto', perfil } }))
      .catch((erro: unknown) => {
        if (controle.signal.aborted) return
        const mensagem = erro instanceof Error ? erro.message : 'Erro inesperado.'
        setResposta({ usuario, estado: { tipo: 'erro', mensagem } })
      })
    return () => controle.abort()
  }, [usuario])

  if (!usuario) return { tipo: 'vazio' }
  if (resposta?.usuario !== usuario) return { tipo: 'carregando' }
  return resposta.estado
}
/* Fim do perfil do GitHub. */
