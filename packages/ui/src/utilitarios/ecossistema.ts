/*
 * Mapa do ecossistema: número, nome, pasta publicada e porta de desenvolvimento
 * de cada projeto. É a fonte única dos endereços entre hub, filhos e API.
 * O projeto 04 (SSR) usa a pasta /formularios/ também em desenvolvimento.
 */

export type ProjetoEcossistema = {
  numero: number
  nome: string
  slug: string
  porta: number
  pastaTambemNoDev?: boolean
}

export const ecossistema: ProjetoEcossistema[] = [
  { numero: 0, nome: 'Hub', slug: '', porta: 5170 },
  { numero: 1, nome: 'Flix', slug: 'flix', porta: 5171 },
  { numero: 2, nome: 'Cadastro', slug: 'cadastro', porta: 5172 },
  { numero: 3, nome: 'Portal de Heróis', slug: 'herois', porta: 5173 },
  {
    numero: 4,
    nome: 'Formulários no Servidor',
    slug: 'formularios',
    porta: 5174,
    pastaTambemNoDev: true,
  },
  { numero: 5, nome: 'Tarefas', slug: 'tarefas', porta: 5175 },
  { numero: 6, nome: 'Lista da Pelada', slug: 'pelada', porta: 5176 },
  { numero: 7, nome: 'Laboratório', slug: 'laboratorio', porta: 5177 },
  { numero: 8, nome: 'Trilha React', slug: 'trilha', porta: 5178 },
]

export const PORTA_API = 3333

/* Devolve o projeto pelo número; lança erro se não existir. */
export function projetoDoEcossistema(numero: number): ProjetoEcossistema {
  const projeto = ecossistema.find((p) => p.numero === numero)
  if (!projeto) throw new Error(`Projeto ${numero} não existe no ecossistema`)
  return projeto
}

/* Endereço de um projeto: porta própria em desenvolvimento, pasta no site publicado. */
export function enderecoDoProjeto(numero: number, caminho = '', dev = import.meta.env.DEV) {
  const { slug, porta, pastaTambemNoDev } = projetoDoEcossistema(numero)
  const limpo = caminho.replace(/^\//, '')
  if (dev) return `http://localhost:${porta}/${pastaTambemNoDev ? `${slug}/` : ''}${limpo}`
  return slug ? `/${slug}/${limpo}` : `/${limpo}`
}

/* Endereço do hub apontando para a seção de um filho (ex.: /#filho-6). */
export function enderecoDoHub(numero?: number, dev = import.meta.env.DEV) {
  const base = enderecoDoProjeto(0, '', dev)
  return numero ? `${base}#filho-${numero}` : base
}

/*
 * Endereço base da API compartilhada. É sempre /api no mesmo site: em
 * desenvolvimento o Vite encaminha para a porta 3333 (proxyDaApi) e, publicado,
 * o servidor faz o mesmo. Assim o navegador nunca precisa de CORS.
 */
export function enderecoDaApi() {
  return '/api'
}

/* Configuração de proxy do Vite que liga /api à API local. */
export function proxyDaApi() {
  return {
    '/api': {
      target: `http://127.0.0.1:${PORTA_API}`,
      changeOrigin: true,
      rewrite: (caminho: string) => caminho.replace(/^\/api/, ''),
    },
  }
}
/* Fim do mapa do ecossistema. */
