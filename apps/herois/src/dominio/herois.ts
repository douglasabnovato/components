/*
 * Regras do Portal de Heróis como funções puras: consultas por slug,
 * filtros guardados na URL, força total e comparação atributo a atributo.
 */
import { ATRIBUTOS, type ChaveAtributo, type Heroi } from './tipos'
import { equipes, herois as todos, universos } from './universo'

export type Filtros = { universo: string; equipe: string; busca: string }

/* Remove acentos e caixa para a busca. */
export function normalizar(texto: string) {
  return texto
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
}

/* Herói pelo slug, ou null. */
export function heroiPorSlug(slug: string) {
  return todos.find((h) => h.slug === slug) ?? null
}

/* Equipe pelo slug (sempre existe para heróis válidos). */
export function equipePorSlug(slug: string) {
  return equipes.find((e) => e.slug === slug) ?? null
}

/* Universo pelo slug. */
export function universoPorSlug(slug: string) {
  return universos.find((u) => u.slug === slug) ?? null
}

/* Universo de um herói, pela equipe. */
export function universoDoHeroi(heroi: Heroi) {
  return universoPorSlug(equipePorSlug(heroi.equipe)?.universo ?? '')
}

/* Heróis de uma equipe. */
export function heroisDaEquipe(slug: string, lista: Heroi[] = todos) {
  return lista.filter((h) => h.equipe === slug)
}

/* Lê os filtros da URL, ignorando valores que não existem. */
export function lerFiltros(parametros: URLSearchParams): Filtros {
  const universo = parametros.get('universo') ?? ''
  const equipe = parametros.get('equipe') ?? ''
  return {
    universo: universos.some((u) => u.slug === universo) ? universo : '',
    equipe: equipes.some((e) => e.slug === equipe) ? equipe : '',
    busca: parametros.get('busca') ?? '',
  }
}

/* Converte os filtros em parâmetros, sem os vazios. */
export function paraParametros(filtros: Filtros) {
  const p = new URLSearchParams()
  if (filtros.universo) p.set('universo', filtros.universo)
  if (filtros.equipe) p.set('equipe', filtros.equipe)
  if (filtros.busca.trim()) p.set('busca', filtros.busca)
  return p
}

/* Aplica universo, equipe e busca (nome, identidade, poderes e cidade). */
export function filtrarHerois(filtros: Filtros, lista: Heroi[] = todos) {
  const termo = normalizar(filtros.busca)
  return lista.filter((h) => {
    const equipe = equipePorSlug(h.equipe)
    if (filtros.universo && equipe?.universo !== filtros.universo) return false
    if (filtros.equipe && h.equipe !== filtros.equipe) return false
    if (!termo) return true
    return normalizar(`${h.nome} ${h.identidade} ${h.cidade} ${h.poderes.join(' ')}`).includes(
      termo,
    )
  })
}

/* Equipes visíveis para o universo escolhido (o filtro de equipe depende dele). */
export function equipesDoUniverso(universo: string) {
  return universo ? equipes.filter((e) => e.universo === universo) : equipes
}

/* Soma dos quatro atributos. */
export function forcaTotal(heroi: Heroi) {
  return ATRIBUTOS.reduce((soma, a) => soma + heroi.atributos[a.chave], 0)
}

/* Compara dois heróis atributo a atributo e no total. */
export function comparar(a: Heroi, b: Heroi) {
  const linhas = ATRIBUTOS.map(({ chave, rotulo }) => {
    const va = a.atributos[chave as ChaveAtributo]
    const vb = b.atributos[chave as ChaveAtributo]
    return { chave, rotulo, a: va, b: vb, vence: va === vb ? null : va > vb ? a.slug : b.slug }
  })
  const totalA = forcaTotal(a)
  const totalB = forcaTotal(b)
  return {
    linhas,
    totalA,
    totalB,
    vence: totalA === totalB ? null : totalA > totalB ? a.slug : b.slug,
  }
}

/* Verifica a integridade do universo; devolve a lista de problemas. */
export function problemasDoUniverso(lista: Heroi[] = todos) {
  const problemas: string[] = []
  if (new Set(lista.map((h) => h.slug)).size !== lista.length) problemas.push('Slug repetido')
  for (const h of lista) {
    if (!equipePorSlug(h.equipe)) problemas.push(`${h.nome}: equipe inexistente`)
  }
  for (const e of equipes) {
    if (!universoPorSlug(e.universo)) problemas.push(`${e.nome}: universo inexistente`)
    if (heroisDaEquipe(e.slug, lista).length === 0) problemas.push(`${e.nome}: sem heróis`)
  }
  return problemas
}
/* Fim das regras do Portal de Heróis. */
