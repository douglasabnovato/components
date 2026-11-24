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
  | { tipo: 'erro'; mensagem: string; causa: CausaDoErro }

const cache = new Map<string, Perfil>()

const MENSAGEM_SEM_GITHUB = 'Não foi possível falar com o GitHub agora.'
/* Sem rede, a causa provável é a conexão da pessoa (#68). */
const MENSAGEM_SEM_CONEXAO = 'Sem conexão. Confira a internet e tente de novo.'
/* 403 e 429: o limite da API sem token (60 por hora por IP). */
export const MENSAGEM_LIMITE = 'O GitHub limitou as consultas. Tente daqui a alguns minutos.'
const INICIO_LIMITE = 'O GitHub limitou as consultas.'

/*
 * A causa do erro vai junto da mensagem (nota 0 da R19 do #70): o Organizador decide o estilo do
 * "Tentar de novo" pela causa, e não pelo texto, que pode mudar sem querer.
 */
export type CausaDoErro = 'rede' | 'limite' | 'inexistente' | 'api' | 'outra'

export class ErroDoPerfil extends Error {
  constructor(
    mensagem: string,
    readonly causa: CausaDoErro,
    opcoes?: ErrorOptions,
  ) {
    super(mensagem, opcoes)
    this.name = 'ErroDoPerfil'
  }
}

/*
 * Mensagem do limite com a hora em que ele libera (achado 3 da R19 do #69). Ordem (R19 do #70):
 * 1. Retry-After (segundos), que o GitHub manda no limite secundário e no 429;
 * 2. X-RateLimit-Reset (segundos desde 1970), só com X-RateLimit-Remaining em 0: o GitHub manda o
 *    Reset em toda resposta, também num 403 que não é do limite por hora.
 * Sem os dois, ou com hora que já passou, fica a frase genérica. A hora é arredondada para o minuto
 * seguinte, para quem tentar "às 10h47" não falhar de novo às 10:47:10.
 */
export function mensagemDeLimite(resposta: Response, agora = new Date()): string {
  const depois = Number(resposta.headers.get('retry-after'))
  const restantes = resposta.headers.get('x-ratelimit-remaining')
  const reset = Number(resposta.headers.get('x-ratelimit-reset'))
  const libera =
    depois > 0
      ? new Date(agora.getTime() + depois * 1000)
      : restantes === '0' && reset > 0
        ? new Date(reset * 1000)
        : null
  if (!libera || libera.getTime() <= agora.getTime()) return MENSAGEM_LIMITE
  const arredondada = new Date(Math.ceil(libera.getTime() / 60_000) * 60_000)
  const hh = String(arredondada.getHours()).padStart(2, '0')
  const mm = String(arredondada.getMinutes()).padStart(2, '0')
  return `${INICIO_LIMITE} Tente de novo depois das ${hh}h${mm}.`
}

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
    throw new ErroDoPerfil(MENSAGEM_SEM_CONEXAO, 'rede', { cause: falha })
  }
  if (resposta.status === 404)
    throw new ErroDoPerfil(`O usuário @${usuario} não existe no GitHub.`, 'inexistente')
  if (resposta.status === 403 || resposta.status === 429)
    throw new ErroDoPerfil(mensagemDeLimite(resposta), 'limite')
  if (!resposta.ok) throw new ErroDoPerfil(MENSAGEM_SEM_GITHUB, 'api')
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
 * guardado: é derivado de a última resposta ser de outro usuário ou de outra
 * tentativa. tentarDeNovo refaz a busca depois de um erro (#68).
 */
export function usePerfilGithub(usuario: string): {
  estado: EstadoPerfil
  tentarDeNovo: () => void
} {
  const [tentativa, setTentativa] = useState(0)
  const [resposta, setResposta] = useState<{
    usuario: string
    tentativa: number
    estado: EstadoPerfil
  } | null>(null)

  useEffect(() => {
    if (!usuario) return
    const controle = new AbortController()
    buscarPerfil(usuario, controle.signal)
      .then((perfil) => setResposta({ usuario, tentativa, estado: { tipo: 'pronto', perfil } }))
      .catch((erro: unknown) => {
        if (controle.signal.aborted) return
        const mensagem = erro instanceof Error ? erro.message : 'Erro inesperado.'
        const causa = erro instanceof ErroDoPerfil ? erro.causa : 'outra'
        setResposta({ usuario, tentativa, estado: { tipo: 'erro', mensagem, causa } })
      })
    return () => controle.abort()
  }, [usuario, tentativa])

  const tentarDeNovo = () => setTentativa((n) => n + 1)
  if (!usuario) return { estado: { tipo: 'vazio' }, tentarDeNovo }
  if (resposta?.usuario !== usuario || resposta.tentativa !== tentativa) {
    return { estado: { tipo: 'carregando' }, tentarDeNovo }
  }
  return { estado: resposta.estado, tentarDeNovo }
}
/* Fim do perfil do GitHub. */
